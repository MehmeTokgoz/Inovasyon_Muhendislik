const Student = require("../modules/Students");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const getStudentById = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }
    return res.status(200).json({ studentId: student._id, name: student.firstName, email: student.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const updateStudentById = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email || email.trim() === "") {
    return res.status(422).json({ message: "Invalid Input" });
  }
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

const deleteStudentById = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findByIdAndDelete(id);
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

  if (!firstName || !lastName || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid Input" });
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newStudent.save();
    return res.status(201).json({ message: "New Student Created." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student was not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, student.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const payload = {
      id: student._id,
      name: student.firstName,
    };

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

const signOut = (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "Logout Successful." });
};

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
    return res
      .status(200)
      .json({ _id: student._id, name: student.firstName, email: student.email });
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
  signOut,
  status,
};



/////////TÜM KODLAR//////////////////////////////

// const Student = require("../modules/Students");
// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const getAllStudents = async (req, res) => {
//   let students;
//   try {
//     students = await Student.find();
//   } catch (error) {
//     return console.log(error);
//   }

//   if (!students) {
//     return res.status(500).json({ message: "Internal Service Error" });
//   }

//   return res.status(200).json({ students });
// };

// const getStudentById = async (req, res) => {
//   const id = req.params.id;
//   let student;

//   try {
//     student = await Student.findById(id);
//     if (!student) {
//       return res.status(404).json({ message: "Student wasn't found" });
//     }
//     return res.status(200).json({ student });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //Update a student by using a student id
// const updateStudentById = async (req, res) => {
//   const id = req.params.id;
//   const { firstName, lastName, email } = req.body;
//   if (
//     !firstName &&
//     firstName.trim() === "" &&
//     !lastName &&
//     lastName.trim() === "" &&
//     !email &&
//     email.trim() === ""
//   ) {
//     return res.status(422).json({ message: "Invalid Input" });
//   }
//   let student;
//   try {
//     student = await Student.findByIdAndUpdate(id, {
//       firstName,
//       lastName,
//       email,
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   if (!student) {
//     return res.status(500).json({ message: "Unable to update" });
//   }
//   return res.status(200).json({ message: "Student updated successfully" });
// };

// //Delete a student from the database
// const deleteStudentById = async (req, res) => {
//   const id = req.params.id;
//   let student;

//   try {
//     student = await Student.findByIdAndDelete(id);
//   } catch (error) {
//     return console.log(error);
//   }

//   if (!student) {
//     return res.status(500).json({ message: "Unable to delete" });
//   }
//   {
//     return res.status(200).json({ message: "Student deleted successfuly" });
//   }
// };

// const signUp = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   //Checking the required fields before creating the student:
//   if (!firstName || !lastName || !email || !password || password.length < 6) {
//     return res.status(400).json({ message: "Invalid Input" });
//   }
//   // Hashing password:
//   try {
//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(req.body.password, salt);

//     const newStudent = new Student({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     //Saving hashed password to database:
//     await newStudent.save();
//     return res.status(201).json("New Student Created.");
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

// const signIn = async (req, res) => {
//     // Checking the required fields before sign in
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.send({ message: "Email and password are required" });
//     }
//     try {
//       //Get the student whose email is provided email.
//       const student = await Student.findOne({ email: email });
  
//       //Check the student exists or not:
//       if (!student) {
//         return res.send({ message: "Student was not found" });
//       }
//       //Check the password if the student exists:
//       const isPasswordCorrect = await bcryptjs.compare(
//         req.body.password,
//         student.password
//       );
  
//       if (!isPasswordCorrect) {
//         return res.send({ message: "Wrong password" });
//       }
  
//       //Create a cookie and token if the password is correct
//       const payload = {
//         id: student._id,
//         name: student.name,
//       };
//       // Create a token if the password is correct.
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "3h",
//       });
  
//       // Set the token as Authorization header
//       return res
//         .send({ message: "Login Successful.", "access_token": token, "studentId": student._id });
//     } catch (error) {
//       console.log(error);
//     }
//   };


// // const signIn = async (req, res) => {
// //   // Checking the required fields before sign in
// //   const { email, password } = req.body;
// //   if (!email || !password) {
// //     return res.status(422).json({ message: "Email and password are required" });
// //   }
// //   try {
// //     //Get the student whose email is provided email.
// //     const student = await Student.findOne({ email: email });

// //     //Check the student exists or not:
// //     if (!student) {
// //       return res.status(404).json({ message: "Student was not found" });
// //     }
// //     //Check the password if the student exists:
// //     const isPasswordCorrect = await bcryptjs.compare(
// //       req.body.password,
// //       student.password
// //     );

// //     if (!isPasswordCorrect) {
// //       return res.status(400).json({ message: "Wrong password" });
// //     }

// //     //Create a cookie and token if the password is correct
// //     const payload = {
// //       id: student._id,
// //       name: student.name,
// //     };
// //     const token = jwt.sign(payload, process.env.JWT_SECRET, {
// //       expiresIn: "3h",
// //     });

// //     // Set the token as Authorization header
// //     res.header("Authorization", `Bearer ${token}`);
// //     return res
// //       .cookie("access_token", token, {
// //         httpOnly: true,
// //       })
// //       .status(200)
// //       .json({ message: "Login Successful.", "access_token": token, "studentId": student._id });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };

// const signOut = (req, res) => {
//   res.clearCookie("access_token");
//   return res.status(200).json({ message: "Logout Successful." });
// };

// // Check the student


// const status = async (req, res) => {
//   try {
//     const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
//     if (payload) {
//       const student = await Student.findOne({ _id: payload.id });
//       res.send({ _id: student._id, name: student.firstName, email: student.email });
//     } else {
//       res.status(401).send({ message: "Session expired" });
//     }
//   } catch (error) {
//     res.status(500).send({ message: "An error occurred" });
//   }
// };


////İLK HALİ//////

// const status = async (req, res) => {
//   jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, payload) => {
//     if (payload) {
//       var student = await Student.findOne({ _id: payload.id });
//       res.send({ _id: student._id, name: student.firstName, email: student.email });
//     } else {
//       res.send({ message: "Session expired" });
//     }
//   });
// };
/////////İLK/////////////////


// const status = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.json(false);
//   }
//   return jwt.verify(token, process.env.JWT_SECRET, (error) => {
//     if (error) {
//       return res.json(false);
//     }
//     return res.json(true);
//   });
// };

module.exports = {
  getAllStudents,
  getStudentById,
  signUp,
  signIn,
  signOut,
  status,
  updateStudentById,
  deleteStudentById
};
