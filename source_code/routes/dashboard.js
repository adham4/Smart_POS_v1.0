const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// ✅ Route لجلب بيانات الـ Dashboard (يعتمد على قاعدة البيانات)
router.get('/dashboard-data', dashboardController.getDashboardData);

// ✅ Route للتحقق من حالة النظام (الإنترنت، قاعدة البيانات، الطابعة الحرارية)
router.get('/system-status', dashboardController.checkSystemStatus);

module.exports = router;