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

module.exports = signUpValidation;