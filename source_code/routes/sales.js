const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, salesController.getAllSales);
router.get("/:id", authMiddleware, salesController.getSaleById);
router.post("/add", authMiddleware, authorizeRoles("manager"), salesController.addSale);
router.put("/:id", authMiddleware, authorizeRoles("manager"), salesController.updateSale);
router.delete("/:id", authMiddleware, authorizeRoles("manager"), salesController.deleteSale);

module.exports = router;
