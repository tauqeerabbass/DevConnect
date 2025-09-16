const express = require("express");
const userRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender bio";

userRouter.get("/user/requests/received", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const requests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName");        

        res.json({ message: "Received connection requests", data: requests });
        
    } catch (error) {
        res.status(500).send("Error fetching received requests: " + error.message);
    }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({
            $or : [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);


        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        
        res.json({ message: "User connections", data });


    } catch (error) {
        res.status(500).send("Error fetching connections: " + error.message);
    }
});

module.exports = userRouter;