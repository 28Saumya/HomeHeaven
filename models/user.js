const mongoose = require("mongoose");

// 🔥 IMPORTANT FIX: .default
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
