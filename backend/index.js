const express = require("express")
const {UserModel , TodoModel} = require("./db")

const app = express()

app.use(express.json())

app.post("/signup" , async (req , res)=>{
   const name = req.body.name
   const email = req.body.email
   const password = req.body.password

   await UserModel.insert({
    name : name,
    email : email,
    password : password
   })

   res.json({
    message : "You are Now Signed Up"
   })
})

app.post("/signin" , (req , res)=>{
    
})

app.post("/todo", (req , res)=>{

})

app.get("/todos" , (req , res)=>{

})

app.delete("/")
app.listen(3000)