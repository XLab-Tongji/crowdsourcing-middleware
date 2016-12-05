var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

/* GET labels listing. */
router.route("/:id/labels")
.get(function (req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = {};
    var message = 'Get Label List Success';

    var opts = config.buildOptions("projects/"+req.params.id+"/labels", "GET", false, req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) {
        statusCode = response.statusCode;
        if (!error && statusCode==200) {
        var info = JSON.parse(body);

        //set return data
        data = info;
        }
        else {
        success = false;
        statusCode = 410;
        var errInfo = JSON.parse(body);
        message = errInfo.message;
        if(body) data = body;
        }
        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
})
.post(function (req, res, next) {
  var statusCode = 201;
  var success = true;
  var data = [];
  var message = 'get project labels created';
  var formattedResponse;

  if(req.body['name'] == null || req.body['color'] == null){
      statusCode = 400;
      message = 'Label name or color not specified';
      data = [];
      success = false;

      formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
      res.send(formattedResponse);
  }
  
  if(statusCode != 400) {
      var opts = config.buildOptions('projects/'+req.params.id+'/labels','POST',false,req.get('PRIVATE-TOKEN'));
      opts.body = JSON.stringify(req.body);

      request(opts,function(error,response,body){
          statusCode = response.statusCode;
          if(!error && statusCode == 201){
              data = JSON.parse(body);
          }
          else {
              success = false;
              message = 'Create Labels Error!';
          }
          var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
          res.send(formattedResponse);
      });
  }
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
  var statusCode = 200;
  var message = 'Label deleted!';
  var success = true;
  var data = [];

  if(req.body['name'] == null){
      statusCode = 400;
      message = 'Label name or color not specified';
      data = [];
      success = false;

      formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
      res.send(formattedResponse);
  }


  var opts = config.buildOptions('projects/'+req.params.id+'/labels','DELETE',false,req.get('PRIVATE-TOKEN'));
  opts.body = JSON.stringify(req.body);

  request(opts,function(error,response,body){
      statusCode = response.statusCode;
      if(!error && statusCode == 200){
          data = JSON.parse(body);
      } else {
          success = false;
          message = 'Labels not deleted!';
      }

      var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
      res.send(formattedResponse);
  })
})


module.exports = router;
