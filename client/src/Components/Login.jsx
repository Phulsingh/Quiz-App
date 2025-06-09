import React, { useState } from "react";

import MyContaxt from "../ContaxtAPI/MyContaxt";
import { useNavigate } from "react-router-dom";
import API from "../API/Api.js";
import { setAuthToken } from "../API/Api.js";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login",{email, password});
      console.log(res);
      console.log(res.data);
      const { token ,user} = res.data;
      if (token) {
        setAuthToken(token);
        localStorage.setItem("token", token);
        if(user && user.isAdmin){
          navigate("/admin");
          alert("Welcome Admin")
        }else{
          navigate("/home");
          alert("Welcome user")
        }
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid Credential")
    }

    //  const user = users.find((u)=> u.email === email && u.password === password);

    //  if(user){
    //   alert("Login Successfull");
    //   navigate("/home")
    //  }else{
    //   alert("Invalid Credential");
    //  }

    //  //Clear the form data
    //  setEmail("");
    //  setPassword("");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1>Welcome to Quiz App</h1>
      <div className="bg-white p-6 rounded shadow-md w-80 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
