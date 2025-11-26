import { baseAxios } from "../axiosApi";
import catchError from "../catchError";



export default async function productDeleteApi(id: number) {
    try {
        await baseAxios.delete(`api/products/${id}`);
        return null;
    } catch (error) {
        return catchError(error);
    }
}
