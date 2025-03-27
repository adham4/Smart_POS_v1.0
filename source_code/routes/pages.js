// routes/pages.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware'); // ✅ استيراد صحيح

// صفحة تسجيل الدخول متاحة للجميع
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

// صفحة الكاشير متاحة للكاشير والمدير
router.get('/cashier', authMiddleware(['cashier', 'manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cashier.html'));
});

// صفحات المدير فقط
router.get('/dashboard', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

router.get('/inventory', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/inventory.html'));
});

router.get('/products', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/products.html'));
});

router.get('/sales', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/sales.html'));
});

router.get('/users', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/users.html'));
});

// الصفحة الرئيسية (لوحة التحكم) متاحة للمدير فقط
router.get('/', authMiddleware(['manager']), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

module.exports = router;
