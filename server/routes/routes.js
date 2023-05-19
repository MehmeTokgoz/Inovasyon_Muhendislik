const studentRoutes = require("./studentRoutes");
const courseRoutes = require("./courseRoutes");
const router = require("express").Router();

router.use("/students", studentRoutes);
router.use("/courses", courseRoutes);

module.exports = router;
