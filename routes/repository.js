//created by ni on 11/20
//for the route /project

var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var underscore = require('underscore');
var request = require('request');

router.route('/:id/tree')
//get project tree information with commit information
//param[path] is required '?path=' to get the root
.get(function(req,res,next){
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'get project tree';


    if(req.query.path == undefined) {
        statusCode = 400;
        message = "path not given"
        success = fa
        res.send(apiformat.formatResponse(statusCode,message,data,success));
     }

     var ref_name = "";
     if(req.query.ref_name != undefined) {
        ref_name = "&ref_name="+req.query.ref_name;
     }

     if(statusCode != 400) {
        var opts = config.buildOptions("projects/"+req.params.id+"/repository/tree?path="+req.query.path+ref_name,"GET",false,req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts,function(error,response,body){
            statusCode = response.statusCode;
            if(!error && statusCode == 200){
                var resp  = JSON.parse(body);
                data = resp.entry;
                for(var x = 0; x < resp.number; x ++) {
                    data[x].commit = resp.commit[x];

                    var date = new Date();
                    var date2 = new Date(data[x].commit.committed_date);

                    var sub = parseInt((date.getTime()-date2.getTime())/(1000*60*60));
                    if(sub <= 24) {
                        if(sub <= 1)
                            data[x].commit.committed_date = "updated just now";
                        else
                            data[x].commit.committed_date = sub + " hours ago";
                    } else if (sub <= 24 * 31) {
                        var temp = parseInt(sub / 24);
                        if(temp == 1)
                            data[x].commit.committed_date = "1 day ago";
                        else
                            data[x].commit.committed_date =  temp + " days ago";
                    } else if (sub <= 24 * 31 * 365) {
                        var temp = parseInt(sub / 24 / 31);
                        if(temp == 1)
                            data[x].commit.committed_date = "about 1 month ago";
                        else
                            data[x].commit.committed_date = "about " + temp + " months ago";
                    } else {
                        var temp = parseInt(sub / 24 / 31 / 365);
                        if(temp)
                            data[x].commit.committed_date = "about 1 year ago";
                        else
                            data[x].commit.committed_date = "about " + temp + " years ago";
                    }
                }

            } else if (!error && statusCode == 404) {
                var body = JSON.parse(response.body);
                if(body.message == "404 Tree Not Found"){
                    statusCode = 200
                } else  if(body.message == "404 Project Not Found") {
                    success = false;
                    message = "Project not found";
                }
            } else {
                success = false;
                message = 'Get Project Tree Error!';
            }

            var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
            res.send(formattedResponse);
        });
     }
});

router.route('/:id/files')
.get(function(req,res,next){
    var statusCode = 200;
    var data = [];
    var success = true;
    var message = "get raw text";

    if(req.query.filepath == undefined) {
        statusCode = 400;
        message = "path not given"
        success = false;
        res.send(apiformat.formatResponse(statusCode,message,data,success));
     }

    var sha = "";
    if(req.query.sha == undefined) 
        sha = "master";
    else
        sha = req.query.sha;

    if(statusCode != 400) {
        var opts = config.buildOptions("projects/"+req.params.id+"/repository/blobs/"+sha+"?filepath="+req.query.filepath,"GET",false,req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts,function(error,response,body){
            statusCode = response.statusCode;
            if(!error && statusCode == 200){
                data = body;
            } else {
                message = 'get raw text error';
                success = false;
            }
            var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
            res.send(formattedResponse);
        });
     }
})
.post(function(req,res,next){

})
.delete(function(req,res,next){
    var statusCode = 200;
    var message = "delete file";
    var data = [];
    var success = true;

    if(req.body['file_path'] == null || req.body['branch_name'] == null || req.body['commit_message'] == null) {
        statusCode = 400;
        message = "bad request";
        success = false;
    }

    if(statusCode == 200) {
        var opts = config.buildOptions("projects/"+req.params.id+"/repository/files","DELETE",false,req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts,function(error,response,body){
            statusCode = response.statusCode;
            if(!error && statusCode == 200){
                data = JSON.parse(body);
            }
            else {
                success = false;
                message = 'delete file Error!';
            }
            
            var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
            res.send(formattedResponse);
        });
    }
    else {
        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    }
});

module.exports = router;