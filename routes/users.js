var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST create user. */
router.post('/', function (req, res, next) {
  var opts = config.buildOptions("users", "POST", true);

  opts.body = JSON.stringify(req.body);
  request(opts, function (error, response, body) {
    if (!error) {
      console.log(response.statusCode);
      var info = JSON.parse(body);
      console.log(info);
      //set returnInfo
      var returnInfo = {};
      res.send(returnInfo);
    }
    else {
      console.log('something wrong!');
      res.send(body);
    }
  })
})


module.exports = router;
