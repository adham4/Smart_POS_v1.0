module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define("Recipe", {
        sandwich: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ingredient: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: "recipes",
        timestamps: false
    });

    return Recipe;
};