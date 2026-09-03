var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');

router.post('/login',async function(req, res, next) {
  let { username, password } = req.body
  let user = await userSchema.findOne({
    username: username,
  })
  if (!user) {
      return res.status(401).json({
        message: "Username or password is incorrect"
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(401).json({
        message: "Username or password is incorrect"
      });
    }
    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Account is not approved"
      });
    }
    res.status(200).json({
      message: "Login Success",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  res.send('Login Success');
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
  res.send('Registered');
});

module.exports = router;
