import { createContext } from "react";
import { ProductsContextValues } from "./products.types";

export default createContext<ProductsContextValues | null>(null);