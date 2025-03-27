const { Order, Payment } = require('../models');
const { printReceipt } = require('./receiptPrinter');

// إنشاء سجل الدفع للطلبات الإلكترونية
exports.createPayment = async (req, res) => {
    try {
        const { orderId, payment_method, payment_amount, status } = req.body;

        const payment = await Payment.create({
            order_id: orderId,
            payment_amount,
            payment_method
        });

        await Order.update(
            { payment_status: status },
            { where: { id: orderId } }
        );

        // جلب بيانات الطلب للطباعة
        const order = await Order.findByPk(orderId);
        if (order) {
            const orderData = {
                id: order.id,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                customerAddress: order.customerAddress,
                deliveryPrice: order.deliveryPrice,
                orderTotal: order.orderTotal,
                orderDetails: JSON.parse(order.orderDetails),
                discount: order.discount,
                orderDate: new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
            };

            // طباعة الإيصال عند الدفع الإلكتروني
            printReceipt(orderData);
        }

        res.status(200).json({ message: '✅ تم تسجيل الدفع بنجاح', payment });

    } catch (error) {
        console.error('❌ خطأ أثناء تسجيل الدفع:', error.message);
        res.status(500).json({ message: '❌ حدث خطأ أثناء تسجيل الدفع', error: error.message });
    }
};

// تحديث حالة الدفع
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;

        if (!orderId || !paymentStatus) {
            return res.status(400).json({ message: "❌ يجب إرسال orderId و paymentStatus" });
        }

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: "❌ الطلب غير موجود" });
        }

        await order.update({ payment_status: paymentStatus });

        res.status(200).json({
            message: "✅ تم تحديث حالة الدفع بنجاح!",
            order: {
                id: order.id,
                paymentStatus: order.payment_status,
            }
        });

    } catch (error) {
        console.error("❌ خطأ أثناء تحديث حالة الدفع:", error);
        res.status(500).json({ message: "❌ فشل تحديث حالة الدفع", error });
    }
};