module.exports = (sequelize, DataTypes) => {
    const DailyClosing = sequelize.define("DailyClosing", {
        closingDate: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true // ✅ يمنع تكرار نفس التاريخ في الجدول
        },
        totalOrders: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        totalSandwiches: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        totalRevenue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        totalEarnings: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        totalDiscount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        onlinePaymentsTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        }
    }, {
        tableName: "daily_closing",  // تأكد أن الاسم هنا مطابق لاسم الجدول في قاعدة البيانات
        timestamps: false
    });

    return DailyClosing;
};