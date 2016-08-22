var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');

//data structure for API format
var statusCode = 200;
var success = true;
var data = {};
var message = 'get projects info success';

//tmp data list
var tmpProjectInfoList = [];
var tmpProjectMemberList = [];
var returnDataList = [];

var func1 = function(req,res,next){
  tmpProjectInfoList = [];
  tmpProjectMemberList = [];
  returnDataList = [];

  console.log('func1');
  var opts_pro_info = config.buildOptions("projects", "GET", true);
  opts_pro_info.body = JSON.stringify(req.body);

  request(opts_pro_info, function (error, response, body) {
    statusCode = response.statusCode;
    if (!error && statusCode==200) {
      var info = JSON.parse(body);
      tmpProjectInfoList = info;
      // console.log(tmpProjectInfoList);
    }
    else {
      success = false;
      console.log('something wrong!');
      message = 'get projects list wrong!';
      if(body) data['projectsListErrorMessage'] = body;
    }
    next();
  })
}
var func2 = function(req,res,next){
  console.log('func2');
  tmpProjectMemberList = [];
  console.log(tmpProjectInfoList.length);
  for(var i=0; i<tmpProjectInfoList.length; i++){
    console.log(tmpProjectInfoList[i]['name']);

    // set data for return project info
    var projectInfo = {};
    projectInfo['id'] = tmpProjectInfoList[i]['id'];
    projectInfo['name'] = tmpProjectInfoList[i]['name'];
    projectInfo['description'] = tmpProjectInfoList[i]['description'];
    projectInfo['public'] = tmpProjectInfoList[i]['public'];
    projectInfo['owner'] = tmpProjectInfoList[i]['owner'];
    projectInfo['created_at'] = tmpProjectInfoList[i]['created_at'];
    projectInfo['avatar_url'] = tmpProjectInfoList[i]['avatar_url'];
    projectInfo['permissions'] = tmpProjectInfoList[i]['permissions'];

    // if(tmpProjectInfoList[i]['id']==2){
    // req.params = {
    //   "id" : tmpProjectInfoList[i]['id']
    // }
    // console.log(req.params.id);
    console.log(tmpProjectInfoList[i]['id']);
    var opts_pro_mem = config.buildOptions("projects/"+ tmpProjectInfoList[i]['id'] +"/members", "GET", true);
    opts_pro_mem.body = JSON.stringify(req.body); 
    // opts_pro_mem.id = tmpProjectInfoList[i]['id'];

    // console.log(opts_pro_mem);
    request(opts_pro_mem, function (error, response, body) {
      console.log("beforei:"+i);
      statusCode = response.statusCode;
      if (!error && statusCode==200) {
        var info = JSON.parse(body);
        tmpProjectMemberList = info;
        projectInfo['members'] = tmpProjectMemberList;
        returnDataList.push(projectInfo);
        console.log(returnDataList);
      }
      else {
        success = false;
        console.log('something wrong!');
        message = 'get projects members wrong!';
        console.log(message);
        if(body) data['projectsMembersErrorMessage'] = body;
      }
      if(i == (tmpProjectInfoList.length-1)){
        console.log("i:"+i);
        next();
      }
    })
  // }
  }
  // next();
}
var func3 = function(req,res){
  console.log('func3');
  // data = returnDataList;

  var formattedResponse = apiformat.formatResponse(statusCode,message,returnDataList,success);
  res.send(formattedResponse);
}

/* GET project Info. */
router.get('/', [func1,func2,func3]);

module.exports = router;
