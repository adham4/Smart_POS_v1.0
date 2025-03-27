module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        commentText: {
            type: DataTypes.STRING, // ✅ تغيير النوع لـ STRING
            allowNull: false
        },
        color: {
            type: DataTypes.STRING, // ✅ إضافة اللون
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), // ✅ إضافة السعر
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'Comments', // ✅ اسم الجدول في قاعدة البيانات
        timestamps: false // ✅ عدم الحاجة لـ updatedAt
    });

    return Comment;
};