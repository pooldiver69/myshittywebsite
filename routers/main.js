const express = require('express')
const router = express.Router();
const path = require('path')
const Validate = require('../js/authValidate')
const config = require('../services/aws')
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const bucketName = "myshittywebsite"
const poolData = {
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId
}
const poolRegion = config.cognito.region;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var IdentityPoolId = config.IdentityPoolId;
var idKey = `cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}`;
var cognitoUser = userPool.getCurrentUser();
function setCredential() {

  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, result) {
      if (err) {
        console.log('Error in getSession()');
        console.error(err);
      }
      if(result) {
        console.log('User currently logged in.');
        AWS.config.update({
          region: poolRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId,
            Logins: {[idKey]: result.getIdToken().getJwtToken()}
          })
        });
      }
    });
  }
}

AWS.config.update({
  region: poolRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});


router.get('/', function (req, res) {
  console.log(req.session);
  res.sendFile(path.join(__dirname + '/../src/main.html'))
});

router.post('/upload', function (req, res) {
  setCredential()
  var s3 = new AWS.S3({params: {Bucket: bucketName}});
  let file = req.body.file
  var params = {
    Bucket: bucketName,
    Key: "1234",
    Body: file
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data.key + ' successfully uploaded to' + data.Location);
    }
  });
})


module.exports = router