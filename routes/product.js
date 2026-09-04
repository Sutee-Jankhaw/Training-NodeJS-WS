var express = require('express');
var router = express.Router();
var productSchema = require('../models/products.model');
var orderSchema = require('../models/orders.model')

router.get('/', async function(req, res, next) {
  let product = await productSchema.find({})
  res.status(200).send({
      status: 200,
      message: 'Success',
      data: product
    });
});

router.get('/:id', async function(req, res, next) {
  let { id } = req.params
  let product = await productSchema.findById(id)
  res.status(200).send({
      status: 200,
      message: 'Success',
      data: product
    });
});

router.post('/', async function(req, res, next) {
  let { productname, price, stock } = req.body
  let product = new productSchema({
    productname: productname,
    price: price,
    stock: stock,
  })

  await product.save()
  res.status(201).send({
    status: 201,
    message: 'Created Product',
    data: [product]
  })
})

router.post('/:id/orders', async function(req, res, next) {
  let { quantity } = req.body
  let { id } = req.params
  let order = new orderSchema({
    productId: id,
    quantity: quantity,
  })
  
  let updateStock = await productSchema.findOneAndUpdate(
    { _id: id, stock: { $gte: quantity }},
    { $inc: { stock: -quantity } },
    { new: true }
  )
  if (!updateStock) {
    return res.status(400).json({
      message: "Not enough stock"
    });
  }
  await order.save()
  res.status(201).send({
    status: 201,
    message: 'Created Order',
    data: [order]
  })
})

router.put('/:id', async function(req, res, next) {
  try {
    let { productname, price, stock } = req.body
    let { id } = req.params
    let product = await productSchema.findByIdAndUpdate(
      id,
      { productname, price, stock },
      { new: true }
    )
    res.status(201).send({
        status: 201,
        message: 'Updated Product',
        data: [product]
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete('/:id', async function(req, res, next) {
  try {
    let { id } = req.params
    let product = await productSchema.findByIdAndDelete(id)
    res.status(200).send({
        status: 200,
        message: 'Deleted Product',
        data: [product]
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router;
