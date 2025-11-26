import UserModel from "../../../../Models/UserModel.js";

export default async function UpdateController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const id = request.params.id;

    const requestBody = request.body;
    const name = requestBody.name;
    const email = requestBody.email;

    const data = {};

    if (name !== undefined) {
        data["name"] = name;
    }

    if (email !== undefined) {
        data["email"] = email;
    }

    if (Object.keys(data).length === 0) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({
            error: `Nenhum campo foi inputado.`
        });
    }

    try {

        const [rowsAffected, [row]] = await UserModel.update(
            {
                name: name,
                email: email
            },
            {
                where: {
                    id: id
                },
                returning: true
            }
        );

        if (rowsAffected === 0 || !row) {
            return response.status(HTTP_STATUS.NOT_FOUND).json({
                error: `Nenhum usuário encontrado com ID ${id}`
            });
        }

        return response.status(HTTP_STATUS.SUCCESS).json(row);

    } catch (error) {

        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' });

    }

};
