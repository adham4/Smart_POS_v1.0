module.exports = (sequelize, DataTypes) => {
    const MonthlyClosing = sequelize.define("MonthlyClosing", {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        month_year: { 
            type: DataTypes.STRING(7), // لضبط الطول الأقصى إلى 7 (مثال: YYYY-MM)
            allowNull: false, 
            unique: true 
        },
        total_orders: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            defaultValue: 0 
        },
        total_sandwiches: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            defaultValue: 0 
        },
        total_revenue: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false, 
            defaultValue: 0.00 
        },
        total_cost: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false, 
            defaultValue: 0.00 
        },
        total_earnings: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false, 
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
        },
        closing_date: { 
            type: DataTypes.DATE, 
            allowNull: true, 
            defaultValue: DataTypes.NOW // لضبط القيمة الافتراضية إلى الوقت الحالي
        }
    }, {
        tableName: "monthly_closing", // مطابق لاسم الجدول في قاعدة البيانات
        timestamps: false
    });

    return MonthlyClosing;
};