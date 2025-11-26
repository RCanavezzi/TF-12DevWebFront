import { useEffect } from "react";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import useListProductsApi from "../../hooks/useListProductsApi";
import ProductsProvider from "../../providers/ProductProvider/ProductsProvider";
import PaginationWithContext from "../../components/Pagination/PaginationWithContext";
import ProductListWithContext from "../../components/ProductList/ProductListWithContext";
import { useProductsContext } from "../../providers/ProductProvider/productsHooks";


const ExampleGlobal = function () {

    const LIMIT = 10;

    const { loading, callProductListApi, productList } = useListProductsApi();

    const { changeData } = useProductsContext();

    useEffect(() => {
        changeData(productList);
    }, [productList]);

    useEffect(() => {
        callProductListApi(0, LIMIT);
    }, []);

    const createProductHandler = () => {
        callProductListApi(0, LIMIT);
    }

    const deleteProductHandler = () => {
        callProductListApi(0, LIMIT);
    }/** */


    const paginateChangeHandler = (page: number) => {
        callProductListApi((page - 1) * LIMIT, LIMIT);
    }

    return (
        <div className="row g-4">
            <ProductCreateForm onCreate={createProductHandler} />
            <div className="col-12 col-lg-8">
                {
                    loading ?
                        <i className="fas fa-spinner fa-spin"></i> :
                        (
                            <div className="d-flex gap-4 flex-column">
                                <ProductListWithContext onDelete={deleteProductHandler} />
                                <PaginationWithContext onChange={paginateChangeHandler} />
                            </div>
                        )

                }
            </div>
        </div>
    );


}

const ExampleGlobalWithProvider = () => (
    <ProductsProvider>
        <ExampleGlobal />
    </ProductsProvider>
);

export default ExampleGlobalWithProvider;
