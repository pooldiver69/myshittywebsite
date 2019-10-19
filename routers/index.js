const express= require('express');
const router = express.Router();
const path = require('path')

//Get Homepage
router.get('/',function(req, res){
  res.sendFile(path.join(__dirname + '/../src/index.html'))
});

router.get('/signin', function(req, res) {
  console.log("sign in")
})

router.get('/register', function(req, res) {
  console.log("register")
})

module.exports = router