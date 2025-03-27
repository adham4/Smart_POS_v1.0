const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * دالة محاكاة طباعة الإيصال بصيغة PDF
 * @param {Object} orderData - بيانات الطلب
 */
function printReceipt(orderData) {
    if (!orderData) {
        console.error("❌ لا توجد بيانات لطباعة الإيصال!");
        return;
    }

    // حساب المجموع الجزئي والإجمالي بشكل صحيح
    const subtotal = orderData.orderDetails?.reduce((acc, item) => {
        return acc + (parseFloat(item.quantity) * parseFloat(item.price));
    }, 0) || 0;

    // تحويل القيم إلى أرقام باستخدام parseFloat
    const deliveryPrice = parseFloat(orderData.deliveryPrice) || 0;
    const discount = parseFloat(orderData.discount) || 0;

    const calculatedTotal = subtotal + deliveryPrice - discount;

    // إنشاء مستند PDF جديد
    try {
        const doc = new PDFDocument({ margin: 20 });
        const receiptPath = path.join(__dirname, 'receipt.pdf');
        const writeStream = fs.createWriteStream(receiptPath);

        doc.pipe(writeStream);

        // عنوان الإيصال
        doc.fontSize(20).text('BAZEZZ', { align: 'center' });
        doc.moveDown();

        // بيانات الطلب
        doc.fontSize(12)
            .text(`Order: ${orderData.id || "N/A"}`)
            .text(`Date: ${orderData.orderDate || "N/A"}`)
            .text(`Name: ${orderData.customerName?.trim() || "N/A"}`)
            .text(`Phone: ${orderData.customerPhone?.trim() || "N/A"}`)
            .text(`Address: ${orderData.customerAddress?.trim() || "N/A"}`)
            .moveDown();

        // رأس الجدول
        doc.text('Name'.padEnd(20, ' ') + 'QTY'.padStart(10, ' ') + 'Price'.padStart(10, ' '));
        doc.text(''.padEnd(40, '-'));

        // تفاصيل الطلب
        orderData.orderDetails?.forEach(item => {
            const name = (item.name || "N/A").padEnd(20, ' ');
            const quantity = String(item.quantity || 0).padStart(10, ' ');
            const price = String(item.price + ' EGP').padStart(10, ' ');
            doc.text(`${name}${quantity}${price}`);
        });

        doc.text(''.padEnd(40, '-'));

        // الحسابات المالية
        doc.text(`Sub-Total: ${subtotal.toFixed(2)} EGP`, { align: 'right' });
        doc.text(`Delivery: ${deliveryPrice.toFixed(2)} EGP`, { align: 'right' });
        doc.text(`Discount: ${discount.toFixed(2)} EGP`, { align: 'right' });
        doc.text(''.padEnd(40, '-'));
        doc.text(`الإجمالي: ${calculatedTotal.toFixed(2)} EGP`, { align: 'right' });

        // معلومات إضافية
        doc.moveDown();
        doc.text('Phone: 01005078132 - 01211228565', { align: 'center' });
        doc.text('complements: 01005078132', { align: 'center' });
        doc.text('شكرًا لتعاملكم معنا!', { align: 'center' });

        // إنهاء وتخزين الملف
        doc.end();

        writeStream.on('finish', () => {
            console.log('✅ تم حفظ الإيصال في receipt.pdf بنجاح!');
        });

        writeStream.on('error', (error) => {
            console.error('❌ خطأ أثناء حفظ الإيصال:', error.message);
        });

    } catch (error) {
        console.error('❌ خطأ أثناء إنشاء مستند PDF:', error.message);
    }
}

module.exports = { printReceipt };