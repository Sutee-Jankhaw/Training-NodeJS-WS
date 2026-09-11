var express = require('express');
var router = express.Router();
var orderSchema = require('../models/orders.model')
var productSchema = require('../models/products.model')
const dateFormat = require('../utils/dateformat')
const bcrypt = require('bcrypt');

router.get('/', async function(req, res, next) {
  try {
    let orders = await orderSchema.find({})

    orders = orders.map(order => ({
      ...order.toObject(),
      createdAt: dateFormat(order.createdAt),
      updatedAt: dateFormat(order.updatedAt)
    }))
    res.status(200).send({
      status: 200,
      message: 'Success',
      data: orders
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

router.post('/', async function(req, res, next) {
  try {
    const products = req.body

    const orderProducts = []
    for (const item of products) {
      const product = await productSchema.findById(item._id)
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        })
      }
      if (product.stock < item.amount) {
        return res.status(400).json({
          message: `${product.productname} is out of stock`
        })
      }
      const totalPrice = product.price * item.amount
      orderProducts.push({
        productId: product._id,
        productname: product.productname,
        quantity: item.amount,
        totalPrice: totalPrice
      })
      await productSchema.findByIdAndUpdate(
        product._id,
        {
          $inc: {
            stock: -item.amount
          }
        }
      )
    }
    const order = await orderSchema.create({
      products: orderProducts
    })

    res.status(201).json({
      message: "Created Order",
      data: order
    })
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let { id } = req.params
    let order = await orderSchema.findByIdAndDelete(id)
    if (!order) {
      res.status(400).send({
        data: null
      })
    }
    res.status(200).send({
        status: 200,
        message: 'Deleted Order',
        data: order
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;