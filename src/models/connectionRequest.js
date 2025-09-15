const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        }
    }
},
{ timestamps: true }
);

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("You cannot send a connection request to yourself");
    }
    next();
});

connectionRequestSchema.index(
    {fromUserId: 1, toUserId: 1},
    {unique: true}
);

const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequest;