const courseController = require("../controllers/courseController");

const router = require("express").Router()

router.get("/", courseController.getAllCourses)
router.get("/get-a-course/:id", courseController.getCourseById)
router.post("/add-course", courseController.addNewCourse)

module.exports= router