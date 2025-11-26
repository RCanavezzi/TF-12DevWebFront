import { FormEvent, useEffect, useRef, useState } from "react";
import { useWebSocket } from "../../hooks/useWebsocket/useWebsocket";
import { ChatMessage } from "./Chat.types";

function statusLabel(status: string) {
    if (status === "open") return "Conectado";
    if (status === "connecting") return "Conectando...";
    if (status === "closed") return "Desconectado";
    return "Indisponível";
}

export default function Chat() {
    const { status, lastMessage, sendMessage } = useWebSocket();

    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const addMessage = (msg: Omit<ChatMessage, "id">) => {
        setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
    };

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const data = JSON.parse(lastMessage);

            if (data.type === "system") {
                addMessage({
                    text: data.text,
                    self: false,
                    from: null,
                    type: "system",
                });
                return;
            }

            if (data.type === "message") {
                addMessage({
                    text: data.text,
                    self: data.name === name,
                    from: data.name,
                    type: "message",
                });
                return;
            }

            addMessage({
                text: String(lastMessage),
                self: false,
                from: null,
                type: "system",
            });
        } catch {
            addMessage({
                text: lastMessage,
                self: false,
                from: null,
                type: "system",
            });
        }
    }, [lastMessage, name]);

    useEffect(() => {
        if (!messagesEndRef.current) return;

        messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const handleJoin = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setJoined(true);

        sendMessage?.(
            JSON.stringify({
                type: "join",
                name: trimmed,
            }),
        );
    };

    // helper pra enviar qualquer texto (normal ou emoji)
    const sendChat = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || !joined) return;

        sendMessage?.(
            JSON.stringify({
                type: "message",
                name,
                text: trimmed,
            }),
        );
    };

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        sendChat(input);
        setInput("");
    };

    const emojis = ["🔥", "👍", "👎", "❤️", "🗿", "💣", "✅", "👀"];

    const wsReady = status === "open" && joined;

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <p className="mb-2">
                    <strong>Status WebSocket:</strong> {statusLabel(status)} (
                    <code>ws://localhost:8081</code>)
                </p>

                {!joined ? (
                    <form onSubmit={handleJoin} className="mb-3">
                        <div className="mb-3">
                            <label className="form-label">Seu nome</label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!name.trim() || status !== "open"}
                        >
                            Entrar no chat
                        </button>
                    </form>
                ) : (
                    <>
                        <div
                            className="mb-3 border rounded p-2"
                            style={{ maxHeight: 320, overflowY: "auto" }}
                        >
                            {messages.length === 0 && (
                                <p className="text-muted text-center my-2">
                                    Nenhuma mensagem ainda.
                                </p>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={
                                        "d-flex mb-2 " +
                                        (m.self ? "justify-content-end" : "justify-content-start")
                                    }
                                >
                                    <div
                                        className={
                                            "px-3 py-2 rounded-3 " +
                                            (m.type === "system"
                                                ? "bg-light text-muted"
                                                : m.self
                                                    ? "bg-primary text-white"
                                                    : "bg-white border")
                                        }
                                    >
                                        <div className="small fw-semibold mb-1">
                                            {m.type === "system"
                                                ? "Sistema"
                                                : m.self
                                                    ? "Você"
                                                    : m.from ?? "Usuário"}
                                        </div>
                                        <div className="small">{m.text}</div>
                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* linha de EMOJIs */}
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    disabled={!wsReady}
                                    onClick={() => sendChat(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        {/* linha com INPUT + ENVIAR */}
                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input
                                className="form-control"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite uma mensagem..."
                            />
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!input.trim() || status !== "open"}
                            >
                                Enviar
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
