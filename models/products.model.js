const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    productname: { type: String },
    price: { type: Number},
    stock: { type: Number }
},{
    timestamps: true
})

module.exports = mongoose.model('products', productSchema)