const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/Auth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("UserData saved successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Please enter a valid email");
    }

    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      //Create JWT
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.send("Login successful!!");
    } else {
      throw new Error("Your password is Incorrect");
    }
  } catch (error) {
    res.status(400).send("Login Failed: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!!!");
});

module.exports = authRouter;
