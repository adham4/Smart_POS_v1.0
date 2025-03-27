const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        },
        password: {
        type: DataTypes.STRING,
        allowNull: false
        },
        role: {
        type: DataTypes.ENUM("manager", "cashier"),
        allowNull: false
        }
    }, {
        timestamps: false  // ⬅️ هذا يمنع Sequelize من البحث عن `createdAt` و `updatedAt`
    });
    
    module.exports = User;

