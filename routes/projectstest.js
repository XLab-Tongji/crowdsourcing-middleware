//created by ni on 11/10

var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var underscore = require('underscore');
var request = require('request');

router.get('/test',function(req,res,next){
    res.send('test');
});

router.route('/')
.get(function(req,res,next){
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'get project info';
    //var privateToken = 'Y6ze4UDoJyyJAJXyW2fD';

    var opts = config.buildOptions("projects/?simple=true","GET",false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 200){
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Get Projects Error!';
            if(body) projectMemberInfo['projectsMemberErrorMessage'] = body;
            data.push(projectMemberInfo);
        }

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    });
})
.post(function(req,res,next){
    var statusCode = 201;
    var success = true;
    var data = [];
    var message = 'get project created';
    var formattedResponse;

    if(req.body['name'] == null){
        statusCode = 400;
        message = 'Project name not specified';
        data = [];
        success = false;

        formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    }
    

    var opts = config.buildOptions('projects/','POST',false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 201){
            data = JSON.parse(body);
        }
        else {
            success = false;
            message = 'Create Projects Error!';
        }
        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    });
})


router.route('/:id')
.put(function(req,res,next){
    var test = 'succes';
    res.send(req.params.id);
})
.delete(function(req,res,next){
    var statusCode = 200;
    var message = 'Project deleted!';
    var success = true;
    var data = [];

    var opts = config.buildOptions('projects/'+req.params.id,'DELETE',false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 200){
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Project not deleted!';
        }

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
});

module.exports = router;