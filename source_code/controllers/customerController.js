const { Customer } = require('../models/index');
const { Op } = require('sequelize');

exports.getCustomerHistory = async (req, res) => {
    try {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ message: "❌ رقم الهاتف مطلوب." });
        }

        // ✅ البحث عن العميل
        const customer = await Customer.findOne({ where: { phone } });
        if (!customer) {
            return res.status(404).json({ message: "❌ العميل غير موجود." });
        }

        // ✅ جلب سجل الطلبات الخاصة بالعميل
        const orders = await Order.findAll({
            where: { customerId: customer.id },
            include: [{ model: Payment, attributes: ['payment_method', 'payment_amount', 'payment_date'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ customer, orders });
    } catch (error) {
        console.error("❌ خطأ أثناء جلب سجل العميل:", error);
        res.status(500).json({ message: "❌ فشل في جلب البيانات", error });
    }
};

exports.getCustomerByPhone = async (req, res) => {
    try {
        let { phone } = req.params;
        phone = phone.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)); // تحويل الأرقام العربية

        console.log(`🔍 البحث عن عميل برقم الهاتف: ${phone}`); // راقب في الكونسول

        const customers = await Customer.findAll({
            where: {
                phone: { [Op.like]: `${phone}%` }
            }
        });

        if (customers.length === 0) {
            return res.status(404).json({ message: "🚫 العميل غير موجود" });
        }

        res.json(customers);
    } catch (error) {
        console.error("❌ خطأ أثناء البحث عن العميل:", error);
        res.status(500).json({ message: "⚠️ خطأ في السيرفر", error });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['id', 'name', 'phone', 'address', 'totalOrders', 'totalSpent'],
            order: [['name', 'ASC']]
        });

        res.json(customers);
    } catch (error) {
        console.error('❌ خطأ أثناء جلب العملاء:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};

exports.searchCustomerPhones = async (req, res) => {
    try {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ message: "⚠️ يجب إدخال رقم الهاتف للبحث" });
        }

        const customers = await Customer.findAll({
            where: {
                phone: {
                    [Op.like]: `${phone}%` // البحث عن أرقام تبدأ بنفس المدخل
                }
            },
            attributes: ['phone'],
            limit: 5 // جلب 5 نتائج فقط لتجنب التحميل الزائد
        });

        res.json(customers);
    } catch (error) {
        console.error('❌ خطأ أثناء البحث عن الأرقام:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "⚠️ الاسم ورقم الهاتف مطلوبان." });
        }

        // ✅ التأكد من عدم وجود عميل بنفس رقم الهاتف
        const existingCustomer = await Customer.findOne({ where: { phone } });
        if (existingCustomer) {
            return res.status(400).json({ message: "🚫 رقم الهاتف مسجل بالفعل." });
        }

        // ✅ إنشاء العميل
        const customer = await Customer.create({
            name,
            phone,
            address,
            totalOrders: 0,
            totalSpent: 0
        });

        res.status(201).json({ message: "✅ تم إضافة العميل بنجاح", customer });
    } catch (error) {
        console.error('❌ خطأ أثناء إضافة العميل:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};

// 🔥 تعديل بيانات العميل
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address } = req.body;

        // ✅ البحث عن العميل
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "🚫 العميل غير موجود" });
        }

        // ✅ التأكد من عدم تكرار رقم الهاتف مع عميل آخر
        if (phone) {
            const existingCustomer = await Customer.findOne({ where: { phone, id: { [Op.ne]: id } } });
            if (existingCustomer) {
                return res.status(400).json({ message: "🚫 رقم الهاتف مسجل بالفعل." });
            }
        }

        // ✅ تحديث البيانات
        await customer.update({ name, phone, address });

        res.json({ message: "✅ تم تحديث بيانات العميل بنجاح", customer });
    } catch (error) {
        console.error('❌ خطأ أثناء تحديث بيانات العميل:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};

// 🔥 حذف العميل
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ البحث عن العميل
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "🚫 العميل غير موجود" });
        }

        // ✅ حذف العميل
        await customer.destroy();

        res.json({ message: "🗑️ تم حذف العميل بنجاح" });
    } catch (error) {
        console.error('❌ خطأ أثناء حذف العميل:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};

// ✅ جلب جميع أرقام العملاء فقط للـ Dropdown
exports.getCustomerPhones = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['id', 'phone'], // جلب الـ ID ورقم الهاتف فقط
            order: [['phone', 'ASC']] // ترتيب الأرقام تصاعديًا
        });

        res.json(customers);
    } catch (error) {
        console.error('❌ خطأ أثناء جلب أرقام العملاء:', error);
        res.status(500).json({ message: '⚠️ خطأ في السيرفر', error });
    }
};