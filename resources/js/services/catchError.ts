import axios, { AxiosError } from "axios";

export default (error: unknown) => {
    if (axios.isAxiosError(error)) {
        if ((error as AxiosError).status === 401) {
            return { error: "UNAUTHORIZED" }
        }
        const msg =
            (typeof error.response?.data === 'string' && error.response.data) ||
            error.message;
        return { error: msg };
    }
    return { error: (error as Error)?.message ?? 'Unknown error' };
}