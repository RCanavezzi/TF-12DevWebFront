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

            // 🚨 NOVO: Tratamento do tipo 'reaction' recebido do servidor
            if (data.type === "reaction") {
                addMessage({
                    text: `${data.name} reagiu com ${data.reaction}`, // Texto descritivo para fallback
                    self: data.name === name,
                    from: data.name,
                    type: "reaction", // Novo tipo
                    reaction: data.reaction, // O valor do emoji ("👍" ou "👎")
                });
                return;
            }
            // 🚨 FIM NOVO

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

    // 🚨 NOVO: Função para enviar uma reação rápida (👍 ou 👎)
    const sendReaction = (reaction: "👍" | "👎") => {
        if (!joined || status !== "open") return;

        // 1. Enviar o evento 'reaction' via WebSocket
        sendMessage?.(
            JSON.stringify({
                type: "reaction",
                name,
                reaction,
            }),
        );

        // 2. Adicionar a reação localmente para feedback imediato do usuário
        addMessage({
            text: `Você reagiu com ${reaction}`,
            self: true,
            from: name,
            type: "reaction",
            reaction: reaction,
        });
    };
    // 🚨 FIM NOVO

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
                        {/* ... (código do formulário de entrada) ... */}
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

                            {messages.map((m) => {
                                // 💡 ALTERAÇÃO: Renderização customizada para REACTION
                                if (m.type === "reaction" && m.reaction) {
                                    const reactionText = m.self
                                        ? `Você reagiu com ${m.reaction}`
                                        : `${m.from} reagiu com ${m.reaction}`;

                                    // Retorna uma linha centralizada e discreta para a reação
                                    return (
                                        <div
                                            key={m.id}
                                            className="text-center my-2 small fw-semibold text-primary"
                                        >
                                            {reactionText}
                                        </div>
                                    );
                                }
                                // 💡 FIM ALTERAÇÃO

                                // Renderização de mensagens normais e de sistema
                                return (
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
                                );
                            })}

                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* 🚨 NOVO: Botões de Ação Rápida (Aprovado/Reprovado) */}
                        <div className="d-flex gap-2 mb-2">
                            <button
                                type="button"
                                className="btn btn-lg btn-outline-success w-100"
                                disabled={!wsReady}
                                onClick={() => sendReaction("👍")}
                            >
                                👍 Aprovado
                            </button>
                            <button
                                type="button"
                                className="btn btn-lg btn-outline-danger w-100"
                                disabled={!wsReady}
                                onClick={() => sendReaction("👎")}
                            >
                                👎 Reprovado
                            </button>
                        </div>
                        {/* 🚨 FIM NOVO */}


                        {/* linha de EMOJIs (código original, sem alteração na lógica) */}
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

                        {/* linha com INPUT + ENVIAR (código original) */}
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