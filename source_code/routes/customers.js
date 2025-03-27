const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");

router.get('/history/:phone', customerController.getCustomerHistory);

router.get("/phones", customerController.getCustomerPhones);

router.get("/:phone", customerController.getCustomerByPhone);

router.get("/", customerController.getAllCustomers);

router.post("/create", customerController.createCustomer);

router.put("/:id", customerController.updateCustomer);

router.delete("/:id", customerController.deleteCustomer);


module.exports = router;
