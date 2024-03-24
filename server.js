require("dotenv").config()
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const upload = multer({dest:"./files"})
mongoose.connect(process.env.DATABASE_URL)
const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), (req, res)=>{
    res.send("hello")
})

app.listen(process.env.PORT || 4000);
