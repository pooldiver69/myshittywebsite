const express = require('express')
const router = express.Router();
const path = require('path')
const Validate = require('../js/authValidate')

router.get('/', Validate, function (req, res) {
  console.log(req.session);
  res.sendFile(path.join(__dirname + '/../src/main.html'))
});

module.exports = router