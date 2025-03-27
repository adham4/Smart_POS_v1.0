const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

router.post("/check", discountController.checkBestDiscount);

router.get("/apply/:discountCode", discountController.applyDiscount);

// عرض جميع الأكواد
router.get('/', discountController.getAllDiscounts);

// إضافة كود خصم جديد
router.post('/', discountController.addDiscount);

// تحديث كود خصم
router.put('/:id', discountController.updateDiscount);

// حذف كود خصم
router.delete('/:id', discountController.deleteDiscount);

module.exports = router;