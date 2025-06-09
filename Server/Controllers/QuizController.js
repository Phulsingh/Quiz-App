const Quiz = require("../models/Quiz.js");

// Create Quiz
const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ msg: "Please provide all fields correctly" });
    }

    const quiz = new Quiz({ question, options, correctAnswer });
    await quiz.save();

    res.status(201).json({ msg: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Read all Quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update Quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { question, options, correctAnswer },
      { new: true }
    );

    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    res.status(200).json({ msg: "Quiz updated", quiz });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete Quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    res.status(200).json({ msg: "Quiz deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { createQuiz, getQuizzes, updateQuiz, deleteQuiz };
