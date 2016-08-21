
var buildOptions = function (urlPartition,method,withPrivateToken) {
    var options = {
        url: "http://10.60.38.188:3000/api/v3/" + urlPartition,
        method : method,
        headers: {
            'User-Agent': 'request',
            'content-type': 'application/json'
        }
    };
    if(withPrivateToken){
        options.headers['PRIVATE-TOKEN'] = config.private_tocken;
    }
    return options;
},
    config = {
        baseUrl: "http://10.60.38.188:3000/api/v3",
        private_tocken: "mC9BJod4SaoLb_ZkLQrG", //just for testing
        buildOptions: buildOptions
    }

module.exports = config; 