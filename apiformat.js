var formatResponse = function (statusCode, message, data, isSuccess) {
    var response = {
        code: statusCode,
        message : message,
        data : data,
        success : isSuccess
    };
    return response;
},
    apiformat = {
        // formattedResponse{
        //     code: 200,
        //     message : 'init message',
        //     data : {},
        //     success : true
        // },
        formatResponse : formatResponse
    }

module.exports = apiformat; 