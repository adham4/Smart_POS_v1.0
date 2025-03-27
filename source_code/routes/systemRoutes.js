const express = require('express');
const router = express.Router();
const { restartServer } = require('../controllers/systemController');

// ✅ Route لإعادة تشغيل السيرفر
router.post('/restart-server', restartServer);

module.exports = router;