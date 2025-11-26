export const formatPrice = (ptt: number) =>
    (ptt / 1000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });

export const parsePriceToThousand = (txt: string): number | null => {
    const clean = txt.replace(/\s/g, "");
    // troca vírgula por ponto e remove tudo que não for dígito/ponto
    const normalized = clean.replace(",", ".").replace(/[^0-9.]/g, "");
    if (!normalized) return null;
    const n = Number(normalized);
    if (Number.isNaN(n)) return null;
    // multiplica por 1000 e arredonda
    return Math.round(n * 1000);
};