import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, formatPrice } from "@app/js/services/helpers";
import productDeleteApi from "@app/js/services/api/productDeleteApi";
import { ProductListProps, ProductListWithContextProps } from "./ProductList.types";
import Button from "../Button/Button";
import { ButtonRef } from "../Button/Button.types";
import { useProductsContext } from "../../providers/ProductProvider/productsHooks";

export default function ProductListWithContext({ onDelete }: ProductListWithContextProps) {

    const { state } = useProductsContext();

    const data = state.data;

    const deleteButtonsRef = useRef<Map<number, ButtonRef>>(new Map);

    const setButtonRef = useCallback((id: number) => (el: ButtonRef | null) => {
        if (el) {
            deleteButtonsRef.current.set(id, el);
            return;
        }

        deleteButtonsRef.current.delete(id);
    }, []);

    const deleteProductHandler = (id: number) => {

        return async () => {

            deleteButtonsRef.current.get(id)?.disable();
            const data = await productDeleteApi(id);

            if (data !== null) {
                deleteButtonsRef.current.get(id)?.enable();
                return;
            }

            onDelete?.();
        }

    }

    if (!data) {
        return (
            <div className="alert alert-light border d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Carregando produtos...
            </div>
        );
    }

    if (data === "error") {
        return <div className="alert alert-warning">Erro na API.</div>;
    }


    return (
        <div>
            {data.rows.length === 0 ? (
                <div className="alert alert-warning">Nenhum produto encontrado.</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {data.rows.map((product) => {
                        const id = product.id;
                        return (
                            <div key={id} className="col">
                                <div className="card h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title mb-0 fw-semibold">{product.name}</h6>
                                            <span className="badge text-bg-light border">
                                                {formatPrice(product.price_times_thousand)}
                                            </span>
                                        </div>

                                        <p className="card-text text-muted small mt-2 mb-0">
                                            <i className="fa-regular fa-clock me-1" aria-hidden="true"></i>
                                            Cadastrado em {formatDate(product.created_at)}
                                        </p>
                                    </div>

                                    <div className="card-footer bg-white border-0 pt-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="badge rounded-pill text-bg-primary">#{product.id}</span>
                                            <Button
                                                key={id}
                                                ref={setButtonRef(id)}
                                                onClick={deleteProductHandler(id)}
                                                classList="btn-danger"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
