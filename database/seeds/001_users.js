import bcrypt from 'bcrypt';

import UserModel from '../../app/Models/UserModel.js';

export default {

    up: async () => {
        const senha = "123456";

        await UserModel.bulkCreate([
            { name: 'User1', email: 'user1@unifaat.com', password: await bcrypt.hash(senha, 10), role: "ADMIN" },
            { name: 'User2', email: 'user2@unifaat.com', password: await bcrypt.hash(senha, 10) },
            { name: 'User3', email: 'user3@unifaat.com', password: await bcrypt.hash(senha, 10) },
            { name: 'User4', email: 'user4@unifaat.com', password: await bcrypt.hash(senha, 10) },
            { name: 'User5', email: 'user5@unifaat.com', password: await bcrypt.hash(senha, 10) },
            { name: 'User6', email: 'user6@unifaat.com', password: await bcrypt.hash(senha, 10) },
        ])
    },

    down: async () => {
        await UserModel.destroy({
            where: {
                email: [
                    'user1@unifaat.com',
                    'user2@unifaat.com',
                    'user3@unifaat.com',
                    'user4@unifaat.com',
                    'user5@unifaat.com',
                    'user6@unifaat.com'
                ]
            }
        });
    }
};
