var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

/* GET milestones listing. */
router.route("/:id/milestones")
.get(function (req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = {};
    var message = 'Get milestones List Success';

    var opts = config.buildOptions("projects/"+req.params.id+"/milestones", "GET", false, req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) { 
        statusCode = response.statusCode;
        if (!error && statusCode==200) {
            var info = JSON.parse(body);
            data.number = info.number;
            data.milestones = info.milestones;
            for (var x = 0; x < data.milestones.length; x ++ ) {
                data.milestones[x].rate = (info.issueDoneNo[x] * 1.0 ) / ( info.issueNo[x] * 1.0 );
            }
        }
        else {
            success = false;
            statusCode = 410;
            var errInfo = JSON.parse(body);
            message = errInfo.message;
        }
        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
})
.post(function(req,res,next){
    var statusCode = 201;
    var success = true;
    var data = [];
    var message = 'get project milestone created';
    var formattedResponse;

    if(req.body['title'] == null){
        statusCode = 400;
        message = 'Milestone title not specified';
        data = [];
        success = false;

        formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    }
    
    if(statusCode != 400) {
        var opts = config.buildOptions('projects/'+req.params.id+'/milestones','POST',false,req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts,function(error,response,body){
            statusCode = response.statusCode;
            if(!error && statusCode == 201){
                data = JSON.parse(body);
            }
            else {
                success = false;
                message = 'Create Milestone Error!';
            }
            var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
            res.send(formattedResponse);
        });
    }
})


router.route("/:id/milestones/:milestoneId")
.get(function (req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = {};
    var message = 'Get Milestone Success';

    var opts = config.buildOptions("projects/"+req.params.id+"/milestones/"+req.params.milestoneId, "GET", false, req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) { 
        statusCode = response.statusCode;
        if (!error && statusCode==200) {
            var info = JSON.parse(body);
            data.milestone = info.milestone;
            data.milestone.issues = info.issues;
        } else {
            success = false;
            statusCode = 410;
            var errInfo = JSON.parse(body);
            message = errInfo.message;
        }
        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
})
.put(function(req,res,next){
    var statusCode = 200;
    var message = 'Milestone updated!';
    var success = true;
    var data = [];

    var opts = config.buildOptions('projects/' + req.params.id + '/milestones/' + req.params.milestoneId, 'PUT', false, req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts, function (error, response, body) {
        statusCode = response.statusCode;
        if (!error && statusCode == 200) {
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Milestone not updated!';
        }

        var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
        res.send(formattedResponse);
    })
})
.delete(function(req,res,next){
    var statusCode = 200;
    var message = 'Milestone deleted!';
    var success = true;
    var data = [];

    var opts = config.buildOptions('projects/'+req.params.id+'/milestones/'+req.params.milestoneId,'DELETE',false,req.get('PRIVATE-TOKEN'));
    opts.body = JSON.stringify(req.body);

    request(opts,function(error,response,body){
        statusCode = response.statusCode;
        if(!error && statusCode == 200){
            data = JSON.parse(body);
        } else {
            success = false;
            message = 'Milestone not deleted!';
        }

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
})

module.exports = router;
