const express = require('express');
const app = express();
const {userRouter} = require('./routers/userRouter');
const {adminRouter} = require('./routers/adminRouter');
const {courseRouter} = require('./routers/courseRouter');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', function (req, res) {
    res.json({
        message : "This is home page "
    })
})

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);


async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("listening on port 3000")
}

main()