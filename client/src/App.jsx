import React from "react";
import QuizApp from "./Components/QuizApp";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Admin from "./Components/Admin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<QuizApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
