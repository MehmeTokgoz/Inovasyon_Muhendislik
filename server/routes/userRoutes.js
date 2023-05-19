const userController = require("../controllers/userController");

const router = require("express").Router();

 router.get("/", userController.getAllUsers)

 module.exports= router;