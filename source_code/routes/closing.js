const express = require('express');
const router = express.Router();
const closingController = require('../controllers/closingController');

// 🔹 ملخص اليوم
router.get('/daily-summary', closingController.getDailySummary);

// 🔹 إغلاق اليوم
router.post('/close-day', closingController.closeDay);

// 🔹 ملخص الشهر الحالي
router.get('/monthly-summary', closingController.getMonthlySummary);

// 🔹 إغلاق الشهر
router.post("/close-month", closingController.closeMonth);

module.exports = router;
