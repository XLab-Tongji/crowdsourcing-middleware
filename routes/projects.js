// created by xietiandi
// date: 2016/8/23

var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');
var async = require('async');
var underscore = require('underscore'); //a module to operate json, map, list and so on......
var project_role_config = require('../util/project.role');

//data structure for API format
var statusCode = 200;
var success = true;
var data = [];
var message = 'get projects info success';

var initResponseData = function(){
  statusCode = 200;
  success = true;
  data = [];
  message = 'get info success';
}

//tmp data list
var tmpProjectInfoList = [];
var tmpProjectMemberList = [];
var returnDataList = [];

//get members from a specific project by project_id
var getProjectMember = function(req, res, project_id, callback){
  // customed memberInfo structure
  var projectMemberInfo = {};
  projectMemberInfo['id'] = project_id;

  var opts_pro_mem = config.buildOptions("projects/"+ project_id +"/members", "GET", false, req.get('PRIVATE-TOKEN'));
  opts_pro_mem.body = JSON.stringify(req.body); 

  console.log(opts_pro_mem);
  request(opts_pro_mem, function (error, response, body) {
    var memberStatusCode = response.statusCode;
    if (!error && memberStatusCode==200) {
      statusCode = 200;
      var info = JSON.parse(body);
      underscore.extend(projectMemberInfo,{'members': info})
      // projectMemberInfo['members'] = info;
    }
    else {
      success = false;
      statusCode = 410;
      message = 'Get Members Error!';
      if(body) projectMemberInfo['projectsMemberErrorMessage'] = body;
      data.push(projectMemberInfo);
    }
    tmpProjectMemberList.push(projectMemberInfo);

    //this function is to wait until all requests get response(async module).
    if(callback) callback(null,projectMemberInfo);
  })
}

//return getProjectMemberFunc function for later useage,
//function 'callback' is to use async module. 
var getProjectMemberFunc = function(req,res,project_id){
  return function(callback){
    getProjectMember(req,res,project_id,callback);
  }
}


var func1 = function(req,res,next){
  tmpProjectInfoList = [];
  tmpProjectMemberList = [];
  returnDataList = [];
  initResponseData();

  console.log('func1');
  var opts_pro_info = config.buildOptions("projects", "GET", false, req.get('PRIVATE-TOKEN'));
  opts_pro_info.body = JSON.stringify(req.body);

  request(opts_pro_info, function (error, response, body) {
    statusCode = response.statusCode;
    console.log(statusCode);
    console.log(body);
    if (!error && statusCode==200) {
      var info = JSON.parse(body);
      for(var i=0; i<info.length; i++){
        var projectInfo = underscore.pick(info[i],'id','name','description','public','owner','created_at','avatar_url','permissions');
        tmpProjectInfoList.push(projectInfo);
      }
    }
    else {
      success = false;
      statusCode = 409
      console.log('something wrong!');
      message = 'Get Projects List Error!';
      if(body) data.push({'projectsListErrorMessage':body});
    }
    next();
  })
}

var func2 = function(req,res,next){
  if(!success) {
    next();
    return;
  }

  console.log('func2');
  tmpProjectMemberList = [];

  var memberFuncList = [];
  for(var i=0; i<tmpProjectInfoList.length; i++){
    console.log(' now  i = '+i+'id = '+tmpProjectInfoList[i]['id']);
    memberFuncList.push(getProjectMemberFunc(req,res,tmpProjectInfoList[i]['id']));
  }

  async.parallel(memberFuncList,
  function(err, results) {
      console.log(results);
      next();
  });
}

var func3 = function(req,res){
  if(!success) {
    var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
    res.send(formattedResponse);
    return;
  }
  console.log('func3');

  // set data values
  for(var i=0; i<tmpProjectInfoList.length; i++){
    for(var j=0; j<tmpProjectMemberList.length; j++){
      if( tmpProjectInfoList[i]['id'] == tmpProjectMemberList[j]['id']){
        data.push(underscore.extend({},tmpProjectInfoList[i],{members:tmpProjectMemberList[j]['members']}));
      }
    }
  }

  var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
  res.send(formattedResponse);
}

/* GET project Info. */
router.get('/projects', [func1,func2,func3]);

var tmpRootUserList = [];

//get root user info by user id
var getRootUserInfo = function(req, res, user_id, callback){
  // customed memberInfo structure
  var rootUserInfo = {};
  // rootUserInfo['id'] = user_id;

  var opts_pro_mem = config.buildOptions("users/"+ user_id, "GET", true);
  opts_pro_mem.body = JSON.stringify(req.body); 

  console.log(opts_pro_mem);
  request(opts_pro_mem, function (error, response, body) {
    var userStatusCode = response.statusCode;
    if (!error && userStatusCode==200) {
      statusCode = 200;
      var info = JSON.parse(body);
      rootUserInfo = info;
      // underscore.extend(rootUserInfo,{'info': info})
    }
    else {
      success = false;
      statusCode = 410;
      message = 'Get Users Error!';
      if(body) rootUserInfo['rootUserInfoErrorMessage'] = body;
      data.push(rootUserInfo);
    }
    tmpRootUserList.push(rootUserInfo);

    //this function is to wait until all requests get response(async module).
    if(callback) callback(null,rootUserInfo);
  })
}

var getRootUserInfoFunc = function(req,res,user_id){
  return function(callback){
    getRootUserInfo(req,res,user_id,callback);
  }
}

var memberFunc1 = function(req,res,next){
  tmpProjectMemberList = [];
  initResponseData();

  async.parallel([function(callback){
    getProjectMember(req,res,req.params.id,callback);
  }],
  function(err, results) {
      console.log(results);
      // if(success) data = tmpProjectMemberList;
      // var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
      // res.send(formattedResponse);
      next();    
  });
}

var memberFunc2 = function(req,res,next){
  if(!success) {
    next();
    return;
  }
  // var formattedResponse = apiformat.formatResponse(statusCode,message,tmpProjectMemberList,success);
  // res.send(formattedResponse);
  tmpProjectMemberList = tmpProjectMemberList[0]['members'];
  console.log(tmpProjectMemberList);

  tmpRootUserList=[];
  var userFuncList = [];
  for(var i=0; i<tmpProjectMemberList.length; i++){
    console.log(' now  i = '+i+'id = '+tmpProjectMemberList[i]['id']);
    userFuncList.push(getRootUserInfoFunc(req,res,tmpProjectMemberList[i]['id']));
  }

  async.parallel(userFuncList,
  function(err, results) {
      console.log(results);
      next();
  });

}
var memberFunc3 = function(req,res){
  if(!success) {
    var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
    res.send(formattedResponse);
    return;
  }

  // set data values
  console.log(tmpProjectMemberList.length);
  console.log(tmpRootUserList.length);
  for(var i=0; i<tmpProjectMemberList.length; i++){
    for(var j=0; j<tmpRootUserList.length; j++){
      if( tmpProjectMemberList[i]['id'] == tmpRootUserList[j]['id']){
        console.log(tmpRootUserList[j]['email']);
        var finalInfo = underscore.extend({},tmpProjectMemberList[i],{email:tmpRootUserList[j]['email']});
        underscore.extend(finalInfo,{role: project_role_config.getRoleByCode(finalInfo['access_level'])}); 
        data.push(finalInfo);
      }
    }
  }

  var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
  res.send(formattedResponse);
}
// /* GET project Member Info. */
router.get('/:id/members', [memberFunc1,memberFunc2,memberFunc3]);

/* GET issues listing. */
router.get('/:id/issues', function (req, res, next) {
  var statusCode = 200;
  var success = true;
  var data = {};
  var message = 'Get Issues List Success';

  var opts = config.buildOptions("/projects/"+ req.params.id +"/issues", "GET", false, req.get('PRIVATE-TOKEN'));
  opts.body = JSON.stringify(req.body);

  request(opts, function (error, response, body) {
    statusCode = response.statusCode;
    if (!error && statusCode==200) {
      var info = JSON.parse(body);

      //set return data
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
});
module.exports = router;
