const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.get("/", ordersController.fetchOrders); // ✅ جلب الطلبات
router.post("/count-sandwiches", ordersController.countSandwiches); // ✅ حساب السندوتشات
router.post("/format-details", ordersController.formatOrderDetails); // ✅ تنسيق تفاصيل الطلب
router.put("/:orderId/cancel", ordersController.cancelOrder); // ✅ إلغاء الطلب

module.exports = router;
