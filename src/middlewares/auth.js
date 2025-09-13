const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authAdmin = (req, res, next) =>{
    const token = "thisIsToken";
    const isAdmin = token === "thisIsToken";
    if (isAdmin){
        next();
    }
    else{
        res.status(401).send("Unauthorized");
    }
}

const authUser = async (req, res, next) => {

    try {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, "Secret");
    const {_id} = decoded;

    const user = await User.findById(_id);
    req.user = user;
    next();
        
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid token");
    }
}

module.exports = {authAdmin, authUser};