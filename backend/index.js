const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const bcrypt = require("bcrypt");
const {z} = require("zod")

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ramankurai27:ToHICv33ei39Lb51@cluster0.sh3z1.mongodb.net/todo-app-database"
);
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email : z.string().min(3).max(100).email(),
    password : z.string().min(3).max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
    name : z.string().min(3).max(100)
  })

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      message : "Incorrect Format",
      error : parsedDataWithSuccess.error
    })
    return 
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);
    await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.json({
      message: "You are Now Signed Up",
    });
  } catch (error) {
    res.status(403).json({
      message: "User already exists",
    });
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
  });
  if (!user) {
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
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

app.post("/todo", auth, async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;

  await TodoModel.create({
    title,
    userId,
    done,
  });
  res.json({
    message: "Todo created",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId: userId,
  });
  res.json({
    todos,
  });
});

app.listen(3000);
