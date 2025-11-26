import axios from "axios";

const envBase = (import.meta as any)?.env?.API_DOMAIN;

export const baseAxios = axios.create({
    baseURL: envBase || "http://localhost:8080",
    withCredentials: true,
});
