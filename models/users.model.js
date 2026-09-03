const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    status: {
        type: String,
        enum: ["approved", "not_approved"],
        default: "not_approved"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},{
    timestamps: true
})

module.exports = mongoose.model('users', userSchema)