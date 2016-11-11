
var buildOptions = function (urlPartition,method, needRootPrivateToken,privateToken) {
    var options = {
        url: "http://115.159.55.131/api/v3/" + urlPartition,
        method : method,
        headers: {
            'User-Agent': 'request',
            'content-type': 'application/json'
        }
    };
    if(needRootPrivateToken){
        options.headers['PRIVATE-TOKEN'] = config.private_token;
    }else if(privateToken){
        options.headers['PRIVATE-TOKEN'] = privateToken;
    }
    return options;
},
    config = {
        baseUrl: "http://115.159.55.131/api/v3/",
        private_token: "mC9BJod4SaoLb_ZkLQrG", //just for testing
        buildOptions: buildOptions
    }

module.exports = config; 