const courseController = require("../controllers/courseController");

const router = require("express").Router()

router.get("/", courseController.getAllCourses)
router.post("/add-course", courseController.addNewCourse)

module.exports= router