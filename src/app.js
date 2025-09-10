const express = require("express");
const User = require("./models/user");

const app = express();

const connectDB = require("./config/database");

app.use(express.json());

app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;

    try {
        const user = await User.find({email: userEmail});
        if (!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Error in fetching user");
    }
})

app.get("/feed", async (req, res)=>{
    try {
        const users = await User.find({});
        if (!users){
            res.status(404).send("No users found");
        }else{
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Error in fetching feed");
    }
})

app.post("/signup", async (req, res) => {
    // const userObj = {firstName: "Ali", lastName: "Ahmad", age:"22", email: "ali@ahmad.com", password: "12345"}

    const user = new User(req.body);

    try {
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error in creating user");
    }
})

app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        console.log(user);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error in deleting user");
    }
})

app.patch("/user", async (req, res) => {
    const userEmail = req.body.email;
    const body = req.body;

    try {
        const user = await User.findOneAndUpdate({email: userEmail}, body);
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Error in updating user");
    }
})

connectDB().then(()=>{
    console.log("Connected to the database");
    app.listen(7777, ()=>{
    console.log("Server is running on port 7777")
})
}).catch((err)=>{
    console.log("failed to connect to the database")
});

// const {authAdmin, authUser} = require("./middlewares/auth");

// app.use("/admin", authAdmin);

// app.get("/error", (req, res) => {
    
//         throw new Error("This is a custom error")
//     // try {
//     //     res.send("This is error route")
//     // } catch (error) {
//     //     res.status(500).send("Internal server error")
//     // }
// })

// app.get("/admin/getAllData", (req, res)=>{
//     res.send("All data from admin")
// })

// app.delete("/admin/deleteUser", (req,res)=>{
//     res.send("User deleted by admin")
// })

// app.get("/user", authUser, (req, res)=>{
//     res.send("Yooo bro")
// })

// app.use("/", (err, req, res, next) => {
//     if (err){
//         res.status(500).send("Internal server error")
//     }
// })

// app.get("/user", [(req, res, next)=>{
//     next()
// }, (req, res, next) => {
//     next()
// }], (req, res) => {
//     res.send("Yooo bro 3")
// })

// app.post("/user", (req, res) => {
//     res.send("User created")
// })

// app.put("/user", (req, res)=>{
//     res.send("User updated")
// })

// app.delete("/user", (req, res) => {
//     res.send("User deleted")
// })

// app.use("/test/2", (req, res)=>{
//     res.send("This is a test 2222 route")
// })

// app.use("/test", (req, res)=>{
//     res.send("This is a test route")
// })

// app.use("/hello/2", (req, res)=>{
//     res.send("Hello from /hello 2222 route")
// })

// app.use("/hello", (req, res)=>{
//     res.send("Hello from /hello route")
// })

