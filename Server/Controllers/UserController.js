const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User.js");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_USER, { expiresIn: "7d" });

const Register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User Already Exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();
    const token = generateToken(newUser._id);
    res.status(201).json({ msg: "User Registered Successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ msg: "Password does not match" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ msg: "User Login Success", token, user });
  } catch (error) {
    res.status(500).json({ msg: "Error while login", error });
  }
};

const Logout = (req, res) => {
  res.clearCookie("token"); // "token" is the cookie name where JWT is stored
  res.status(200).json({ msg: "User logged out successfully" });
};



module.exports = { Register, Login, Logout };
