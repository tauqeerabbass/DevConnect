const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlenght: 3,
        maxllength: 30,
    },
    lastName: {
        type: String,
        minLenght: 3,
        maxLength: 30,
    },
    age: {
        type: Number,
        min:18,
        max: 100,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLenght: 6,
        maxLength: 64,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    gender: {
        type: String,
        validate(value){
            if (!["male", "female", "other"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    skills:{
        type: [String],
    },
    bio: {
        type: String,
        default: "Software Engineer"
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;