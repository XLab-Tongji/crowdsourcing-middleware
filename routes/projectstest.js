//created by ni on 11/10
//for the route /project
var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var underscore = require('underscore');
var request = require('request');

router.route('/')
    //get project information with member
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = [];
        var message = 'get project info';
        //var privateToken = 'Y6ze4UDoJyyJAJXyW2fD';
        var projectMemberInfo = [];

        var opts = config.buildOptions("projects", "GET", false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = 'Get Projects Error!';
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        });
    })
    //create a project with  current user,project name is required
    .post(function (req, res, next) {
        var statusCode = 201;
        var success = true;
        var data = [];
        var message = 'get project created';
        var formattedResponse;

        if (req.body['name'] == null) {
            statusCode = 400;
            message = 'Project name not specified';
            data = [];
            success = false;

            formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        }

        if (statusCode != 400) {
            var opts = config.buildOptions('projects/', 'POST', false, req.get('PRIVATE-TOKEN'));
            opts.body = JSON.stringify(req.body);

            request(opts, function (error, response, body) {
                statusCode = response.statusCode;
                if (!error && statusCode == 201) {
                    data = JSON.parse(body);
                }
                else {
                    success = false;
                    message = 'Create Projects Error!';
                }
                var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
                res.send(formattedResponse);
            });
        }
    })

router.route('/:id')
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        var message = 'Get Issues List Success';

        var opts = config.buildOptions("/projects/" + req.params.id, "GET", false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;

            if (!error && statusCode == 200) {
                var info = JSON.parse(body);
                data = info;
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
    //update project not implemented yet
    .put(function (req, res, next) {
    })
    //delete project belonging to current user with project id
    .delete(function (req, res, next) {
        var statusCode = 200;
        var message = 'Project deleted!';
        var success = true;
        var data = [];

        var opts = config.buildOptions('projects/' + req.params.id, 'DELETE', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = 'Project not deleted!';
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })

//获取分支详细信息
router.route('/:id/repository/branches')
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        var message = 'Get project braches success';


        var opts = config.buildOptions("/projects/" + req.params.id + "/repository/branches", "GET", false, req.get('PRIVATE-TOKEN'));

        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;

            if (!error && statusCode == 200) {
                var info = JSON.parse(body);
                data = info;
            } else {
                success = false;
                statusCode = 410;
                var errInfo = JSON.parse(body);
                message = errInfo.message;
                console.log('something wrong' + message);
                if (body) data = body;
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })


    })

//获取分支名
router.route('/:id/repository/branches/names')
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        data["name"]=new Array();
        var message = 'Get project braches success';


        var opts = config.buildOptions("/projects/" + req.params.id + "/repository/branches", "GET", false, req.get('PRIVATE-TOKEN'));

        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;

            if (!error && statusCode == 200) {
                var info = JSON.parse(body);
                var dataAll=info;

                for(var i=0;i<dataAll.length;i++){
                    data["name"].push(dataAll[i].name);
                }


            } else {
                success = false;
                statusCode = 410;
                var errInfo = JSON.parse(body);
                message = errInfo.message;
                console.log('something wrong' + message);
                if (body) data = body;
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })

    })




/*新建分支
参数: 新分支名，分支基础名
*/
router.route("/:id/repository/branches/:branchname/:ref")
    .post(function (req, res, next) {
        var statusCode = 201;
        var success = true;
        var data = [];
        var message = 'create branch';
        var formattedResponse;

        var user_branchname=req.params.brachname;

        var opts = config.buildOptions('/projects/'+req.params.id+"/repository/branches?branch_name="+req.params.branchname+"&ref="+req.params.ref,
         'POST', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

       
 request(opts, function (error, response, body) {
           var name = response.name;

            if (name==user_branchname) {
                var info = JSON.parse(body);
                data = info;
            } else {
                success = false;
                statusCode = 410;
                var errInfo = JSON.parse(body);
                message = errInfo.message;
                console.log('something wrong' + message);
                if (body) data = body;
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
        })

module.exports = router;