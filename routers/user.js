const express = require('express');
const router = express.Router();
const path = require('path')
global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const config = require('../services/aws')
const Validate = require('../js/authValidate')

const poolData = {
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId
}
const poolRegion = config.cognito.region;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get('/signin', function (req, res) {
  res.sendFile(path.join(__dirname + '/../src/signin.html'))
});

router.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname + '/../src/register.html'))
});

router.post('/signin/submit', function (req, res) {
  const email = req.body.email
  const password = req.body.password

  let authenticationData = {
    Email: email,
    Password: password,
  };
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  let userData = {
    Username: email,
    Pool: userPool
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      let accessToken = result.getAccessToken().getJwtToken();
      let sess = req.session;
      sess.token = accessToken;
      res.redirect('/main');
    },
    onFailure: function (err) {
      console.log(err);
      res.redirect('/user/signin');
    },
  });
})

router.post('/register/submit', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  if (password === confirm_password) {
    let attributeList = [];
    let dataEmail = {
      Name: 'email',
      Value: email,
    }

    let dataName = {
      Name: 'name',
      Value: name,
    }
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
    attributeList.push(attributeEmail);
    attributeList.push(attributeName);
    let cognitoUser = "";
    userPool.signUp(email, password, attributeList, null, function (err, result) {
      if (err) {
        console.log(err);
        res.redirect('/user/register');
        return;
      }
      cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());
      res.redirect('/');
    });
  }
})

router.get('/logout', function (req, res) {
  let cognitoUser =  userPool.getCurrentUser();
  cognitoUser.signOut();
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
});

module.exports = router