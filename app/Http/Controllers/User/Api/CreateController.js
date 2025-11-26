import UserModel from "../../../../Models/UserModel.js";


export default async function CreateController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const requestBody = request.body;

    const name = requestBody.name || null;
    const email = requestBody.email || null;

    const nullFields = [];

    if (name === null) {
        nullFields.push("name");
    }

    if (email === null) {
        nullFields.push("email");
    }

    if (nullFields.length > 0) {
        const fields = nullFields.join(",");
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Campo(s) ${fields} não preenchido.` });
    }


    try {

        const row = await UserModel.create({
            name: name,
            email: email
        });

        return response.status(HTTP_STATUS.SUCCESS_CREATED).json(row);

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError" || error.code === "23505") {
            return response
                .status(HTTP_STATUS.BAD_REQUEST)
                .json({ error: "E-mail já está cadastrado." });
        }

        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' });

    }

};
