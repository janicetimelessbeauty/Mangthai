const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 6,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,

        },
        password: {
            type: String,
            required: true,
            min: 8,

        },
        isAvatarImageSet: {
            type: Boolean,
            default: false,
        },
        avatarImage: {
            type: String,
            default: "",
        },
        busytime: {
            type: String,
            default: "23:00",
        },
        endbusytime: {
            type: String,
            default: "23:00",
        }
    }
)
module.exports = mongoose.model("Users", userSchema)