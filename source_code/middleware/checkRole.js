// middleware/checkRole.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: '❌ المصادقة فشلت! لا يوجد توكن.' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        console.log("✅ التوكن صالح، المستخدم:", decoded);

        // ⛔ منع الكاشير من الوصول لأي صفحة غير صفحة الكاشير
        if (decoded.role === "cashier" && req.path !== "/cashier") {
            return res.status(403).send("❌ غير مصرح لك بالوصول إلى هذه الصفحة.");
        }

        // ⛔ منع المدير من الوصول لصفحة الكاشير
        if (decoded.role === "manager" && req.path === "/cashier") {
            return res.status(403).send("❌ المدير لا يجب أن يدخل على صفحة الكاشير.");
        }

        next();
    } catch (error) {
        console.error("❌ توكن غير صالح:", error);
        res.status(403).json({ error: '❌ المصادقة فشلت! التوكن غير صالح.' });
    }
};
