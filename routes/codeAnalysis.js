var express = require('express');
var router = express.Router();
var config = require('../util/codeAnalysis');
var apiformat = require('../apiformat');
var request = require('request');

router.get('/',function(req,res,next){
    res.send("hello world");
});
router.post('/', function(req, res, next) {
    var statusCode = 200;
    var success = true;
    var data = [];
    var message = 'Code analysis';

    var opts = config.buildOptions("/SwQualityAssesment/api/task", "POST");
    opts.body = JSON.stringify(req.body);
    request(opts, function (error, response, body) { 
        statusCode = response.statusCode;
        if (!error && statusCode==200) {
            var info = JSON.parse(body);
            data = info;
        }
        else {
            success = false;
            var errInfo = JSON.parse(body);
            message = errInfo.message;
        } 

        var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
        res.send(formattedResponse);
    })
    // res.send("hello world2");
});

module.exports = router;
