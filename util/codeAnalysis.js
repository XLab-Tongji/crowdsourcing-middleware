var buildOptions = function (urlPartition,method) {
    var options = {
        url: "http://115.159.126.118:7887" + urlPartition,
        method : method,
        headers: {
            'User-Agent': 'request',
            'content-type': 'application/json'
        }
    };
    return options;
},
    config = {
        baseUrl: "http://115.159.126.118:7887",
        buildOptions: buildOptions
    }

module.exports = config; 