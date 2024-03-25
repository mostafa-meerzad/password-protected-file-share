require("dotenv").config();
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const File = require("./models/file");

const upload = multer({ dest: "./files" });
mongoose.connect(process.env.DATABASE_URL);
const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password !== null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File(fileData).save();
  // console.log(file)
  // res.send(file.originalName)
  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", async (req, res) => {
  // res.send(`here is the file you sent : ${req.params.id}`);
  const file = await File.findById(req.params.id);
  file.downloadCount++;
  await file.save();
  console.log(file);
  res.download(file.path, file.originalName);
});

app.listen(process.env.PORT || 4000);
