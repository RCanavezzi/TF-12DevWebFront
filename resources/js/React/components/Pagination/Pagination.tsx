import { forwardRef, useEffect, useMemo, useState } from "react";
import { PaginationProps, PaginationRef } from "./Pagination.types";


export default forwardRef<PaginationRef, PaginationProps>(function Pagination({ data, onChange }, ref) {

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [countPages, setCountPages] = useState<number>(0);

    useEffect(() => {

        if (!data || data === "error") {
            return;
        }
        setCurrentPage(data.page);

        setCountPages(data.totalPages);

    }, [data]);

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
                    <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                        <button
                            className="page-link"
                            aria-current={p === currentPage ? "page" : undefined}
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
