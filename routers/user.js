const express= require('express');
const router = express.Router();
const path = require('path')

router.get('/signin',function(req, res){
  res.sendFile(path.join(__dirname + '/../src/signin.html'))
});

router.get('/register',function(req, res){
  res.sendFile(path.join(__dirname + '/../src/register.html'))
});

module.exports = router