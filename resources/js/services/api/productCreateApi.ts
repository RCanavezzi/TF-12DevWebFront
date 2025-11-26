import { ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

export default async function productCreateApi(name: string, price: string) {
    try {
        const { data } = await baseAxios.post<ProductModel>(`api/products`, {
            name: name,
            price: Number(price) ?? 0
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
}
