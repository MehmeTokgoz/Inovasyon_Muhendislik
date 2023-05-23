const Student = require("../modules/Students");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Get all students from database belongs the specific id from database
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};
//Get one student belongs the specific id from database
const getStudentById = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }
    return res.status(200).json({
      studentId: student._id,
      name: student.firstName,
      email: student.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const updateStudentById = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;

  //Checking the required fields before updating student
  if (!firstName || !lastName || !email || email.trim() === "") {
    return res.status(422).json({ message: "Invalid Input" });
  }

  //Updating students with new values
  try {
    const student = await Student.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );
    if (!student) {
      return res.status(500).json({ message: "Unable to update" });
    }
    return res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};
//Deleting student

const deleteStudentById = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findByIdAndDelete(id);

    //Checking the existing student before deleting student
    if (!student) {
      return res.status(500).json({ message: "Unable to delete" });
    }
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  //Checking the required fields before creating the student:
  if (!firstName || !lastName || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid Input" });
  }

  // Hashing password:
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    //Saving hashed password to database:
    await newStudent.save();
    return res.status(201).json({ message: "New Student Created." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  // Checking the required fields before sign in
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  //Get the student whose email is provided email.
  try {
    const student = await Student.findOne({ email });

    //Check the student exists or not:
    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }
    //Check the password if the student exists:
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const payload = {
      id: student._id,
      name: student.firstName,
    };
    //Create a token if the password is correct
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    return res.status(200).json({
      message: "Login Successful.",
      access_token: token,
      studentId: student._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

// Check the status, is the student logged in or not:
const status = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Session expired" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Session expired" });
    }
    const student = await Student.findOne({ _id: payload.id });
    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }
    return res.status(200).json({
      _id: student._id,
      name: student.firstName,
      email: student.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  signUp,
  signIn,
  status,
};
