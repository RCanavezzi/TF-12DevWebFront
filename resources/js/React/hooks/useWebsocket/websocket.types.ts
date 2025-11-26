export type WebSocketStatus = "connecting" | "open" | "closing" | "closed" | "unavailable";

export interface UseWebSocketOptions {
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (event: MessageEvent) => void;
}

export interface UseWebSocketReturn {
    status: WebSocketStatus;
    lastMessage: string | null;
    sendMessage: (message: string) => void;
    disconnect: () => void;
}
