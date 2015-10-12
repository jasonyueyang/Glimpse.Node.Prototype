var http = require('http');
var uuid = require('node-uuid');
var util = require('util');

var getNextOrdinal = (function () {
    var i = 0;

    return function () {
        return ++i;
    };
})();

function createMessage(data, indices, types, context) {
    var message = {};
    message.id = uuid.v4();
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

    var data = { url: requestData.url };
    var indices = { "request-url": requestData.url }
    var types = ["begin-request-message"];
    var message = createMessage(data, indices, types, context);
    return message;
}

function endRequestMessage(context, requestData) {
    var duration = requestData.endTime.getTime() - requestData.startTime.getTime();

    var data = {
        duration: duration,
        startTime: requestData.startTime,
        endTime: requestData.endTime,
        url: requestData.url,
        method: requestData.method,
        contentType: requestData.contentType,
        statusCode: requestData.statusCode
    };

    var indices = {
        "request-duration": duration,
        "request-datetime": requestData.startTime,
        "request-url": requestData.url,
        "request-method": requestData.Method,
        "request-content-type": requestData.contentType,
        "request-status-code": requestData.statusCode
    };

    var types = ["end-request-message"];


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

        var str = '';
        var callback = function (response) {

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log("GlimpseAgent:  end:  " + str);
            });
        }

        var options = {
            host: 'localhost',
            path: '/glimpse/AgentMessage',
            port: 5000,
            method: 'POST'
        };

        var req = http.request(options, callback);

        var json = JSON.stringify(messages);

        req.write(json);
        req.end();
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