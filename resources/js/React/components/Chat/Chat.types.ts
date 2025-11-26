// Chat.types.ts
export type ChatMessage = {
    id: number;
    text: string;
    self: boolean;
    from: string | null;
    // 💡 Alteração 1: Adicionar "reaction" como um tipo de mensagem válido
    type: "system" | "message" | "reaction";
    // 💡 Alteração 2: Novo campo opcional para armazenar o valor da reação
    reaction?: "👍" | "👎";
};