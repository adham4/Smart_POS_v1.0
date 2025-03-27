const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route لإنشاء الدفع
router.post("/", paymentController.createPayment);

// Route لتحديث حالة الدفع
router.post("/update-payment-status", paymentController.updatePaymentStatus);

module.exports = router;