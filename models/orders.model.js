const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            productname: {
                type: String,
                ref: "products"
            },
            quantity: {
                type: Number
            },
            totalPrice: {
                type: Number
            }
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('orders', orderSchema)