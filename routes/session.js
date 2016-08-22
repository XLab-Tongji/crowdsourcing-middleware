var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST login info. */
router.post('/', function (req, res, next) {
  var opts = config.buildOptions("session", "POST");

  opts.body = JSON.stringify(req.body);
  request(opts, function (error, response, body) {
    if (!error) {
      var info = JSON.parse(body);
      //set returnInfo
      var returnInfo = {};
      returnInfo['username'] = info['username'];
      returnInfo['name'] = info['name'];
      returnInfo['email'] = info['email'];
      returnInfo['private_token'] = info['private_token'];
      returnInfo['avatar_url'] = info['avatar_url'];
      res.send(returnInfo);
    }
    else {
      console.log('something wrong!');
      res.send(body);
    }
  })
})


module.exports = router;
