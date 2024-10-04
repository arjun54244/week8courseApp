const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
});

const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Course', courseSchema);
const courseModel = mongoose.model('Admin', adminSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}