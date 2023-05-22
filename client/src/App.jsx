// eslint-disable-next-line no-unused-vars
import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Home";
import SignUpSide from "./components/signUpSide";
import SignInSide from "./components/signInSide";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "1.8rem" },
        }}
      ></Toaster>
      <Routes>
        <Route path="/" element={<SignInSide />} />
        <Route path="/sign-up" element={<SignUpSide />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
