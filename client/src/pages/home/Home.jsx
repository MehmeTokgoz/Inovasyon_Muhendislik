// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./home.scss";
import axios from "axios";

function Home() {
    const [studentId, setStudentId] = useState(localStorage.getItem("studentId"))
    //Send a request to check user.

  const verifyUser = async () => {
    if (localStorage.getItem("access_token")) {
      await axios
        .get("http://localhost:3540/api/students/status", {
         token: localStorage.getItem("access_token")
        })
        .then((data) => {
          console.log(data);
        });
    }
  };

  useEffect(() => {
    verifyUser();
  }, [studentId]);

  return <div>Home</div>;
}

export default Home;
