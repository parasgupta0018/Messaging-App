const mongoose = require("mongoose");

let model1 = new mongoose.Schema({
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    email: { type: String, lowercase: true, unique: true },
    phone: { type: Number, unique: true },
    password: String,
    is_active: { type: String, default: null },
    imgURL: { type: String, default: null },
    contacts: { type: [{ type: String, unique: true }], default: null },
    verified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
});

module.exports = mongoose.model("usersdetail", model1);