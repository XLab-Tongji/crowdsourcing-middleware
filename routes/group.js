//created by ni on 11/29
//for the route /group

var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var underscore = require('underscore');
var request = require('request');

router.route('/')
//get group information
.get(function(req,res,next){
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'get group info';

    var opts = config.buildOptions("groups","GET",false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 200){
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Get Projects Error!';
        }

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    });
})
//create group
.post(function(req,res,next){
    var statusCode = 201;
    var success = true;
    var data = [];
    var message = 'Group created';
    var formattedResponse;

    if(req.body['name'] == null){
        statusCode = 400;
        message = 'Group name or path not specified!';
        data = [];
        success = false;

        formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    }
    req.body['path']=req.body['name'];
    console.log(req.body['path']);

    if(statusCode != 400) {
        var opts = config.buildOptions('groups/','POST',false,req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts,function(error,response,body){
            statusCode = response.statusCode;
            if(!error && statusCode == 201){
                data = JSON.parse(body);
            }
            else {
                success = false;
                message = 'Create Group Error!';
            }
            var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
            res.send(formattedResponse);
        });
    }
})

//get certain group
router.route('/:id')
.get(function (req, res,next) {
  var statusCode = 200;
  var success = true;
  var data = {};
  var message = 'Get Group Success';

  var opts = config.buildOptions("/groups/"+ req.params.id, "GET", false, req.get('PRIVATE-TOKEN'));
  opts.body = JSON.stringify(req.body);

  request(opts, function (error, response, body) {
    statusCode = response.statusCode;

    if (!error && statusCode==200) {
      var info = JSON.parse(body);
      data = info;
    }
    else {
      success = false;
      statusCode = 410;
      var errInfo = JSON.parse(body);
      message = errInfo.message;
      console.log('something wrong! '+ message);
      if(body) data = body;
    }
    var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
    res.send(formattedResponse);
  })
})
//delete a group
.delete(function(req,res,next){
    var statusCode = 200;
    var message = 'Group deleted!';
    var success = true;
    var data = [];

    var opts = config.buildOptions('groups/'+req.params.id,'DELETE',false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 200){
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Group not deleted!';
        }

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
})

module.exports = router;