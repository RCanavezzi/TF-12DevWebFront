import { useEffect, useRef, useState, useCallback } from "react";
import {
    UseWebSocketOptions,
    UseWebSocketReturn,
    WebSocketStatus,
} from "./websocket.types";


const DEFAULT_WS_URL = import.meta.env.VITE_SOCKET_HOST ?? "ws://localhost:8081";

export function useWebSocket(
    { onOpen, onClose, onError, onMessage }: UseWebSocketOptions = {},
): UseWebSocketReturn {
    const socketRef = useRef<WebSocket | null>(null);

    const [status, setStatus] = useState<WebSocketStatus>(() =>
        typeof window === "undefined" || typeof WebSocket === "undefined"
            ? "unavailable"
            : "connecting",
    );
    const [lastMessage, setLastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || typeof WebSocket === "undefined") {
            setStatus("unavailable");
            return;
        }

        const socket = new WebSocket(DEFAULT_WS_URL);
        socketRef.current = socket;

        setStatus("connecting");

        socket.onopen = () => {
            setStatus("open");
            onOpen?.();
        };

        socket.onmessage = (event) => {
            setLastMessage(event.data);
            onMessage?.(event);
        };

        socket.onerror = (event) => {
            onError?.(event);
        };

        socket.onclose = () => {
            setStatus("closed");
            onClose?.();
        };

        return () => {
            if (
                socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING
            ) {
                socket.close();
            }
        };
    }, [onOpen, onClose, onError, onMessage]);

    const sendMessage = useCallback((message: string) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket não está aberto. Mensagem não enviada:", message);
            return;
        }
        socket.send(message);
    }, []);

    const disconnect = useCallback(() => {
        const socket = socketRef.current;
        if (!socket) return;

        if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        ) {
            socket.close();
        }
    }, []);

    return {
        status,
        lastMessage,
        sendMessage,
        disconnect,
    };
}
