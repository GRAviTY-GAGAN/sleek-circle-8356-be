const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { UserModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      res.statusMessage = "User exists!!";
      res.json({
        msg: "User already exists. Please login!!",
        status: "warning",
      });
      return;
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (hash) {
          const user = new UserModel({ ...req.body, password: hash });
          await user.save();
          res.statusMessage = "Account created.";
          res.json({
            msg: "We've created your account for you.",
            status: "success",
            user,
          });
        } else {
          res.statusMessage = "Something went wrong!";
          res.json({ msg: err.message, status: "warning" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      bcrypt.compare(password, findUser.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userID: findUser._id, userName: findUser.name, role: "user" },
            process.env.secrete
          );

          if (token) {
            res.statusMessage = "Success.";
            res.json({ msg: "User Logged in.", token,nameOfUser: findUser.name, status: "success" });
          } else {
            res.statusMessage = "Failed to login.";
            res.json({
              msg: "Something went wrong. Please try again.",
              status: "warning",
            });
          }
        } else {
          res.statusMessage = "Failed to login.";
          res.json({ msg: "Invalid Credentials.", status: "error" });
        }
      });
    } else {
      res.statusMessage = "User doesnt exist. ";
      res.json({ msg: "Sign in first to continue.", status: "warning" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.post("/admin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email == process.env.adminEmail && password == process.env.adminPass) {
      const token = jwt.sign(
        { adminEmail: email, role: "admin" },
        process.env.secrete
      );

      if (token) {
        res.cookie("jwt", token, { httpOnly: true, secure: false });
        res.cookie("role", "Admin"); //tried to achieve with cookies but was not able to access cookie data had to depend on token and local storage
        res.statusMessage = "Success";
        res.json({
          msg: "Login Successful.",
          status: "success",
          token,
          cookie: req.cookies,
        });
      }
    } else {
      res.statusMessage = "Invalid Credentials!";
      res.json({ msg: "Check you email and password.", status: "error" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.post("/verify", (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
      jwt.verify(token, process.env.secrete, (err, decoded) => {
        if (decoded) {
          res.json({ decoded, cookie: req.cookies });
        }
      });
    } else {
      res.json({ msg: "Please login again!!" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { userRouter };
//
