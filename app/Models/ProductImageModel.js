import sequelize from '../../config/sequelize.js';
import { DataTypes } from 'sequelize';
import "../../bootstrap/app.js";

export default (function () {
    return sequelize.define(
        "ProductImageModel",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            relative_path: {
                type: DataTypes.STRING(155),
                allowNull: true
            },
            display_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
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
            tableName: "product_images",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                { fields: ["product_id"] },
                { fields: ["product_id", "display_order"] }
            ]
        }
    );
})();
