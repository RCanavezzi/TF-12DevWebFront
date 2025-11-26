import { ListApi, ProductModel } from "@app/js/app.types";

type ChangeProductsAction = {
    type: "changeProducts";
    payload?: ProductsDataValue;
}

type ProductsDataValue = ListApi<ProductModel> | "error";

export type ProductsProviderProps = {
    children: React.ReactNode
}

export type ProductsContextValues = {
    state: ProductsState
    changeData: (data?: ProductsDataValue) => void;
}

export type ProductsState = {
    data?: ProductsDataValue;
}

export type ProductsActions = ChangeProductsAction;