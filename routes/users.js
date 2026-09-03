var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model')
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',async function(req, res, next) {
  let { username, password, role } = req.body
  let user = new userSchema({
    username: username,
    password: await bcrypt.hash(password, 10),
    status: 'not_approved',
    role: role
  })
  await user.save()
});

module.exports = router;
