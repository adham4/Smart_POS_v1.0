const { Order, Customer, Product, Inventory } = require("../models");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");

// ✅ API: جلب بيانات التحليلات العامة
exports.getAnalytics = async (req, res) => {
    try {
        console.log("📊 بدء تحليل البيانات...");

        // 🔹 إجمالي عدد الطلبات
        const totalOrders = await Order.count();

        // 🔹 إجمالي الإيرادات
        const totalRevenue = (await Order.sum("orderTotal")) || 0;

        // 🔹 جلب الطلبات خلال آخر 7 أيام
        const recentOrders = await Order.findAll({
            attributes: ["orderDetails", "createdAt", "orderTotal"],
            where: {
                createdAt: { [Op.gte]: Sequelize.literal("CURDATE() - INTERVAL 7 DAY") },
            },
        });

        // 🔹 تجهيز بيانات الأيام السبعة الأخيرة
        const last7Days = [];
        const ordersPerDay = {};
        const revenuePerDay = {};

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toISOString().split("T")[0];

            last7Days.push({ date: formattedDate, orders: 0, revenue: 0 });
            ordersPerDay[formattedDate] = 0;
            revenuePerDay[formattedDate] = 0;
        }

        // 🔹 حساب الطلبات والإيرادات لكل يوم
        recentOrders.forEach(order => {
            const date = order.createdAt.toISOString().split("T")[0];
            ordersPerDay[date] = (ordersPerDay[date] || 0) + 1;
            revenuePerDay[date] = (revenuePerDay[date] || 0) + parseFloat(order.orderTotal);
        });

        last7Days.forEach(day => {
            day.orders = ordersPerDay[day.date] || 0;
            day.revenue = revenuePerDay[day.date] || 0;
        });

        // ✅ جلب المنتجات الأكثر والأقل طلبًا من قاعدة البيانات
        const topProducts = await Product.findAll({
            attributes: ['name', 'sold'],
            order: [["sold", "DESC"]],
            limit: 5,
            raw: true
        });

        const leastProducts = await Product.findAll({
            attributes: ['name', 'sold'],
            order: [["sold", "ASC"]],
            limit: 5,
            raw: true
        });

        // 🔹 تحليل العملاء الأكثر طلبًا
        const customerOrders = await Order.findAll({ attributes: ["customerId"] });
        const customerCounts = {};

        customerOrders.forEach(order => {
            if (order.customerId) {
                customerCounts[order.customerId] = (customerCounts[order.customerId] || 0) + 1;
            }
        });

        // ✅ جلب بيانات العملاء الأكثر طلبًا
        const topCustomers = await Customer.findAll({
            where: { id: { [Op.in]: Object.keys(customerCounts).map(id => Number(id)) } },
            attributes: ["id", "name"],
            raw: true
        });

        // ✅ إضافة عدد الطلبات لكل عميل وترتيبهم
        topCustomers.forEach(customer => {
            customer.ordersCount = customerCounts[customer.id] || 0;
        });

        topCustomers.sort((a, b) => b.ordersCount - a.ordersCount);

        res.json({
            totalOrders,
            totalRevenue,
            last7Days,
            topProducts,
            leastProducts,
            topCustomers,
        });

    } catch (error) {
        console.error("❌ خطأ في API التحليلات:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات التحليلات", error: error.message });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const lowStockItems = await Inventory.findAll({
            where: { quantity: { [Op.lte]: Sequelize.col("min") } },
            order: [["quantity", "ASC"]]
        });

        const expiryItems = await Inventory.findAll({
            where: { expiryDate: { [Op.between]: [moment().toDate(), moment().add(7, "days").toDate()] } },
            order: [["expiryDate", "ASC"]]
        });

        return res.json({
            success: true,
            lowStock: lowStockItems,
            expirySoon: expiryItems
        });
    } catch (error) {
        console.error("❌ خطأ في `getLowStockProducts`:", error);
        return res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء جلب المنتجات القليلة المخزون."
        });
    }
};

// ✅ API: تحليل المخزون حسب الفئات
exports.getStockByCategory = async (req, res) => {
    try {
        console.log("📂 تحليل المخزون حسب الفئات...");
        const stockByCategory = await Product.findAll({
            attributes: ['category', [Sequelize.fn('SUM', Sequelize.col('stock_quantity')), 'total_stock']],
            group: ['category']
        });

        res.json({ success: true, data: stockByCategory });

    } catch (error) {
        console.error("❌ خطأ في `getStockByCategory`:", error);
        res.status(500).json({ success: false, message: 'خطأ في تحليل المخزون حسب الفئات', error: error.message });
    }
};

// ✅ API: توقع كمية المخزون المتبقية
exports.getStockForecast = async (req, res) => {
    try {
        console.log("📊 حساب توقعات المخزون...");
        const products = await Product.findAll({
            attributes: ['id', 'name', 'stock_quantity', 'sold']
        });

        const forecastData = products.map(product => {
            const avgDailySales = product.sold > 0 ? product.sold / 30 : 0;
            const estimatedStockLeft = avgDailySales > 0 ? Math.round(product.stock_quantity / avgDailySales) : 'غير متاح';

            return { ...product.toJSON(), avgDailySales, estimatedStockLeft };
        });

        res.json({ success: true, data: forecastData });

    } catch (error) {
        console.error("❌ خطأ في `getStockForecast`:", error);
        res.status(500).json({ success: false, message: 'خطأ في التوقعات المستقبلية للمخزون', error: error.message });
    }
};