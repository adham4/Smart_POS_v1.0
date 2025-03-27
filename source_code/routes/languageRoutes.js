const express = require('express');
const router = express.Router();
const { changeLanguage, getCurrentLanguage } = require('../controllers/languageController');

router.get('/change-language/:lng', changeLanguage);
router.get('/current-language', getCurrentLanguage); // ✅ استرجاع اللغة الحالية

module.exports = router;