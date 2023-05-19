const Course = require("../modules/Courses");

//Get allCourses from database
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

//Create and save new course
const addNewCourse = async (req, res) => {
  const { courseId, courseName, instructor } = req.body;

  //Check require fields before adding new course
  if (
    !courseId ||
    courseId.trim() === "" ||
    !courseName ||
    courseName.trim() === "" ||
    !instructor ||
    instructor.trim() === ""
  ) {
    return res.status(422).json({ message: "Please fill all inputs" });
  }

  try {
    const newCourse = new Course({
      courseId,
      courseName,
      instructor,
    });
    const savedCourse = await newCourse.save();
    return res
      .status(201)
      .json({ message: "Course added successfully", savedCourse });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { getAllCourses, addNewCourse }
