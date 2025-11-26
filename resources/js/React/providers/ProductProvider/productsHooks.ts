import { useContext } from "react";
import productsContext from "./ProductsContext";

export function useProductsContext() {
    const ctx = useContext(productsContext);
    if (!ctx) throw new Error("useProducts deve ser usado dentro de <ProductsProvider>");
    return ctx;
}