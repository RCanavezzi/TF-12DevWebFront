import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";



export default async function productListApi(limit = 15, orderBy = "id,desc") {

    const query = new URLSearchParams({
        "orderBy": orderBy,
        "limit": limit.toString()
    })

    try {
        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);

        return data;
    } catch (error) {
        return catchError(error);
    }
}
