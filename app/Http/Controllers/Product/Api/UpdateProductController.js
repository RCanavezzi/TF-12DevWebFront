import ProductModel from "../../../../Models/ProductModel.js";

export default async function UpdateProductController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const id = request.params.id;

    const requestBody = request.body;
    const name = requestBody.name;
    const price = requestBody.price;

    const data = {};

    if (name !== undefined) {
        data["name"] = name;
    }

    if (price !== undefined) {
        data["price_times_thousand"] = Number(price) * 1E3;
    }

    if (Object.keys(data).length === 0) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({
            error: `Nenhum campo foi inputado.`
        });
    }

    try {

        const [rowsAffected, [row]] = await ProductModel.update(
            data,
            {
                where: {
                    id: id
                },
                returning: true
            }
        );

        if (rowsAffected === 0 || !row) {
            return response.status(HTTP_STATUS.NOT_FOUND).json({
                error: `Nenhum produto encontrado com ID ${id}`
            });
        }

        return response.status(HTTP_STATUS.SUCCESS).json(row);

    } catch (error) {

        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' });

    }

};
