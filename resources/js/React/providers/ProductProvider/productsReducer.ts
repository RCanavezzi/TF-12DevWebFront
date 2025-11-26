import { ProductsActions, ProductsState } from "./products.types";


export function productsReducer(
    state: ProductsState,
    action: ProductsActions
): ProductsState {
    if (action.type === "changeProducts") {
        return {
            ...state,
            data: action.payload
        }
    }
    return state;
}
