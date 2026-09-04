var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');

router.put('/:id/approve',async function(req, res, next) {
  let { id } = req.params
  const status = "approved"

  let user = await userSchema.findByIdAndUpdate(id, { status }, { new: true })
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }
  res.send(user);
});

module.exports = router;