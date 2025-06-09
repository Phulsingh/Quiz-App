import React, { useState, useEffect, useContext } from "react";
import MyContaxt from "../ContaxtAPI/MyContaxt";
import API from "../API/Api";
import { useNavigate } from "react-router-dom";

const QuizApp = () => {
  const navigate = useNavigate();
  const { questionsData: contextQuestionsData } = useContext(MyContaxt);
  const [questionsData, setLocalQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get("/quiz");
        setLocalQuestionsData(response.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // If context already has data, use it; otherwise, fetch.
    if (contextQuestionsData && contextQuestionsData.length > 0) {
      setLocalQuestionsData(contextQuestionsData);
      setLoading(false);
    } else {
      fetchQuizzes();
    }
  }, [contextQuestionsData]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [showScore, setShowScore] = useState(false);

  // *** IMPORTANT FIX: Add conditional rendering ***
  // Only try to access currentQuestion properties if questionsData exists and is not empty
  const currentQuestion = questionsData[currentQuestionIndex];
  const totalQuestions = questionsData.length;

  // Render a loading state or error message if data is not ready
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-100 p-4 rounded-md mx-auto my-auto text-red-700 font-medium">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">
          No quizzes available. Please add some from the Admin panel.
        </p>
      </div>
    );
  }

  const handleOptionChange = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: option,
    });
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(false);
    setShowScore(false);
  };

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    questionsData.forEach((q, idx) => {
      // Ensure q.correctAnswer exists before comparison
      if (
        selectedOptions[idx] &&
        q.correctAnswer &&
        selectedOptions[idx] === q.correctAnswer
      ) {
        score++;
      }
    });
    return score;
  };

  // Show score when the user has answered all questions
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      // Last question reached; calculate score
      setShowScore(true);
    }
  };

  const score = calculateScore();
  // Ensure totalQuestions is not zero to prevent division by zero
  const percentage =
    totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 bg-gray-100 font-inter">
      {/* Center Panel - Takes remaining width, responsive padding */}
      <div className="flex-1 p-4 md:p-6 bg-white rounded-md shadow-md">
        {showScore ? (
          // Final Score
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Quiz Completed!
            </h2>
            <p className="text-xl text-gray-700 mb-2">
              Your Score: <span className="font-semibold">{score}</span> /{" "}
              <span className="font-semibold">{totalQuestions}</span>
            </p>
            <p className="text-xl text-gray-700">
              Percentage: <span className="font-semibold">{percentage}%</span>
            </p>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedOptions({});
                setShowScore(false);
                // Optionally re-fetch quizzes if they might have changed
                // setLoading(true);
                // fetchQuizzes();
              }}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          // Current Question Display
          <>
            <div className="mb-4 text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">
              {currentQuestion.question}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected =
                  selectedOptions[currentQuestionIndex] === option;

                let optionClass =
                  "flex items-center p-3 rounded-lg border-2 cursor-pointer transition duration-200 ";

                if (showAnswer) {
                  if (isCorrect) {
                    optionClass +=
                      "border-green-500 bg-green-100 text-green-800 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    optionClass += "border-red-500 bg-red-100 text-red-800";
                  } else {
                    optionClass +=
                      "border-gray-300 bg-gray-50 hover:bg-gray-100";
                  }
                } else {
                  optionClass += isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-gray-300 bg-white hover:bg-gray-100";
                }

                return (
                  <label key={index} className={optionClass}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionChange(option)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 mr-3"
                      disabled={showAnswer} // Disable checkbox when answer is shown
                    />
                    <span className="text-base sm:text-lg">{option}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={toggleShowAnswer}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 flex-shrink-0"
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>

              <div className="flex w-full sm:w-auto space-x-4">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      currentQuestionIndex > 0 ? currentQuestionIndex - 1 : 0
                    )
                  }
                  disabled={currentQuestionIndex === 0} // Disable if on first question
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                >
                  {currentQuestionIndex === totalQuestions - 1
                    ? "Finish"
                    : "Next"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Left Panel: Question Numbers - Fixed width on desktop, full width on mobile */}
      <div className="w-full md:w-1/6 p-2 bg-white shadow-md rounded-md mb-4 md:mb-0 md:mr-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Questions</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {questionsData.map((q, idx) => (
            <button
              key={q.id || idx} // Use q.id if available, fallback to index
              onClick={() => goToQuestion(idx)}
              className={`p-2 rounded-md text-sm font-medium transition duration-200
                ${
                  idx === currentQuestionIndex
                    ? "bg-blue-500 text-white shadow-lg"
                    : selectedOptions[idx]
                    ? "bg-green-300 text-green-800 hover:bg-green-400"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="flex w-full h-[51%] justify-center items-end">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              alert("Logout Success");
              navigate("/");
            }}
            className="bg-red-600 text-white text-2xl p-3"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
