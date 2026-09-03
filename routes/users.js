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

router.put('/:id/approved',async function(req, res, next) {
  let { id } = req.params
  const status = "approved"

  let user = await userSchema.findByOneAndUpdate(id, { status }, { new: true })
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }
  res.send(user);
});
