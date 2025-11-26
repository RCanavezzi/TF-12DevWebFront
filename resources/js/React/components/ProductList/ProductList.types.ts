import { ListApi, ProductModel } from "@app/js/app.types";

export type ProductListProps = {
    products: ListApi<ProductModel> | "error" | undefined;
    onDelete?: () => void;
}

export type ProductListWithContextProps = {
    onDelete?: () => void;
}