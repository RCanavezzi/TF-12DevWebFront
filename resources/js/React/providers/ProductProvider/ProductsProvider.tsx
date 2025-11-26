import React, { useMemo, useReducer } from "react";
import { ProductsContextValues, ProductsProviderProps } from "./products.types";
import { productsReducer } from "./productsReducer";
import ProductsContext from "./ProductsContext";

export default function ProductsProvider({ children }: ProductsProviderProps) {

    const [state, dispatch] = useReducer(productsReducer, {});

    const api = useMemo<ProductsContextValues>(() => ({
        state: state,
        changeData: (data) => dispatch({ type: "changeProducts", payload: data })
    }), [state]);

    return <ProductsContext value={api}>{children}</ProductsContext>;

}
