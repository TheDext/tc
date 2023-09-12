const express = require("express");
const router = express.Router({ mergeParams: true });

router.use("/kg", require("./kg.routes"));

module.exports = router;
