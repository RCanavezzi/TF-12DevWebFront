// Chat.types.ts
export type ChatMessage = {
    id: number;
    text: string;
    self: boolean;
    from: string | null;
    type: "system" | "message";
};
