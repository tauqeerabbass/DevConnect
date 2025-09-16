const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user"); 

const app = express();

const connectDB = require("./config/database");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
