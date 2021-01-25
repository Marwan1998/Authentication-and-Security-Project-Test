require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const say = console.log;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/logout", function(req, res) {
  res.render("home");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    }).save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          console.log("password is:" + password + "\nfoundUser password is:" + foundUser.password + "\nResult is:" + result);
          if (result === true) {
            res.render("secrets");
          } else {
            console.log("Wrong Password");
          }
        });
      }
    } else {
      res.send(err);
    }
  });
});







app.listen(3000, function() {
  say("server is running...");
});
