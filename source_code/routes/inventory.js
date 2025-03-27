const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// ✅ جلب جميع عناصر المخزون
router.get("/", inventoryController.getAllInventory);

// ✅ إضافة عنصر جديد إلى المخزون
router.post("/add", inventoryController.addInventory);

// ✅ تعديل عنصر في المخزون
router.put("/:id", inventoryController.updateInventory);

// ✅ حذف عنصر من المخزون
router.delete("/:id", inventoryController.deleteInventory);

// ✅ تنبيهات المخزون المنخفض وتاريخ الصلاحية
router.get("/alerts/low-stock", inventoryController.getLowStockAlerts);
router.get("/alerts/expiry", inventoryController.getExpiryAlerts);

module.exports = router;