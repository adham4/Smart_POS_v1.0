const express = require("express");
const router = express.Router();
const { Users } = require("../models"); // تأكد أن اسم الموديل صحيح
const verifyToken = require("../middleware/authMiddleware"); // لو عندك توكن تحقق

router.get("/getUserRole", verifyToken, async (req, res) => {
    try {
        const user = await Users.findOne({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.json({ role: user.role }); // تأكد أن لديك حقل "role" في الجدول
    } catch (error) {
        console.error("❌ خطأ أثناء جلب بيانات المستخدم:", error);
        res.status(500).json({ message: "خطأ في السيرفر الداخلي" });
    }
});

module.exports = router;
