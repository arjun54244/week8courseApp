const { Router } = require("express");
const express = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");

const userRouter = Router();

const bcrypt = require("bcrypt");

userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the hashed password in the database
    await userModel.create({
      email,
      password: hashedPassword, // Save the hashed password
      firstName,
      lastName,
    });

    res.json({
      message: "Signup succeeded",
    });
  } catch (error) {
    res.status(500).send("Error while signing up");
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_USER_PASSWORD // Make sure this environment variable is set for security
    );

    // Send the token in the response (you can also set it as a cookie if needed)
    res.json({ token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

userRouter.post("/purchases", async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }
  const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};
