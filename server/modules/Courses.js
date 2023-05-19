const mongoose = require("./connection");


//Creating new courses schema
const coursesSchema = new mongoose.Schema({
    coursId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    Instructor: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      },
    ],
  });
  const Course = mongoose.model("Course", coursesSchema);
  
  module.exports = Course;