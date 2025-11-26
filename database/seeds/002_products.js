import ProductModel from "../../app/Models/ProductModel.js";

const buildProducts = () =>
    Array.from({ length: 50 }, (_, i) => {
        const n = i + 1;
        const price_times_thousand = 10000 + n * 245;
        return {
            name: `Mock Product ${n}`,
            price_times_thousand,
        };
    });

export default {
    up: async () => {
        const products = buildProducts();
        await ProductModel.bulkCreate(products);
    },

    down: async () => {
        const products = buildProducts();
        await ProductModel.destroy({
            where: {
                name: products.map((p) => p.name),
            },
        });
    },
};
