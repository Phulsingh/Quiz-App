import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../API/Api';


const Register = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


   const handleSubmit = async (e) => {
    e.preventDefault();

    API.post("/auth/register", formData).then(()=>{
      alert("User Register Success");
      setFormData({ name: "", email: "", password: ""});
      navigate("/");
    }).catch((err)=>{
      console.log(err.message);
      alert("Error while register")
    })

    // // Store user data in localStorage
    // const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    // existingUsers.push(formData);
    // localStorage.setItem("users", JSON.stringify(existingUsers));

    // alert("User registered successfully!");

    // navigate("/")

    // // Clear form
    // setFormData({
    //   name: "",
    //   email: "",
    //   password: "",
    // });
  };



  return (
     <div className="flex flex-col  justify-center items-center min-h-screen bg-gray-100">
        <h1 className='text-green-800 '>Welcome to Quiz App</h1>
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl text-green-800 font-bold mb-6 text-center">Register</h2>

        <div className="mb-4 form-group">
          <label htmlFor="name" className="block   text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="form-control mt-1"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4 form-group">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="form-control mt-1"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6 form-group">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="form-control mt-1"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 btn btn-primary"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
