import { ListApi } from "@app/js/app.types";

export type PaginationProps = {
    data: ListApi<unknown> | "error" | undefined;
    onChange?: (page: number) => void;
}

export type PaginationWithContextProps = {
    onChange?: (page: number) => void;
}

export type PaginationRef = {
}