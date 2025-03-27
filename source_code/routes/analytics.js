const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// 🔹 تحديد الروت لجلب التحليلات
router.get("/", analyticsController.getAnalytics);

router.get("/low-stock", analyticsController.getLowStockProducts);
router.get('/stock-by-category', analyticsController.getStockByCategory);
router.get('/stock-forecast', analyticsController.getStockForecast);

module.exports = router;