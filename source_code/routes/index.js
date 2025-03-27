// routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const productRoutes = require("./Products");
const saleRoutes = require("./sales");
const userRoutes = require("./users");
const pageRoutes = require("./pages");
const paymentRoutes = require("./payments");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware"); // ✅ استيراد صحيح

// حماية جميع الصفحات بالـ Middleware
router.use("/auth", authRoutes);
router.use("/products", authMiddleware(["manager"]), productRoutes);
router.use("/sales", authMiddleware(["manager"]), saleRoutes);
router.use("/users", authMiddleware(["manager"]), userRoutes);
router.use("/pages", authMiddleware(["manager", "cashier"]), pageRoutes);
router.use("/payments", authMiddleware(["manager", "cashier"]), paymentRoutes);

// مثال على صفحة محمية
router.get(
  "/protected-route",
  authMiddleware(["manager", "cashier"]),
  (req, res) => {
    res.json({ message: "🟢 دخول ناجح للصفحة المحمية!" });
  }
);

module.exports = router;
