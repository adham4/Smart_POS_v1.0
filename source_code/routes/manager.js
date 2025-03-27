const express = require("express");
const router = express.Router();
const checkRole = require("../middleware/checkRole");

// حماية الصفحات باستخدام Middleware
router.get("/cashier", checkRole, (req, res) => {
    res.sendFile("/path/to/cashier.html");
});

router.get("/dashboard", checkRole, (req, res) => {
    res.sendFile("/path/to/dashboard.html");
});

module.exports = router;
