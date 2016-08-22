var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');
/* GET home page. */
router.get('/', function (req, res, next) {
  var withPrivateToken = true;
  var options = config.buildOptions("projects", "GET",true);
  request(options, function (error, response, body) {
    var info = "Initial info.";
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      res.send(info);
    }
    else {
      console.log('something wrong!');
      info = "py sb";
      res.send(info);
    }
  })

});

module.exports = router;
