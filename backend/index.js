const express = require("express");
const { UserModel, TodoModel } = require("./db");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ramankurai27:9631WgXmDF52YvSB@cluster0.sh3z1.mongodb.net/todo-app-database"
);
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ramanpapa123";

const app = express();

app.use(express.json());

const auth = (req, res, next) => {
    const token = req.headers.token;
  
    const decodedData = jwt.verify(token, JWT_SECRET);
  
    if (decodedData) {
      req.userId = decodedData.id;
      next();
    } else {
      res.status(403).json({
        message: "Invalid Credentials",
      });
    }
  };

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  await UserModel.create({
    name: name,
    email: email,
    password: password,
  });

  res.json({
    message: "You are Now Signed Up",
  });
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
    password: password,
  });
  console.log(user);
  if (user) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});

app.post("/todo", auth, (req, res) => {
  const userId = req.userId;
  res.json({
    userId : userId
  });
});

app.get("/todos", auth, (req, res) => {
  const userId = req.userId;
  res.json({
    userId : userId
  });
});



app.listen(3000);
