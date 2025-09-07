const express = require("express")

const app = express();

// app.use("/", (req, res)=>{
//     res.send("Hello World!")
// })

app.use("/test", (req, res)=>{
    res.send("This is a test route")
})

app.use("/hello", (req, res)=>{
    res.send("Hello from /hello route")
})

app.listen(7777, ()=>{
    console.log("Server is running on port 7777")
})