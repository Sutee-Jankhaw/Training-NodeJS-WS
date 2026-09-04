var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('../middleware/token.middleware');

router.post('/login', tokenMiddleware, async function(req, res, next) {
  let { username, password } = req.body
  let user = await userSchema.findOne({
    username: username,
  })
  if (!user) {
      return res.status(400).send({
        message: 'Username or password is incorrect'
      });
    }
    if (user.status !== "approved") {
      return res.status(400).send({
        message: 'Account is not approved'
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(401).send({
        message: 'Username or password is incorrect'
      });
    }
    let token = await jwt.sign({ foo:'bar' }, '1234')
    res.status(200).send({
      message: 'Login Success',
      data: [{
        id: user._id,
        username: user.username,
        role: user.role
      }]
    });
});

router.post('/register',async function(req, res, next) {
  let { username, password, role } = req.body
  let user = new userSchema({
    username: username,
    password: await bcrypt.hash(password, 10),
    status: 'not_approved',
    role: role
  })
  await user.save()
  res.status(201).send('Registered');
});

module.exports = router;
