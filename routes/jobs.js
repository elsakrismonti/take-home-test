const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const jobsHandler = require("./handlers/jobs");
const jobsIdHandler = require("./handlers/jobs/id");

router.route("/").get(verifyToken, jobsHandler.get);
router.route("/:id").get(verifyToken, jobsIdHandler.get);

module.exports = router;
