const express = require("express")

const app = express();

app.get("/user", [(req, res, next)=>{
    next()
}, (req, res, next) => {
    next()
}], (req, res) => {
    res.send("Yooo bro 3")
})

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

app.listen(7777, ()=>{
    console.log("Server is running on port 7777")
})