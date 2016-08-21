var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');
/* GET home page. */
router.get('/', function (req, res, next) {
  var withPrivateToken = true;
  var options = config.buildOptions("projects", "GET",true);
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.send(info);
    }
    else {
      console.log('something wrong!');
      res.send(info);
    }
  })

});

module.exports = router;
