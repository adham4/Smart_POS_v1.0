const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // ✅ تأكد أن هذا المسار صحيح

router.get("/getUserRole", userController.getUserRole); // ✅ تأكد أن `getUserRole` ليست undefined
router.get("/", userController.getAllUsers);    // ✅ عرض جميع المستخدمين
router.post("/", userController.createUser);    // ✅ إنشاء مستخدم جديد
router.put("/:id", userController.updateUser);  // ✅ تعديل مستخدم
router.delete("/:id", userController.deleteUser); // ✅ حذف مستخدم

module.exports = router;
