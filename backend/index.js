const express = require("express")
const { UserModel , TodoModel} = require("./db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "ramanpapa123"
const app = express()

app.use(express.json())

app.post("/signup" , async (req , res)=>{
   const name = req.body.name
   const email = req.body.email
   const password = req.body.password

   await UserModel.create({
    name : name,
    email : email,
    password : password
   })

   res.json({
    message : "You are Now Signed Up"
   })
})

app.post("/signin" , async (req , res)=>{
    const email = req.body.email
    const password = req.body.password

   const user =  await UserModel.findOne({
        email : email,
        password : password
    })
   console.log(user)
    if (user) {
        const token = jwt.sign({
            id : user._id
        })
        res.json({
         token : token
        })
    } else{
        res.status(403).json({
            message : "Invalid Credentials"
        })
    }
})

app.post("/todo", (req , res)=>{

})

app.get("/todos" , (req , res)=>{

})

app.delete("/")
app.listen(3000)