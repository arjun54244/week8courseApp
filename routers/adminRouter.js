const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");

// brcypt, zod, jsonwebtoken
const  { JWT_ADMIN_PASSWORD } = require("../config");
// const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send("All fields are required");
    }

    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })
    res.json({
        message: "Signup succeeded",
    })
});

adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required");
    }

    const admin = await adminModel.findOne({
        email: email,
        password: password
    })

    if (!admin) {
        return res.status(401).send("Invalid credentials");
    }
    if (admin) {
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);
        res.json({
            token: token
        })
    }else{
        return res.status(401).send("Invalid credentials");
    }
})

adminRouter.post("/course", async function (req, res ) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    if (!title || !description || !imageUrl || !price) {
        return res.status(400).send("All fields are required");
    }

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    })  
})

adminRouter.put("/course", function (req, res)  {
    const adminId = req.userId;
    const { courseId, title, description, imageUrl, price } = req.body;

    if (!title || !description || !imageUrl || !price) {
        return res.status(400).send("All fields are required");
    }

    courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })  
    res.json({
        message: "Course updated",
        courseId: course._id
    })
})
adminRouter.get("/course/bulk", async function(){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})


module.exports = {
    adminRouter: adminRouter
}