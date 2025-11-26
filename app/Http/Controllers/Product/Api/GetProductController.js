import ProductModel from "../../../../Models/ProductModel.js";

export default async function GetProductController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const id = request.params.id;

    try {

        const row = await ProductModel.findByPk(id);

        if (row === null) {
            return response.status(HTTP_STATUS.NOT_FOUND).json({ error: `Produto com id ${id} não existe` });
        }

        return response.status(HTTP_STATUS.SUCCESS).json(row);

    } catch (error) {

        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' });

    }

};
