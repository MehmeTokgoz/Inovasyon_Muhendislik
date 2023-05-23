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
//Get a course using id from database
const getCourseById = async (req, res) => {
  const id = req.params.id;
  try {
    const courses = await Course.findById(id);

    if (!courses) {
      return res.status(404).json({ message: "Course was not found" });
    }
    return res.status(200).json({
      courseName: courses.courseName,
      courseId: courses.courseId,
      instructor: courses.instructor,
      objectId: courses._id,
    });
  } catch (error) {
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

module.exports = { getAllCourses, addNewCourse, getCourseById };
