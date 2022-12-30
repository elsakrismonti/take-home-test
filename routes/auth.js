const express = require('express');
const router = express.Router();
const authHandler = require("./handlers/auth");

router.post("/login", authHandler.login);

module.exports = router;
