const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authUser } = require("../middlewares/auth");
const { getJWT, validatePassword } = require("../models/user");
const {signUpValidation} = require("../utils/signUp");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // const userObj = {firstName: "Ali", lastName: "Ahmad", age:"22", email: "ali@ahmad.com", password: "12345"}

  try {
    const { firstName, lastName, email, password } = req.body;

    signUpValidation(req);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();

    const token = savedUser.getJWT(); // no need for await

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.json({message: "User created successfully", data: savedUser});
  } catch (error) {
    res.status(400).send("Error in creating user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    if (!user.password) {
      return res.status(400).send("No password found for this user.");
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = user.getJWT(); // no need for await

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.send(user);
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
