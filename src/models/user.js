const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

userSchema.methods.getJWT =  function(){
    const user = this;

    const token = jwt.sign({ _id: user._id }, "Secret", {expiresIn: "7d"});

    return token;
};

userSchema.methods.validatePassword = async function(passwordEntered){
    const user = this;

    const passwordHash = user.password;
    const isMatch = await bcrypt.compare(passwordEntered, passwordHash);
    return isMatch;
}

const User = mongoose.model("User", userSchema);

module.exports = User;