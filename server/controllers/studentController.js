const Student = require("../modules/Students");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllStudents = async (req, res) => {
  let students;
  try {
    students = await Student.find();
  } catch (error) {
    return console.log(error);
  }

  if (!students) {
    return res.status(500).json({ message: "Internal Service Error" });
  }

  return res.status(200).json({ students });
};

const getStudentById = async (req, res) => {
  const id = req.params.id;
  let student;

  try {
    student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student wasn't found" });
    }
    return res.status(200).json({ student });
  } catch (error) {
    console.log(error);
  }
};


const signUp = async (req, res) => {
  const { firstName, lastName, email, password} = req.body;

  //Checking the required fields before creating the student:
  if (!firstName || !lastName || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid Input" });
  }
  // Hashing password:
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const newStudent = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    //Saving hashed password to database:
    await newStudent.save();
    return res.status(201).json("New Student Created.");
  } catch (error) {
    console.log(error);
    return (error);
  }
};

const signIn = async (req, res) => {
  // Checking the required fields before sign in
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "Email and password are required" });
  }
  try {
    //Get the student whose email is provided email.
    const student = await Student.findOne({ email: email });

    //Check the student exists or not:
    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }
    //Check the password if the student exists:
    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }

    //Create a cookie and token if the password is correct
    const payload = {
      id: student._id,
      name: student.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

      // Set the token as Authorization header
  res.header('Authorization', `Bearer ${token}`);
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Login Successful."});
  } catch (error) {
    console.log(error);
  }
};

const signOut = (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "Logout Successful." });
};

// Check the status, is the student logged in or not:
const status = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }
  return jwt.verify(token, process.env.JWT_SECRET, (error) => {
    if (error) {
      return res.json(false);
    }
    return res.json(true);
  });
};


module.exports = { getAllStudents, getStudentById, signUp, signIn, signOut, status};
