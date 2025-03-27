module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define("Inventory", {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        quantity: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        total: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dateAdded: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        min: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00
        }
    }, {
        tableName: "inventory",
        timestamps: true
    });

    return Inventory;
};