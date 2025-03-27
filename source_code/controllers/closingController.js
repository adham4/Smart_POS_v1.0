const { Order, Recipe, Inventory, DailyClosing, MonthlyClosing, sequelize, Payment, Product } = require('../models');
const { Op } = require('sequelize');


exports.getDailySummary = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        // 🟢 حساب إجمالي الطلبات
        const totalOrders = await Order.count({
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" }
        });

        const orders = await Order.findAll({
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" },
            attributes: ['orderDetails']
        });

        let totalSandwiches = 0;
        const ingredientMap = {};

        for (const order of orders) {
            const orderDetails = JSON.parse(order.orderDetails);

            for (const item of orderDetails) {
                if (!item.quantity || isNaN(item.quantity)) continue;

                totalSandwiches += item.quantity;

                const recipes = await Recipe.findAll({ where: { sandwich: item.name } });

                recipes.forEach(recipe => {
                    const ingredient = recipe.ingredient.trim().toLowerCase();
                    const quantityUsed = recipe.amount * item.quantity;
                    ingredientMap[ingredient] = (ingredientMap[ingredient] || 0) + quantityUsed;
                });
            }
        }

        // 🟢 حساب التكاليف
        const inventoryData = await Inventory.findAll({
            where: { name: { [Op.in]: Object.keys(ingredientMap) } },
            attributes: ['name', 'cost']
        });

        let totalCost = 0;
        inventoryData.forEach(item => {
            const ingredient = item.name.trim().toLowerCase();
            if (ingredientMap[ingredient]) {
                const ingredientCost = ingredientMap[ingredient] * item.cost;
                totalCost += ingredientCost;
            }
        });

        totalCost = parseFloat(totalCost.toFixed(2));

        // ✅ حساب إجمالي الإيرادات بعد الخصم
        const totalRevenue = await Order.sum('orderTotal', {
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" }
        }) || 0;

        // ✅ إجمالي الأرباح
        const totalEarnings = parseFloat((totalRevenue - totalCost).toFixed(2));

        // ✅ حساب إجمالي الخصومات
        const discount = await Order.sum('discountAmount') || 0;

        // ✅ حساب إجمالي المدفوعات الإلكترونية
        const onlinePaymentsTotal = await Payment.sum('payment_amount', {
            where: {
                payment_method: { [Op.in]: ["electronic", "Paymob", "InstaPay", "Visa", "MasterCard"] },
                payment_date: { [Op.startsWith]: today }
            }
        }) || 0;

        // ✅ طباعة القيم للتحقق
        console.log({
            totalOrders,
            totalSandwiches,
            totalRevenue,
            totalCost,
            totalEarnings,
            discount,
            onlinePaymentsTotal
        });

        res.json({ 
            totalOrders, 
            totalSandwiches, 
            totalRevenue, 
            totalCost, 
            totalEarnings, 
            discount: discount.toFixed(2), 
            onlinePaymentsTotal: onlinePaymentsTotal.toFixed(2) 
        });

    } catch (error) {
        console.error('⚠️ خطأ أثناء جلب ملخص اليوم:', error);
        res.status(500).json({ error: '⚠️ خطأ في تحميل البيانات!' });
    }
};

exports.closeDay = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        // 🔍 التحقق من إغلاق اليوم مسبقًا
        const existingClosing = await DailyClosing.findOne({ where: { closingDate: today } });
        if (existingClosing) {
            return res.status(400).json({ error: '⚠️ اليوم قد تم إغلاقه بالفعل!' });
        }

        // 🟢 حساب إجمالي الطلبات
        const totalOrders = await Order.count({
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" }
        });

        // 🟢 حساب إجمالي الإيرادات
        const totalRevenue = await Order.sum("orderTotal", {
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" }
        }) || 0;

        // 🟢 حساب التكلفة الإجمالية للمواد الخام
        const totalCost = await calculateTotalCost(today);

        // 🏷️ حساب إجمالي الخصومات
        const totalDiscount = await Order.sum("discountAmount", {
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" }
        }) || 0;

        // 🥪 حساب إجمالي السندويشات المباعة
        const orders = await Order.findAll({
            where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" },
            attributes: ['orderDetails']
        });

        let totalSandwiches = 0;
        for (const order of orders) {
            const orderDetails = JSON.parse(order.orderDetails);
            for (const item of orderDetails) {
                totalSandwiches += item.quantity;
            }
        }

        // 💳 حساب إجمالي المدفوعات الإلكترونية
        const onlinePaymentsTotal = await Payment.sum('payment_amount', {
            where: {
                payment_method: { 
                    [Op.in]: ["electronic", "Paymob", "InstaPay", "Visa", "MasterCard"] 
                },
                payment_date: { [Op.startsWith]: today }
            }
        }) || 0;

        // 💰 حساب الأرباح الإجمالية
        const totalEarnings = parseFloat((totalRevenue - totalCost - totalDiscount).toFixed(2));

        // 📝 تخزين البيانات في جدول التقفيل اليومي
        await DailyClosing.create({
            closingDate: today,
            totalOrders,
            totalSandwiches,
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            totalEarnings,
            totalDiscount: parseFloat(totalDiscount.toFixed(2)),
            onlinePaymentsTotal: parseFloat(onlinePaymentsTotal.toFixed(2))
        });

        // 🚮 حذف الطلبات والمدفوعات اليومية بعد التقفيل
        await Order.destroy({ where: {} });
        await sequelize.query("ALTER TABLE orders AUTO_INCREMENT = 1;");

        await Payment.destroy({ where: {} });
        await sequelize.query("ALTER TABLE payments AUTO_INCREMENT = 1;"); // ✅ إعادة تعيين عدّاد `payments`

        res.json({ success: true, message: '✅ تم إغلاق اليوم بنجاح!' });

    } catch (error) {
        console.error('❌ خطأ أثناء إغلاق اليوم:', error);
        res.status(500).json({ error: '⚠️ خطأ أثناء إغلاق اليوم' });
    }
};

async function calculateTotalCost(today) {
    let totalCost = 0;
    const ingredientMap = {};

    const orders = await Order.findAll({
        where: { createdAt: { [Op.startsWith]: today }, isCancelled: "No" },
        attributes: ['orderDetails']
    });

    for (const order of orders) {
        const orderDetails = JSON.parse(order.orderDetails);
        for (const item of orderDetails) {
            const recipes = await Recipe.findAll({ where: { sandwich: item.name } });
            recipes.forEach(recipe => {
                const ingredient = recipe.ingredient.trim().toLowerCase();
                const quantityUsed = recipe.amount * item.quantity;
                ingredientMap[ingredient] = (ingredientMap[ingredient] || 0) + quantityUsed;
            });
        }
    }

    const inventoryData = await Inventory.findAll({
        where: { name: { [Op.in]: Object.keys(ingredientMap) } },
        attributes: ['name', 'cost']
    });

    inventoryData.forEach(item => {
        const ingredient = item.name.trim().toLowerCase();
        if (ingredientMap[ingredient]) {
            const ingredientCost = parseFloat((ingredientMap[ingredient] * item.cost).toFixed(2));
            totalCost += ingredientCost;
        }
    });

    return parseFloat(totalCost.toFixed(2));
}

// 🔹 جلب ملخص الشهر الحالي
exports.getMonthlySummary = async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // "yyyy-MM"

        const total_orders = await DailyClosing.sum("totalOrders", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0;

        const total_sandwiches = await DailyClosing.sum("totalSandwiches", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0;

        const total_revenue = await DailyClosing.sum("totalRevenue", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        const total_cost = await DailyClosing.sum("totalCost", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        const totalDiscount = await DailyClosing.sum("totalDiscount", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        const total_earnings = parseFloat((total_revenue - total_cost).toFixed(2));

        // ✅ التأكد من الاسم الصحيح للمدفوعات الأونلاين
        const onlinePaymentsTotal = await DailyClosing.sum("onlinePaymentsTotal", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        res.json({ 
            total_orders, 
            total_sandwiches, 
            total_revenue, 
            total_cost, 
            total_earnings, 
            totalDiscount,
            onlinePaymentsTotal
        });

    } catch (error) {
        console.error("❌ خطأ أثناء جلب ملخص الشهر:", error);
        res.status(500).json({ error: "⚠️ خطأ في تحميل البيانات!" });
    }
};

exports.closeMonth = async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // "yyyy-MM"

        // ✅ تحقق مما إذا كان الشهر قد تم إغلاقه بالفعل
        const existingClosing = await MonthlyClosing.findOne({
            where: { month_year: currentMonth }
        });

        if (existingClosing) {
            return res.status(400).json({ error: "⚠️ الشهر قد تم إغلاقه بالفعل!" });
        }

        // ✅ حساب إجمالي الطلبات، السندويشات، الإيرادات، التكاليف، والمدفوعات الأونلاين
        const total_orders = await DailyClosing.sum("totalOrders", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0;

        const total_sandwiches = await DailyClosing.sum("totalSandwiches", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0;

        const total_revenue = await DailyClosing.sum("totalRevenue", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        const total_cost = await DailyClosing.sum("totalCost", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        // 🏷️ حساب إجمالي الخصومات من DailyClosing
        const totalDiscount = await DailyClosing.sum("totalDiscount", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        const total_earnings = parseFloat((total_revenue - total_cost - totalDiscount).toFixed(2));

        // ✅ حساب المدفوعات الأونلاين
        const onlinePaymentsTotal = await DailyClosing.sum("onlinePaymentsTotal", {
            where: { closingDate: { [Op.startsWith]: currentMonth } }
        }) || 0.0;

        // ✅ تخزين البيانات في جدول MonthlyClosing
        await MonthlyClosing.create({
            month_year: currentMonth,
            total_orders,
            total_sandwiches,
            total_revenue,
            total_cost,
            total_earnings,
            totalDiscount, // ✅ الآن يتم تخزين الخصم الصحيح
            onlinePaymentsTotal
        });

        // ✅ مسح جميع السجلات من جدول DailyClosing بعد الحفظ الشهري
        await DailyClosing.destroy({ where: {} });

        // ✅ إعادة تعيين AUTO_INCREMENT للجدول
        await sequelize.query("ALTER TABLE daily_closing AUTO_INCREMENT = 1;");

        // ✅ تصفير البيانات في جدول المنتجات (صفحة التحليلات)
        await Product.update(
            { sold: 0 },
            { where: {} }
        );

        console.log("✅ تم تصفير البيانات في جدول المنتجات بعد التقفيل الشهري.");

        // ✅ تصفير بيانات صفحة التحليلات (ممكن تضيف أي كود إضافي هنا لو التحليلات مخزنة في جدول منفصل)
        await sequelize.query("UPDATE products SET sold = 0;");
        console.log("✅ تم تصفير صفحة التحليلات بعد التقفيل الشهري.");

        res.json({ success: true, message: "✅ تم إغلاق الشهر بنجاح!" });

    } catch (error) {
        console.error("❌ خطأ أثناء إغلاق الشهر:", error);
        res.status(500).json({ error: "⚠️ خطأ أثناء إغلاق الشهر" });
    }
};