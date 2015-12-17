var uuid = require('node-uuid');
var request = require('request');
var util = require('util');

var glimpseMetadata = require('./glimpseMetadata');

var getNextOrdinal = (function () {
    var i = 0;

    return function () {
        return ++i;
    };
})();

function createMessage(data, indices, types, context) {
    var message = {};
    // strip dashes out of the guid (cause that's what glimpse server and client expects)
    message.id = uuid.v4().replace(new RegExp('-', 'g'), '');
    message.context = context;
    message.ordinal = getNextOrdinal();
    message.types = types;
    message.indices = indices;
    
    var payloadObject = {
        id: message.id,
        payload: data,
        ordinal: message.ordinal,
        context: message.context,
        types: types
    };
    
    message.payload = JSON.stringify(payloadObject);

    return message;
}

function beginRequestMessage(context, requestData) {

    var data = 
    { 
        requestUrl: requestData.url,
        requestContentLength: requestData.contentLength,
        requestContentType: requestData.contentType,
        requestHeaders: requestData.headers,
        requestIsAjax: requestData.isAjax,
        requestMethod: requestData.method,
        requestPath: requestData.path,
        requestQueryString: requestData.queryString,
        requestStartTime: requestData.startTime
     };
    var indices = { "request-url": requestData.url }
    var types = ["begin-request"];
    var message = createMessage(data, indices, types, context);
    return message;
}

function endRequestMessage(context, requestData) {
    var duration = requestData.endTime.getTime() - requestData.startTime.getTime();

    var data = {
        requestUrl: requestData.url,
        requestPath: requestData.path, 
        requestQueryString: requestData.queryString, 
        responseContentLength: requestData.contentLength,
        responseContentType: requestData.contentType,
        responseStatusCode: requestData.statusCode,
        responseHeaders: requestData.headers,
        responseDuration:duration,
        responseEndTime:requestData.endTime        
    };

    var indices = {
        "request-duration": duration,
        "request-datetime": requestData.startTime,
        "request-url": requestData.url,
        "request-method": requestData.Method,
        "request-content-type": requestData.contentType,
        "request-status-code": requestData.statusCode
    };

    var types = ["end-request"];


    var message = createMessage(data, indices, types, context);
    return message;
}

function userIDMessage(context, userId, userName, email, image) {

    var data = {
        userId: userId,
        username: userName,
        email: email,
        image: image
    };

    var types = ["user-identification"];
    var indices = {};

    var message = createMessage(data, indices, types, context);
    return message;
}

function actionRouteMessage(context, action, route) {
    var data = {
        actionId: action.id,
        actionName: action.name,
        actionDisplayName: action.displayName,
        actionControllerName: action.controllerName,
        routeName: route.name,
        routePattern: route.pattern,
        routeData: route.data,
    };
        
    var types = ['action-route'];
    var indices = {};
    var message = createMessage(data, indices, types, context);
    return message;
}


function GlimpseAgent() {
    var that = this;

    that.send = function (messages) {

        // convert a single message into an array of messages
        if (!util.isArray(messages)) {
            messages = [messages];
        }

        glimpseMetadata.getMetadataForResource('message-ingress', function(err, metadata) {
            if (err) return err;
            
            var options = 
            {
                uri: metadata,
                method: 'POST',
                json: true,
                body: messages
            };

            request(options, function(err, res) {
                console.log('GlimpseAgent:  end: ' + res.statusMessage);                
            });            
        });
    }
}


var glimpseMessages = {
    GlimpseAgent: GlimpseAgent,
    beginRequestMessage: beginRequestMessage,
    endRequestMessage: endRequestMessage,
    userIDMessage: userIDMessage,
    actionRouteMessage: actionRouteMessage
};

module.exports = glimpseMessages;