import { LoginApi } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";



export default async function loginApi(email: string, password: string) {
    try {
        const body = new URLSearchParams({
            email: email,
            password: password
        });

        const { data } = await baseAxios.post<LoginApi>(`login`, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        return data;

    } catch (error) {
        return catchError(error);
    }
}
