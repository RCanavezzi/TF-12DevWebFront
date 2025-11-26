import sequelize from '../../config/sequelize.js';
import { DataTypes } from 'sequelize';
import "../../bootstrap/app.js";

export default (function () {
    return sequelize.define(
        "LineItemModel",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            cart_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            unit_price_times_thousand: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
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
            tableName: "line_items",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["cart_id", "product_id"]
                }
            ]
        }
    );
})();
