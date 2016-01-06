var glimpseSession = require('./glimpseSession.js');
var glimpseMessages = require('./glimpseMessages.js');
var glimpseOptions = require('./glimpseOptions.js');
var uuid = require('node-uuid');
var util = require('util');


var beginRequest = function (requestData, callback) {

    var glimpseAgent = new glimpseMessages.GlimpseAgent();

    // TODO - correctly create the user ID message
    var context = requestData.request.glimpse.context;
    var messageData = {
        url: requestData.request.originalUrl,
        contentLength: null,
        contentType: null,
        headers: requestData.request.headers,
        isAjax: false, // TODO
        method: requestData.request.method,
        path: requestData.request.path,
        queryString: requestData.request.originalUrl.substring(requestData.request.path.length),
        startTime: requestData.request.glimpse.startTime
    };

    if (requestData.request.Method == 'POST') {
        messageData.contentLength = 1;  // TODO
        messageData.contentType = 'application/json'; // TODO    
    }

    var userIdMesage = glimpseMessages.userIDMessage(context, uuid.v4(), "5414", null, "https://www.gravatar.com/avatar/D5F856634208232580DC59FC18E0414E.jpg?d=identicon");
    var beginRequestMessage = glimpseMessages.beginRequestMessage(context, messageData);
    glimpseAgent.send([beginRequestMessage, userIdMesage]);

    // strip out headers that will cause a 304 not modified response to be sent.
    if (requestData.request.get('if-match')) {
        requestData.request.headers['if-match'] = undefined
    }
    if (requestData.request.get('if-none-match')) {
        requestData.request.headers['if-none-match'] = undefined
    }
    if (requestData.request.get('if-modified-since')) {
        requestData.request.headers['if-modified-since'] = undefined
    }

    callback();
},

    endRequest = function (requestData, callback) {
        callback();

        var glimpseAgent = new glimpseMessages.GlimpseAgent();
        var context = requestData.request.glimpse.context;
        var messageData = {
            url: requestData.request.originalUrl,
            path: requestData.request.path,
            queryString: requestData.request.originalUrl.substring(requestData.request.path.length),
            startTime: requestData.request.glimpse.startTime,
            endTime: new Date(),
            method: requestData.request.method,
            contentLength: null,
            contentType: null,
            statusCode: requestData.response.statusCode,
            headers: requestData.response._headers,
        };

        // set content length if available
        if (requestData.response._headers && requestData.response._headers['content-length']) {
            messageData.contentLength = requestData.response._headers['content-length'];
        }

        // set content type if available
        if (requestData.response._headers && requestData.response._headers['content-type']) {
            messageData.contentType = requestData.response._headers['content-type'];
        }
        else if (requestData.response.statusCode === 304) {
            // hack for 304 so the messages show up in Glimpse UI.  This needs to get fixed on the UI end without us having
            // to set the content type here.  The UI is filtering out "noisy" messages based on teh content type, so if 
            // we don't set this, then messages don't show up. 
            messageData.contentType = 'text/html';
        }

        var message = glimpseMessages.endRequestMessage(context, messageData);
        glimpseAgent.send(message);

    },

     injectScript = function (htmlbody, payload) {
         if (typeof htmlbody === 'string') {
             payload = payload || '';
             htmlbody = htmlbody.replace(/<\/body>/, payload + '</body>');
         }
         return htmlbody;
     },

    dispatchRoute = function (session, action, route) {

        var message = glimpseMessages.actionRouteMessage(session.context, action, route);
        var glimpseAgent = new glimpseMessages.GlimpseAgent();
        glimpseAgent.send(message);
    },

    getHUDScriptTags = function (requestData) {

        var payload = null;
        var context = requestData.context;
        if (context) {
            var hudFormat = '\r\n' +
            '<script src="%s/glimpse/hud/hud.js?hash=%s" ' +
            'id="__glimpse_hud" ' +
            'data-request-id="%s" ' +
            'data-client-template="%s/glimpse/client/index.html?hash=%s{&requestId,follow,metadataUri}" ' +
            'data-context-template="%s/glimpse/context/?contextId={contextId}{&types}" ' +
            'data-metadata-template="%s/glimpse/metadata/?hash=%s" ' +
            'async>' +
            '\r\n' +
            '</script>';
            var agentFormat = '\r\n' +
            '<script src="%s/glimpse/agent/agent.js?hash=%s" ' +
            'id="__glimpse_browser_agent" ' +
            'data-request-id="%s" ' +
            'data-message-ingress-template="%s/glimpse/message-ingress/" async> ' +
            '\r\n' +
            '</script>\r\n';

            var hash = '7f52ba69'; // TODO:  what is hash?
            var baseUri = glimpseOptions.baseUri();
            payload = util.format(hudFormat, baseUri, hash, context.id, baseUri, hash, baseUri, baseUri, hash);
            payload = payload + util.format(agentFormat, baseUri, hash, context.id, baseUri);
        }

        return payload;
    }

module.exports = {
    beginRequest: beginRequest,
    endRequest: endRequest,
    injectScript: injectScript,
    dispatchRoute: dispatchRoute,
    getHUDScriptTags: getHUDScriptTags
};
