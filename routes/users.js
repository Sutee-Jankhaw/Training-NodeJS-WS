var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');

router.put('/:id/approve',async function(req, res, next) {
  try {
    let { id } = req.params
    const status = "approved"

    let user = await userSchema.findByIdAndUpdate(id, { status }, { new: true })
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.status(201).send({
      status: 201,
      message: 'Updated User',
      data: [user]
    })
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;