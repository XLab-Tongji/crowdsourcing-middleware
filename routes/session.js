var express = require('express');
var router = express.Router();
var config = require('../config');
var request = require('request');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST login. */
router.post('/', function (req, res, next) {
  var opts = config.buildOptions("session", "POST");
  opts.body = JSON.stringify(req.body);
  request(opts, function (error, response, body) {
    if (!error) {
      var info = JSON.parse(body);
      res.send(info);
    }
    else {
      console.log('something wrong!');
      res.send(body);
    }
  })
})


module.exports = router;
