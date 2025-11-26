import ProductModel from "../../../../Models/ProductModel.js";


export default async function CreateProductController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const requestBody = request.body;

    const name = requestBody.name || null;
    const price = requestBody.price || null;

    const nullFields = [];

    if (name === null) {
        nullFields.push("name");
    }

    if (price === null) {
        nullFields.push("price");
    }

    if (nullFields.length > 0) {
        const fields = nullFields.join(",");
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Campo(s) ${fields} não preenchido.` });
    }


    try {

        const row = await ProductModel.create({
            name: name,
            price_times_thousand: Number(price) * 1E3
        });

        return response.status(HTTP_STATUS.SUCCESS_CREATED).json(row);

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError" || error.code === "23505") {
            return response
                .status(HTTP_STATUS.BAD_REQUEST)
                .json({ error: "E-mail já está cadastrado." });
        }
        console.log(error);
        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' });

    }

};
