const express = require("express");
const userRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/feed", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        
        limit = limit>50 ? 50 : limit;

        const connectionRequests = await connectionRequest.find({
            $or :[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const excludeUserIds = new Set();
        connectionRequests.forEach((req) => {
            excludeUserIds.add(req.fromUserId.toString());
            excludeUserIds.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and : [
                {_id: {$nin: Array.from(excludeUserIds)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ message: "User feed", data: users });

    } catch (error) {
        res.status(500).send("Error fetching feed: " + error.message);
    }
});

module.exports = userRouter;