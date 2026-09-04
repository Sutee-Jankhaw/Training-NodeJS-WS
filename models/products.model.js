const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    productname: { type: String },
    price: { type: Number},
    Stock: { type: Number }
})

module.exports = mongoose.model('products', productSchema)