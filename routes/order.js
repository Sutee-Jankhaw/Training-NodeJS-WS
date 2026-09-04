var express = require('express');
var router = express.Router();
var orderSchema = require('../models/orders.model')
const bcrypt = require('bcrypt');

router.get('/', async function(req, res, next) {
  try {
    let order = await orderSchema.find({})
    res.status(200).send({
      status: 200,
      message: 'Success',
      data: order
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;