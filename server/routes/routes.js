const studentRoutes = require("./studentRoutes");
const router= require("express").Router();

router.use("/students", studentRoutes)

module.exports=router