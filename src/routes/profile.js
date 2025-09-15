const express = require("express");
const { authUser } = require("../middlewares/auth");
const { validateUserEditData } = require("../utils/signUp");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    try {
        const isValid = validateUserEditData(req);

        if(!isValid){
            return res.status(400).send("Invalid data for profile update");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({message: "Profile updated successfully!", data:loggedInUser});

    } catch (error) {
        res.status(500).send("Error updating profile: " + error.message);
    }
})

module.exports = profileRouter;;