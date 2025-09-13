const express = require("express");
const User = require("./models/user");
const signUpValidation = require("./utils/signUp");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");
const {getJWT, validatePassword} = require("./models/user");

const app = express();

const connectDB = require("./config/database");

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Error in fetching user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error in fetching feed");
  }
});

app.post("/signup", async (req, res) => {
  // const userObj = {firstName: "Ali", lastName: "Ahmad", age:"22", email: "ali@ahmad.com", password: "12345"}

  const { firstName, lastName, email, password } = req.body;

  try {
    signUpValidation(req);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error in creating user:" + error.message);
  }
});

app.post("/login", async (req, res) => {
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

    res.send("User logged in successfully");
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});


app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
  }
});

app.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    console.log("Connection request sent");
    res.send("Connection request sent");
  } catch (error) {
    res.status(500).send("Error sending connection request: " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findOneAndDelete(userId);
    console.log(user);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error in deleting user");
  }
});

app.patch("/user", async (req, res) => {
  const userEmail = req.body.email;
  const body = req.body;

  try {
    const allowedFields = ["lastName", "password", "skills", "bio"];
    const isAllowed = Object.keys(body).every((field) =>
      allowedFields.includes(field)
    );
    if (!isAllowed) {
      throw new Error("Invalid updates!");
    }
    const user = await User.findOneAndUpdate({ email: userEmail }, body);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error in updating user");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("failed to connect to the database");
  });
