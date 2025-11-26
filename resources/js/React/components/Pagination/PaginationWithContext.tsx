import { forwardRef, useMemo } from "react";
import { PaginationRef, PaginationWithContextProps } from "./Pagination.types";
import { useProductsContext } from "../../providers/ProductProvider/productsHooks";


export default forwardRef<PaginationRef, PaginationWithContextProps>(function PaginationWithContext({ onChange }, ref) {

    const { state } = useProductsContext();

    const page = (typeof state.data === "object") ? state.data.page : 1;

    const countPages = (typeof state.data === "object") ? state.data.totalPages : 0;

    const pages = useMemo(() => {
        const out: number[] = [];
        for (let i = 1; i <= countPages; i++) out.push(i);
        return out;
    }, [countPages]);

    const clickHandler = (page: number) => {
        return () => {
            onChange?.(page);
        }
    }

    return (
        <div className="pagination">
            <ul className="pagination justify-content-center">
                {pages.map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                        <button
                            className="page-link"
                            aria-current={p === page ? "page" : undefined}
                            onClick={clickHandler(p)}
                        >
                            {p}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
});
