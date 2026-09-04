var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenMiddleware = require('../middleware/token.middleware');

router.post('/login', tokenMiddleware, async function(req, res, next) {
  try {
    let { username, password } = req.body
    let user = await userSchema.findOne({
      username: username,
    })
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: 'Username or password is incorrect'
      });
    }
    if (user.status !== "approved") {
      return res.status(400).send({
        status: 400,
        message: 'Account is not approved'
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(401).send({
        status: 400,
        message: 'Username or password is incorrect'
      });
    }
    let token = await jwt.sign({ foo:'bar' }, '1234')
    res.send({
      status: 200,
      message: 'Login Success',
      data: [{
        id: user._id,
        username: user.username,
        role: user.role
      }]
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

router.post('/register',async function(req, res, next) {
  try {
    let { username, password, role } = req.body
    let user = new userSchema({
      username: username,
      password: await bcrypt.hash(password, 10),
      status: 'not_approved',
      role: role
    })
    await user.save()
    res.send({
      status: 200,
      message: 'Register Success',
      data: [{
        id: user._id,
        username: user.username,
        role: user.role
      }]
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;
