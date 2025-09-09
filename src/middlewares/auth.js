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

const authUser = (req, res, next) => {
    const token = "thisIsToken";
    const isUser = token === "thisIsToken";
    if( isUser){
        next();
    }
    else{
        res.status(401).send("Unauthorized");
    }
}

module.exports = {authAdmin, authUser};