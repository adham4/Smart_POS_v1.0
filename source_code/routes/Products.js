const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ تأكد من استخدام الدوال بالشكل الصحيح
router.get('/:category', authMiddleware(['manager', 'cashier']), productController.getProductsByCategory);

router.post('/add', authMiddleware(['manager']), productController.addProduct);

router.get("/", authMiddleware(['manager', 'cashier']), productController.getAllProducts);

router.get("/:id", authMiddleware(['manager', 'cashier']), productController.getProductById);

router.put("/:id", authMiddleware(['manager']), productController.updateProduct);

router.delete("/:id", authMiddleware(['manager']), productController.deleteProduct);

module.exports = router;