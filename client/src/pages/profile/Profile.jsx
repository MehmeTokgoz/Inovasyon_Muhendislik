/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./profile.scss";
import axios from "axios";

function Profile() {
  // eslint-disable-next-line no-unused-vars
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [student, setStudent] = useState(null);
  const [currentStudentCourses, setCurrentStudentCourses] = useState(
    localStorage.getItem("myCoursesList"),
  );

  const getStudentInfo = async () => {
    await axios
      .get(`http://localhost:3540/api/students/student/${studentId}`)
      .then(({ data }) => {
        console.log(data);
        setStudent(data);
      });
  };

  // Call the getStudentInfo function on page render.
  useEffect(() => {
    getStudentInfo();
  }, [studentId]);

  return <div>Welcome {student && student.name}</div>;
}

export default Profile;
