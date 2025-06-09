const express = require("express");
const router = express.Router()

const {createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz}  = require("../Controllers/QuizController.js");

const adminMiddleware = require("../Middleware/Middlware.js");

router.post("/", adminMiddleware, createQuiz);
router.get("/", getQuizzes);
router.put("/:id", adminMiddleware, updateQuiz);
router.delete("/:id", adminMiddleware, deleteQuiz);

module.exports = router;
