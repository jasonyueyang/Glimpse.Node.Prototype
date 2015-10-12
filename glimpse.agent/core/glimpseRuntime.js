// configuration = require('./configuration.js');
// tabProvider = require('./framework/tabProvider.js');
// scriptInjector = require('./framework/scriptInjector.js');
var glimpseSession = require('./glimpseSession.js');
var glimpseMessages = require('./glimpseMessages.js');
var uuid = require('node-uuid');

var beginRequest = function(requestData, callback) {

        var glimpseAgent = new glimpseMessages.GlimpseAgent();

        // TODO - correctly create the user ID message
        var context = glimpseSession.getContext();
        var messageData = {
          url: requestData.request.originalUrl  
        };
        var userIdMesage = glimpseMessages.userIDMessage(context, uuid.v4(), "5414", null, "https://www.gravatar.com/avatar/D5F856634208232580DC59FC18E0414E.jpg?d=identicon");
        var beginRequestMessage = glimpseMessages.beginRequestMessage(context, messageData);
        glimpseAgent.send([beginRequestMessage, userIdMesage]);

        //TODO: Run `BeginRequest` policies

        callback();
    },
    
    endRequest = function(requestData, callback) {
        var glimpseAgent = new glimpseMessages.GlimpseAgent();
        var context = glimpseSession.getContext();
        var messageData = {
          url: requestData.request.originalUrl,
          startTime: glimpseSession.getStartTime(),
          endTime: new Date(),
          method: requestData.request.method,
          contentType: requestData.response["Content-Type"], 
          statusCode: requestData.response.statusCode 
        };
        
        var message = glimpseMessages.endRequestMessage(context, messageData);
        glimpseAgent.send(message);

        callback();
     },
     
     injectScript = function(context, callback) {
//         console.log('GLIMPSE - RUNTIME - Inject Script');
// 
//         scriptInjector.execute(context);
// 
//         callback(null, { data: context.data });
    },
    
    dispatchRoute = function(action, route) {
        
        var context = glimpseSession.getContext();        
        var message = glimpseMessages.actionRouteMessage(context, action, route);
        var glimpseAgent = new glimpseMessages.GlimpseAgent();
        glimpseAgent.send(message);
    };

module.exports = {
    beginRequest: beginRequest,
    endRequest: endRequest,
    injectScript: injectScript,
    dispatchRoute: dispatchRoute
};
