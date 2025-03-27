const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Customer = require("./Customer")(sequelize, DataTypes);
const Product = require("./Products"); // ✅ تم التعديل هنا
const Order = require("./Order")(sequelize, DataTypes);
const OrderDetail = require("./OrderDetail")(sequelize, DataTypes);
const Sale = require("./Sale")(sequelize, DataTypes);
const Inventory = require("./Inventory")(sequelize, DataTypes);
const Recipe = require("./Recipe")(sequelize, DataTypes);
const DailyClosing = require('./DailyClosing')(sequelize, DataTypes);
const MonthlyClosing = require('./MonthlyClosing')(sequelize, DataTypes);
const Payment = require('./Payments'); 
const DiscountCode = require("./DiscountCode"); // تأكد أن الاسم متطابق
const Comment = require("./Comment")(sequelize, DataTypes);

// ✅ العلاقات بين الجداول
Product.hasMany(Sale, { foreignKey: "product_id" });
Sale.belongsTo(Product, { foreignKey: "product_id" });

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

// ✅ تصدير الموديلات
module.exports = {
    sequelize,
    User,
    Customer,
    Product,
    Order,
    OrderDetail,
    Sale,
    Inventory,
    Recipe,
    DailyClosing,
    MonthlyClosing,
    Payment,
    DiscountCode,
    Comment,
};