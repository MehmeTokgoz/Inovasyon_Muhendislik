// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./home.scss";
import axios from "axios";
import CourseTable from "../../components/courseTable";

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [courseList, setCourseList] = useState("");

  // Request to get all posts from database.
  const getAllCourses = async () => {
    await axios.get("http://localhost:3540/api/courses/").then(({ data }) => {
      if (data) {
        console.log(data);
      }
    });
  };
  // Call the getAllPosts function on the page render.
  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <>
      <CourseTable/>
    </>
  );
}

export default Home;
