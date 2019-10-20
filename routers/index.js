const express= require('express');
const router = express.Router();
const path = require('path')

//Get Homepage
router.get('/',function(req, res){
  res.sendFile(path.join(__dirname + '/../src/index.html'))
});

router.get('/signin', function(req, res) {
  res.redirect('/routers/signin');
})

router.get('/register', function(req, res) {
  res.redirect('/routers/register');
})

module.exports = router