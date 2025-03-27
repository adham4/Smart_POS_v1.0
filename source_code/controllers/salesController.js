const { Sale } = require('../models');

// جلب جميع المبيعات
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.findAll();
        res.json(sales);
    } catch (error) {
        console.error("⚠️ خطأ أثناء جلب المبيعات:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحميل المبيعات." });
    }
};

// جلب تفاصيل بيع معين
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "⚠️ البيع غير موجود." });
        }
        res.json(sale);
    } catch (error) {
        console.error("⚠️ خطأ أثناء جلب البيع:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحميل البيع." });
    }
};

// إضافة عملية بيع جديدة
exports.addSale = async (req, res) => {
    try {
        const newSale = await Sale.create(req.body);
        res.status(201).json({ success: true, message: "✅ تم إضافة عملية البيع بنجاح!", sale: newSale });
    } catch (error) {
        console.error("⚠️ خطأ أثناء إضافة البيع:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء إضافة البيع." });
    }
};

// تحديث عملية بيع
exports.updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "⚠️ البيع غير موجود." });
        }
        await sale.update(req.body);
        res.json({ success: true, message: "✅ تم تحديث عملية البيع بنجاح!", sale });
    } catch (error) {
        console.error("⚠️ خطأ أثناء تحديث البيع:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحديث البيع." });
    }
};

// حذف عملية بيع
exports.deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "⚠️ البيع غير موجود." });
        }
        await sale.destroy();
        res.json({ success: true, message: "✅ تم حذف عملية البيع بنجاح!" });
    } catch (error) {
        console.error("⚠️ خطأ أثناء حذف البيع:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء حذف البيع." });
    }
};
