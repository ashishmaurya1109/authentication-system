const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String, 
        required: false,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;