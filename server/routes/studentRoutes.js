const studentController = require("../controllers/studentController");

const router = require("express").Router();

router.get("/", studentController.getAllStudents);
router.get("/student/:id", studentController.getStudentById);
router.post("/signup", studentController.signUp);
router.post("/signin", studentController.signIn);
router.get("/signout", studentController.signOut);
router.get("/status", studentController.status);

module.exports = router;