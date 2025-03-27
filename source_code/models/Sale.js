const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("Sale", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity_sold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sale_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
};
