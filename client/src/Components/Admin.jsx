import React, { useState, useEffect } from "react";
import API, { setAuthToken } from "../API/Api"; // Import API and setAuthToken
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  // useEffect to set the authentication token when the component mounts.
  // This is crucial for protected routes like quiz creation.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      // Optional: Handle case where no token is found, e.g., redirect to login
      console.warn("No token found in localStorage. Admin actions might fail.");
    }
  }, []);

  // State for the quiz question, matching the backend's 'question' field
  const [question, setQuestion] = useState("");
  // State for the four options, initialized as an array of empty strings
  const [options, setOptions] = useState(["", "", "", ""]);
  // State for the correct answer, which will be selected from the options
  const [correctAnswer, setCorrectAnswer] = useState("");
  // State to display feedback messages to the user (e.g., success or error)
  const [submissionMessage, setSubmissionMessage] = useState("");
  // State to manage message style (e.g., green for success, red for error)
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage("");
    setMessageType("");

    const quizData = {
      question,
      options,
      correctAnswer,
    };

    console.log("Attempting to submit quiz data:", quizData);

    try {
      // Use the 'API' instance to send a POST request.
      // 'API.post' automatically includes the 'baseURL' and the 'Authorization' header
      // (if set by setAuthToken).
      const response = await API.post("/quiz", quizData);
      console.log("Quiz submission successful:", response.data);
      setSubmissionMessage(response.data.msg || "Quiz successfully submitted!");
      setMessageType("success");

      // Clear the form fields after successful submission
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      console.error(
        "Error submitting quiz:",
        err.response?.data || err.message
      );
      // Display an informative error message, prioritizing backend message if available.
      setSubmissionMessage(
        err.response?.data?.msg || "Error submitting quiz. Please try again."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a Quiz</h2>

      {/* Display submission messages */}
      {submissionMessage && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submissionMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* Label for the question input */}
          <label htmlFor="question" className="block font-semibold mb-1">
            Question:
          </label>
          <input
            type="text"
            id="question" // Updated ID to match label
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={question} // State variable is now 'question'
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring focus:border-blue-500"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="correctAnswer" className="block font-semibold mb-1">
            Correct Answer:
          </label>
          <select
            id="correctAnswer"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select Correct Answer</option>
            {/* Map through options to populate the dropdown for correct answer.
                            Only show options that are not empty strings. */}
            {options.map(
              (option, index) =>
                option && (
                  <option key={index} value={option}>
                    {option}
                  </option>
                )
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit Quiz
        </button>
        <div className="flex w-full h-[51%] justify-center items-end">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              alert("Logout Success");
              navigate("/");
            }}
            className="bg-red-600 w-full text-white text-2xl p-2 mt-2 rounded"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
