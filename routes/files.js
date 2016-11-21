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
        success = false;
        res.send(apiformat.formatResponse(statusCode,message,data,success));
     }

     if(statusCode != 400) {
        var opts = config.buildOptions("projects/"+req.params.id+"/repository/tree?path="+req.query.path,"GET",false,req.get('PRIVATE-TOKEN'));
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
})



module.exports = router;