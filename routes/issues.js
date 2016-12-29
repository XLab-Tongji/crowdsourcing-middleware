var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

router.route("/mine")
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        var message = 'Get Issues List Success';

        var opts = config.buildOptions("todos", "GET", false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                var info = JSON.parse(body);
                data = info;
            }
            else {
                success = false;
                var errInfo = JSON.parse(body);
                message = errInfo.message;
                console.log('something wrong! ' + message);
            }
            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })

/* GET issues listing. */
router.route("/")
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        var message = 'Get Issues List Success';

        var opts = config.buildOptions("issues", "GET", false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                var info = JSON.parse(body);

                //set return data
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

router.route("/project/:id/")
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = [];
        var message = 'get project issues';

        if (statusCode != 400) {
            var opts = config.buildOptions("projects/" + req.params.id + "/issues", "GET", false, req.get('PRIVATE-TOKEN'));
            opts.body = JSON.stringify(req.body);

            request(opts, function (error, response, body) {
                statusCode = response.statusCode;
                if (!error && statusCode == 200) {
                    data = JSON.parse(body);
                } else {
                    success = false;
                    message = 'Get Project Issues Error!';
                }

                var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
                res.send(formattedResponse);
            });
        }
    })
    /* POST . */
    .post(function (req, res, next) {
        var statusCode = 201;
        var success = true;
        var data = [];
        var message = 'get project issue created';
        var formattedResponse;

        if (req.body['title'] == null) {
            statusCode = 400;
            message = 'Issue title not specified';
            data = [];
            success = false;

            formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        }

        if (statusCode != 400) {
            var opts = config.buildOptions('projects/' + req.params.id + '/issues', 'POST', false, req.get('PRIVATE-TOKEN'));
            opts.body = JSON.stringify(req.body);

            request(opts, function (error, response, body) {
                statusCode = response.statusCode;
                if (!error && statusCode == 201) {
                    data = JSON.parse(body);
                }
                else {
                    success = false;
                    message = 'Create Issues Error!';
                }
                var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
                res.send(formattedResponse);
            });
        }
    });

router.route("/project/:id/issueid/:issue_id")
    .get(function (req, res, next) {
        var statusCode = 200;
        var message = 'Get Issue !';
        var success = true;
        var data = [];

        var opts = config.buildOptions('projects/' + req.params.id + '/issues/' + req.params.issue_id, 'GET', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = "Get issue fail";
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })
    .put(function (req, res, next) {
        var statusCode = 200;
        var message = 'Issue updated!';
        var success = true;
        var data = [];

        var query = "";
        // if (req.query.state == "close" || req.query.state == "reopen") {
        //     query = "?state_event=" + req.query.state;
        //     console.log(query);
        // }
        // console.log(req.query.assignee_id);

        if (req.body.assignee_id == undefined) {
            if (req.body.state == "close" || req.body.state == "reopen") {
                query = "?state_event=" + req.body.state;
                console.log(query);
            }
        } else if (req.body.assignee_id != undefined) {
            if (req.body.assignee_id == "null") {
                query = "?assignee_id=null";
                if (req.body.state == "close") {
                    return;
                } else {
                    if (req.body.state == "reopen" || req.body == "open") {
                        query += "&state_event=" + req.body.state;
                    }
                }

            } else if (req.body.assignee_id != "null") {
                query = "?assignee_id=" + req.body.assignee_id;
                if (req.body.state == "close" || req.body.state == "reopen") {
                    query += "&state_event=" + req.body.state;
                    console.log(query);
                }

            }

        }

        // if (req.query.assignee_id != null) {
        //     query = "?assignee_id=" + req.query.assignee_id;
        //     if (req.query.state == "close" || req.query.state == "reopen") {
        //         query += "&state_event=" + req.query.state;

        //     }
        // } else if (req.query.assignee_id == null) {
        //     if (req.query.state == "close" || req.query.state == "reopen") {
        //         query = "?state_event=" + req.query.state;
        //         console.log(query);
        //     }
        // }
        var opts = config.buildOptions('projects/' + req.params.id + '/issues/' + req.params.issue_id + query, 'PUT', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = "Update issue fail";
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })
    .delete(function (req, res, next) {
        var statusCode = 200;
        var message = 'Issue deleted!';
        var success = true;
        var data = [];

        var opts = config.buildOptions('projects/' + req.params.id + '/issues/' + req.params.issue_id, 'DELETE', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = 'Issue not deleted!';
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })

//issue comment function 
router.route("/project/:id/issueid/:issue_id/notes")
    .get(function (req, res, next) {
        var statusCode = 200;
        var message = 'Get Issue comments!';
        var success = true;
        var data = [];
        var dataList = [];

        var opts = config.buildOptions('projects/' + req.params.id + '/issues/' + req.params.issue_id + '/notes', 'GET', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 200) {

                data = JSON.parse(body);

            } else {
                success = false;
                message = "Get issue comments failed";
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })
    })
    .post(function (req, res, next) {
        var statusCode = 200;
        var message = "Add comment Success";
        var success = true;
        var data = [];
        var query;


        if (req.body.body == null) {
            statusCode = 400;
            message = 'issue comment not specified';
            data = [];
            success = false;

            formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);

        } else {
            query = req.body.body;
        }
        var opts = config.buildOptions('projects/' + req.params.id + '/issues/' + req.params.issue_id + '/notes?body=' + query, 'POST', false, req.get('PRIVATE-TOKEN'));
        opts.body = JSON.stringify(req.body);

        request(opts, function (error, response, body) {
            statusCode = response.statusCode;
            if (!error && statusCode == 201) {
                data = JSON.parse(body);
            } else {
                success = false;
                message = "Update issue comment failed";
            }

            var formattedResponse = apiformat.formatResponse(statusCode, message, data, success);
            res.send(formattedResponse);
        })


    })









module.exports = router;
