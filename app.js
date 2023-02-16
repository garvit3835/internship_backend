const express = require("express");
const app = express();
const cors = require("cors");
const connectdb = require("./db/connect");
const updateToken = require("./db/update");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { ObjectId } = require("mongodb");
const port = process.env.PORT || 8000;

app.use(cors({ credentials: true, origin: process.env.BASE_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signin", async (req, res) => {
  const user = await req.body;
  let collection = await connectdb();
  let dbdata = await collection.findOne({
    username: user.username,
    password: user.password,
  });
  if (dbdata) {
    const token = jwt.sign({ username: dbdata.username }, "thisisarandomsecretkey", {
      expiresIn: "2 minutes",
    });
    // console.log(token);
    updateToken(token, dbdata._id);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 120000),
      httpOnly: true,
    });

    res.json({ status: true });
  } else {
    res.status(400).json({ status: false });
  }
});

app.get("/authcheck", async (req, res, next) => {
  const token = await req.cookies.jwt;
  if (!token) {
    return res.json({ status: false });
  }
  try {
    const verified = jwt.verify(token, "thisisarandomsecretkey");
    const collection = await connectdb();
    // console.log(verified.username);
    const user = await collection.findOne({ username: verified.username});
    if (!user) {
      res.json({ status: false });
    } else {
      res.json({ status: true, user: user.username });
    }
    next();
  } catch (err) {
    res.json({ status: false });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
