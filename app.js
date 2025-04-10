const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("mongodb://localhost:27017/propro", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("index", { username: req.session.user });
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render("login", { error: "Invalid credentials" });
    }
    req.session.user = user.username;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Login failed" });
  }
});

app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("register", { error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { error: "Username already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("register", { error: "Registration failed" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Smart local chatbot logic (no API required)
app.post("/chat", (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  let reply = "🤖 I didn't get that. Try asking about NIFTY, SIP, mutual funds, or a stock like TCS.";

  if (msg.includes("nifty")) {
    reply = "📈 NIFTY is around 22,500 points today. The market is showing steady performance.";
  } else if (msg.includes("mutual fund")) {
    reply = "💼 Mutual funds are professionally managed investment schemes, great for long-term growth.";
  } else if (msg.includes("sip")) {
    reply = "📊 SIPs are a smart way to invest small amounts regularly in mutual funds.";
  } else if (msg.includes("tcs")) {
    reply = "🧑‍💻 TCS stock is performing steadily with strong fundamentals. Always research before investing.";
  } else if (msg.includes("stock")) {
    reply = "📊 The stock market is dynamic. Diversify and invest based on your risk profile.";
  }

  res.json({ reply });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
