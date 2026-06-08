const express = require("express");
const router = express.Router();

const userRegistration = require("../controllers/userRegistration.controller");
const userLogin = require("../controllers/userRegistration.controller");

router.post("/register", userRegistration);
router.post("/login", userLogin);

module.exports = router;
