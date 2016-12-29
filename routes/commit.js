var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

/* GET Contibutions data */
router.route("/contributors/:id")
    .get(function (req, res, next) {
        var statusCode = 200;
        var success = true;
        var data = {};
        var message = 'Get project contributors List Success';

        var opts = config.buildOptions("/projects/"+ req.params.id+"/repository/contributors", "GET", false, req.get('PRIVATE-TOKEN'));
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
module.exports = router;
