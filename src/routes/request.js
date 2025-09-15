const express = require("express");
const { authUser } = require("../middlewares/auth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(req.params.status)){
      throw new Error("Invalid status");
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).send("User not found");
    }

    const isExistingRequest = await connectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    });

    if (isExistingRequest) {
      return res.status(400).send("Connection request already exists");
    }

    const request = new connectionRequest({
      fromUserId, 
      toUserId,
      status: req.params.status
    });

    await request.save();

    res.json({ message: "Connection request sent", data: request });

  } catch (error) {
    res.status(500).send("Error sending connection request: " + error.message);
  }
});

module.exports = requestRouter;