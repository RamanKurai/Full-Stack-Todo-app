const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://ramankurai27:ToHICv33ei39Lb51@cluster0.sh3z1.mongodb.net/todo-app-database"
);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Signup Route
app.post("/signup", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[\W_]/),
    name: z.string().min(3)
  });

  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid data format", error: parsedData.error });
  }

  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    await UserModel.create({ name, email, password: hashedPassword });
    res.json({ message: "Signup successful" });
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
});

// Signin Route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Invalid Credentials" });
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

app.listen(5000);
