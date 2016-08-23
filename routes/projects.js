// created by xietiandi
// date: 2016/8/23

var express = require('express');
var router = express.Router();
var config = require('../config');
var apiformat = require('../apiformat');
var request = require('request');
var async = require('async');
var underscore = require('underscore'); //a module to operate json, map, list and so on......

//data structure for API format
var statusCode = 200;
var success = true;
var data = [];
var message = 'get projects info success';

//tmp data list
var tmpProjectInfoList = [];
var tmpProjectMemberList = [];
var returnDataList = [];

//get members from a specific project by project_id
var getProjectMember = function(req, res, project_id, callback){
  // customed memberInfo structure
  var projectMemberInfo = {};
  projectMemberInfo['id'] = project_id;

  var opts_pro_mem = config.buildOptions("projects/"+ project_id +"/members", "GET", true);
  opts_pro_mem.body = JSON.stringify(req.body); 

  console.log(opts_pro_mem);
  request(opts_pro_mem, function (error, response, body) {
    statusCode = response.statusCode;
    if (!error && statusCode==200) {
      var info = JSON.parse(body);
      underscore.extend(projectMemberInfo,{'members': info})
      // projectMemberInfo['members'] = info;
    }
    else {
      projectMemberInfo['members'] = 'Get Members Error!';
    }
    tmpProjectMemberList.push(projectMemberInfo);

    //this function is to wait until all requests get response(async module).
    callback(null,projectMemberInfo);
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

  console.log('func1');
  var opts_pro_info = config.buildOptions("projects", "GET", true);
  opts_pro_info.body = JSON.stringify(req.body);

  request(opts_pro_info, function (error, response, body) {
    statusCode = response.statusCode;
    if (!error && statusCode==200) {
      var info = JSON.parse(body);
      for(var i=0; i<info.length; i++){
        var projectInfo = underscore.pick(info[i],'id','name','description','public','owner','created_at','avatar_url','permissions');
        tmpProjectInfoList.push(projectInfo);
      }
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
  // console.log('project list length:  '+ tmpProjectInfoList.length);

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
  console.log('func3');

  // set data values
  for(var i=0; i<tmpProjectInfoList.length; i++){
    for(var j=0; j<tmpProjectMemberList.length; j++){
      if( tmpProjectInfoList[i]['id'] == tmpProjectMemberList[j]['id']){
        data.push(underscore.extend({},tmpProjectInfoList[i],{members:tmpProjectMemberList[j]['members']}));
      }
    }
  }

  console.log(data);
  var formattedResponse = apiformat.formatResponse(statusCode,message,data,success);
  res.send(formattedResponse);
}

/* GET project Info. */
router.get('/', [func1,func2,func3]);


module.exports = router;




// for(var i=0; i<tmpProjectInfoList.length; i++){
  //   console.log(tmpProjectInfoList[i]['name']);

  //   // set data for return project info
  //   var projectInfo = {};
  //   projectInfo['id'] = tmpProjectInfoList[i]['id'];
  //   projectInfo['name'] = tmpProjectInfoList[i]['name'];
  //   projectInfo['description'] = tmpProjectInfoList[i]['description'];
  //   projectInfo['public'] = tmpProjectInfoList[i]['public'];
  //   projectInfo['owner'] = tmpProjectInfoList[i]['owner'];
  //   projectInfo['created_at'] = tmpProjectInfoList[i]['created_at'];
  //   projectInfo['avatar_url'] = tmpProjectInfoList[i]['avatar_url'];
  //   projectInfo['permissions'] = tmpProjectInfoList[i]['permissions'];

    // if(tmpProjectInfoList[i]['id']==2){
    // req.params = {
    //   "id" : tmpProjectInfoList[i]['id']
    // }
    // console.log(req.params.id);
  //   console.log(tmpProjectInfoList[i]['id']);
  //   var opts_pro_mem = config.buildOptions("projects/"+ tmpProjectInfoList[i]['id'] +"/members", "GET", true);
  //   opts_pro_mem.body = JSON.stringify(req.body); 
  //   // opts_pro_mem.id = tmpProjectInfoList[i]['id'];

  //   // console.log(opts_pro_mem);
  //   request(opts_pro_mem, function (error, response, body) {
  //     console.log("beforei:"+i);
  //     statusCode = response.statusCode;
  //     if (!error && statusCode==200) {
  //       var info = JSON.parse(body);
  //       tmpProjectMemberList = info;
  //       projectInfo['members'] = tmpProjectMemberList;
  //       returnDataList.push(projectInfo);
  //       console.log(returnDataList);
  //     }
  //     else {
  //       success = false;
  //       console.log('something wrong!');
  //       message = 'get projects members wrong!';
  //       console.log(message);
  //       if(body) data['projectsMembersErrorMessage'] = body;
  //     }
  //     if(i == (tmpProjectInfoList.length-1)){
  //       console.log("i:"+i);
  //       next();
  //     }
  //   })
  // // }
  // }
  // next();