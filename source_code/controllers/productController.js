const { Product } = require('../models'); // ✅ تعديل الاسم إلى Product بدون S

// إنشاء منتج جديد
exports.addProduct = async (req, res) => {
    try {
        const { name, price, category,  } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ error: "⚠️ جميع الحقول مطلوبة." });
        }

        const newProduct = await Product.create({ // ✅ استخدام Product بدلًا من Products
            name,
            price,
            category,
        });

        res.status(201).json({ 
            success: true, 
            message: "✅ تم إنشاء المنتج بنجاح!", 
            product: newProduct 
        });

    } catch (error) {
        console.error("⚠️ خطأ أثناء إنشاء المنتج:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء إضافة المنتج." });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.findAll({
            where: { category }
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'خطأ في جلب المنتجات' });
    }
};

// جلب جميع المنتجات مع التصنيفات المختلفة
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'category', 'sold']
        });
        // تقسيم المنتجات حسب التصنيف لسهولة العرض في صفحة الكاشير
        const categorizedProducts = products.reduce((acc, product) => {
            const category = product.category || 'Others';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});
        res.json(categorizedProducts);
    } catch (error) {
        console.error("⚠️ خطأ أثناء جلب المنتجات:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحميل المنتجات." });
    }
};

// جلب منتج معين عبر الـ ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { // ✅ استخدام Product بدلًا من Products
            attributes: ['id', 'name', 'price', 'category', 'sold']
        });

        if (!product) {
            return res.status(404).json({ error: "⚠️ المنتج غير موجود." });
        }

        res.json(product);
    } catch (error) {
        console.error("⚠️ خطأ أثناء جلب المنتج:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحميل المنتج." });
    }
};

// تحديث منتج معين
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const product = await Product.findByPk(req.params.id); // ✅ استخدام Product بدلًا من Products

        if (!product) {
            return res.status(404).json({ error: "⚠️ المنتج غير موجود." });
        }

        if (!name || !price || !category) {
            return res.status(400).json({ error: "⚠️ جميع الحقول مطلوبة." });
        }

        await product.update({
            name,
            price,
            category,
        });

        res.json({ 
            success: true, 
            message: "✅ تم تحديث المنتج بنجاح!", 
            product 
        });

    } catch (error) {
        console.error("⚠️ خطأ أثناء تحديث المنتج:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء تحديث المنتج." });
    }
};

// حذف منتج معين
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id); // ✅ استخدام Product بدلًا من Products
        if (!product) {
            return res.status(404).json({ error: "⚠️ المنتج غير موجود." });
        }

        await product.destroy();
        res.json({ success: true, message: "✅ تم حذف المنتج بنجاح!" });

    } catch (error) {
        console.error("⚠️ خطأ أثناء حذف المنتج:", error);
        res.status(500).json({ error: "⚠️ حدث خطأ أثناء حذف المنتج." });
    }
};

