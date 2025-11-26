import UserModel from "../../../Models/UserModel.js";

export default async function UserViewController(request, response) {

    const allUsers = await UserModel.findAll({
        attributes: ['id', 'name', 'email', 'photo', 'created_at'],
        order: [['created_at', 'DESC']]
    });

    return response.render("users", {
        user: request.user,
        users: allUsers
    });

};
