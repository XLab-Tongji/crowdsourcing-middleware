var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

/* GET users listing. info less */
router.route('/')
  .get(function (req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'get user list';

    var opts = config.buildOptions("users", "GET", false, req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) {
      statusCode = response.statusCode;
      if (!error && statusCode == 200) {
        data = JSON.parse(body);
      } else {
        success = false;
        message = 'Get UserList Error!';
      }

      var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
      res.send(formattedResponse);
    });
  })


/*Get user info by username info more*/
router.route('/:username')
  .get(function (req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'get user list';

    var opts = config.buildOptions("/users?username=" + req.params.username, "GET", false, "kbu9Hyz67Y5DRhYethcc");
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) {
      statusCode = response.statusCode;
      if (!error && statusCode == 200) {
        data = JSON.parse(body);
      } else {
        success = false;
        message = 'Get UserList Error!';
      }

      var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
      res.send(formattedResponse);
    });
  })

/* POST create user. */
router.post('/', function (req, res, next) {
  var statusCode = 200;
  var success = true;
  var data = {};
  var message = 'create new user success';

  var opts = config.buildOptions("users", "POST", true);
  opts.body = JSON.stringify(req.body);

  request(opts, function (error, response, body) {
    statusCode = response.statusCode;
    if (!error && statusCode == 201) {
      var info = JSON.parse(body);

      //set return data
      data['username'] = info['username'];
      data['name'] = info['name'];
      data['email'] = info['email'];
      data['private_token'] = info['private_token'];
      data['avatar_url'] = info['avatar_url'];
    }
    else {
      success = false;
      statusCode = 410;
      var errInfo = JSON.parse(body);
      message = errInfo.message;
      console.log('something wrong! ' + message);
      if (body) data = body;
    }
    var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
    res.send(formattedResponse);
  })
})


module.exports = router;
