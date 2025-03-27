const { Inventory } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

// ✅ جلب جميع عناصر المخزون
const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll();
        res.json(inventory);
    } catch (error) {
        console.error("❌ خطأ أثناء جلب المخزون:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحميل المخزون." });
    }
};

// ✅ إضافة عنصر جديد إلى المخزون
const addInventoryItem = async (req, res) => {
    try {
        const { name, quantity, cost, expiryDate } = req.body;

        if (!name || isNaN(quantity) || isNaN(cost)) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        const total = quantity * cost; // حساب الإجمالي تلقائيًا

        const newItem = await Inventory.create({
            name,
            quantity,
            cost,
            total,
            expiryDate: expiryDate || null,
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("❌ خطأ في إضافة المنتج:", error);
        res.status(500).json({ error: "فشل في إضافة المنتج" });
    }
};

// ✅ تعديل عنصر في المخزون
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, cost, expiryDate } = req.body;

        const item = await Inventory.findByPk(id);
        if (!item) return res.status(404).json({ error: "العنصر غير موجود" });

        const total = quantity * cost; // تحديث الإجمالي أيضًا

        await item.update({
            name,
            quantity,
            cost,
            total,
            expiryDate: expiryDate || null,
        });

        res.json({ message: "✅ تم تحديث المنتج بنجاح" });
    } catch (error) {
        console.error("❌ خطأ في تعديل المنتج:", error);
        res.status(500).json({ error: "فشل في تعديل المنتج" });
    }
};

// ✅ حذف عنصر من المخزون
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Inventory.findByPk(id);
        if (!item) return res.status(404).json({ error: "العنصر غير موجود" });

        await item.destroy();
        res.json({ message: "✅ تم حذف المنتج بنجاح" });
    } catch (error) {
        console.error("❌ خطأ في حذف المنتج:", error);
        res.status(500).json({ error: "فشل في حذف المنتج" });
    }
};

// ✅ تنبيه عند المخزون المنخفض
const getLowStockAlerts = async (req, res) => {
    try {
        const minStockThreshold = 10; // الحد الأدنى الافتراضي
        const lowStockItems = await Inventory.findAll({
            where: {
                quantity: { [Op.lt]: minStockThreshold }
            }
        });
        res.json(lowStockItems);
    } catch (error) {
        console.error("❌ خطأ في جلب التنبيهات:", error);
        res.status(500).json({ error: "فشل في جلب تنبيهات المخزون المنخفض" });
    }
};

// ✅ تنبيه عند اقتراب تاريخ الصلاحية
const getExpiryAlerts = async (req, res) => {
    try {
        const expiryThreshold = moment().add(7, 'days').toDate(); // أسبوع قبل انتهاء الصلاحية
        const expiringItems = await Inventory.findAll({
            where: {
                expiryDate: { [Op.lte]: expiryThreshold }
            }
        });
        res.json(expiringItems);
    } catch (error) {
        console.error("❌ خطأ في جلب التنبيهات:", error);
        res.status(500).json({ error: "فشل في جلب تنبيهات تاريخ الصلاحية" });
    }
};

// ✅ التصدير الصحيح للدوال
module.exports = {
    getAllInventory,
    addInventory: addInventoryItem,
    updateInventory: updateInventoryItem,
    deleteInventory: deleteInventoryItem,
    getLowStockAlerts,
    getExpiryAlerts,
};