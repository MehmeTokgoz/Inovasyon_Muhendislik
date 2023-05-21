// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./home.scss";
import axios from "axios";

function Home() {
    // eslint-disable-next-line no-unused-vars
    const [studentId, setStudentId] = useState(localStorage.getItem("studentId"))
    const [student, setStudent] = useState(null);

    const getStudentInfo = async () => {
        await axios.get(`http://localhost:3540/api/students/student/${studentId}`).then(({ data }) => {
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

export default Home;
