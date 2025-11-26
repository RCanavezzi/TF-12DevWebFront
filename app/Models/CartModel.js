import sequelize from '../../config/sequelize.js';
import { DataTypes } from 'sequelize';
import "../../bootstrap/app.js";

export default (function () {
    return sequelize.define(
        "CartModel",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('pending', 'closed'),
                allowNull: false,
                defaultValue: 'pending'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "carts",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );
})();
