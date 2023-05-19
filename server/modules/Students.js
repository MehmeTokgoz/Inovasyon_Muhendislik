const mongoose = require("./connection");

//Creating new student schema
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
    },
  ],
});
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
