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
      res.json({ msg: "User already exists. Please login!!" });
      return;
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (hash) {
          const user = new UserModel({ ...req.body, password: hash });
          await user.save();
          res.json({ msg: "User registered.", user });
        } else {
          res.json({ err: err.message });
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
            { userID: findUser._id, userName: findUser.name },
            process.env.secrete
          );

          if (token) {
            res.json({ msg: "User Logged in." }, token);
          } else {
            res.json({ msg: "Something went wrong. Please try again." });
          }
        } else {
          res.json({ msg: "Invalid Credentials." });
        }
      });
    } else {
      res.json({ msg: "User doesnt exist. Sign in first to continue." });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { userRouter };
