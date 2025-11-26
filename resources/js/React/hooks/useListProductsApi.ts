import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "@app/js/services/axiosApi";
import { useState } from "react";

export default function useListProductsApi() {

    const [loading, setLoading] = useState<boolean>(false);

    const [dataList, setDataList] = useState<ListApi<ProductModel> | "error">();

    const [total, setTotal] = useState<number>();

    const a = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("");
            }, 200);
        });
    }

    const call = async (offset = 0, limit = 15, orderBy = "id,desc") => {

        setLoading(true);

        const query = new URLSearchParams({
            "orderBy": orderBy,
            "limit": limit.toString(),
            "offset": offset.toString()
        });

        await a();

        try {
            const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);

            setDataList(data);
            setTotal(data.count);
        } catch (error) {
            setDataList("error");
        } finally {
            setLoading(false);
        }

    }

    return {
        callProductListApi: call,
        loading: loading,
        productList: dataList,
        total: total
    }
}
