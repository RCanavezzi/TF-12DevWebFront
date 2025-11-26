import { useState } from "react";
import { ProductCreateFormProps } from "./ProductsCreateForm.types";
import productCreateApi from "@app/js/services/api/productCreateApi";

export default function ProductCreateForm({ onCreate }: ProductCreateFormProps) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const changePriceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value)
    }

    const changeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const onCreateHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = await productCreateApi(name, price);

        if ("error" in data) {
            setErrorMsg(data.error);
            return;
        }

        setName("");
        setPrice("");
        setErrorMsg(null);

        onCreate?.();
    };


    return (
        <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                    <h5 className="card-title mb-3">Cadastrar produto</h5>

                    {errorMsg && (
                        <div className="alert alert-danger py-2">{errorMsg}</div>
                    )}

                    <form onSubmit={onCreateHandler} className="vstack gap-3">
                        <div>
                            <label htmlFor="prodName" className="form-label">Nome</label>
                            <input
                                id="prodName"
                                className="form-control w-100"
                                placeholder="Ex.: Teclado Mecânico"
                                value={name}
                                onChange={changeNameHandler}
                            />
                        </div>

                        <div>
                            <label htmlFor="prodPrice" className="form-label">Preço</label>
                            <div className="input-group">
                                <span className="input-group-text">R$</span>
                                <input
                                    id="prodPrice"
                                    className="form-control"
                                    placeholder="Ex.: 199,90"
                                    value={price}
                                    onChange={changePriceHandler}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-plus me-2" aria-hidden="true"></i>
                            Cadastrar
                        </button>
                    </form>
                </div>
            </div>
        </div>


    );
}
