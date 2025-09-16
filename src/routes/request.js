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

requestRouter.post("/request/review/:status/:requestId", authUser, async(req,res)=>{
  try {
    // status can be accepted or rejected
    // if requestId is valid
    // if toUserId is the user receiving the request
    // sattus must be interested

    const loggeInUser = req.user;
    const {status, requestId} = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)){
      throw new Error("Invalid status");
    }

    const request = await connectionRequest.findOne({
      _id: requestId,
      toUserId: loggeInUser._id,
      status: "interested"
    });

    if(!request){
      return res.status(404).send("No pending connection request found");
    }

    request.status = status;
    const data = await request.save();
    res.json({message: "Connection request "+status, data});

  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = requestRouter;