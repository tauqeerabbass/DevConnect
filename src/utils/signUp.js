const validator = require("validator");

const signUpValidation = (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName){
        throw new Error("First name and last name are required");
    }
    else if (!email || !validator.isEmail(email)){
        throw new Error("Enter a valid email");
    }
    else if (!password || !validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}

const validateUserEditData = (req, res) => {
    const allowedFields = ["firstName", "lastName", "email", "bio", "skills", "age", "gender"];

    const isAllowed = Object.keys(req.body).every((field)=>allowedFields.includes(field));

    return isAllowed;
}

module.exports = {signUpValidation, validateUserEditData};