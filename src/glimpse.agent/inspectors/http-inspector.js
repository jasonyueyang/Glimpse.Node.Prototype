'use strict';

var httpHelper = require('./util/http-helper');

var init = (function() {
    var broker = null;
    
    var onBeginRequest = function(req, res) {
        var url = httpHelper.request.parseurl(req);
        
        var data = {
            requestUrl: httpHelper.request.protocol(req) + '://' + httpHelper.request.hostname(req) + req.url,
            requestPath: url.pathname,
            requestQueryString: url.query,
            requestMethod: req.method,
            requestHeaders: req.headers,
            requestContentLength: httpHelper.request.header(req, 'Content-Length'),
            requestContentType: httpHelper.request.header(req, 'Content-Type'),
            requestStartTime: new Date(),
            requestIsAjax: httpHelper.request.header(req, '__glimpse-isAjax') == 'true'
        };
        var indices = { 
            "request-url": data.requestUrl,
            "request-method": data.requestMethod,
            "request-datetime": data.requestStartTime
        }
        var types = ["begin-request"];
        
        broker.sendMessage(data, null, types, indices);
    };

    var onEndRequest = function(req, res) {
        var url = httpHelper.request.parseurl(req);
        
        var data = {
            requestUrl: httpHelper.request.protocol(req) + '://' + httpHelper.request.hostname(req) + req.url,
            requestPath: url.pathname,
            requestQueryString: url.query,
            responseHeaders: res._headers,
            responseContentLength: res.getHeader('Content-Length'),
            responseContentType: res.getHeader('Content-Type'),
            responseStatusCode: res.statusCode,
            responseDuration: null,
            responseEndTime: new Date(),
        };
        if (res.statusCode === 304) {
            // TODO: hack for 304 so the messages show up in Glimpse UI.  This needs to 
            //       get fixed on the UI end without us having to set the content type 
            //       here.  The UI is filtering out "noisy" messages based on teh content 
            //       type, so if we don't set this, then messages don't show up. 
            data.contentType = 'text/html';
        }
        var indices = {
            "request-duration": data.responseDuration,
            "request-content-type": data.responseContentType,
            "request-status-code": data.responseStatusCode
        };
        var types = ["end-request"];
        
        broker.sendMessage(data, null, types, indices);
    };
    
    var setup = function(agent, http) {
        broker = agent.broker;
        
        // proxy `http.createServer`
        var oldCreateServer = http.createServer;
        http.createServer = function(callback) { 
            return oldCreateServer(function(req, res) {
                onBeginRequest(req, res);
                
                callback.apply(this, arguments);
                
                res.on('finish', function() {
                    onEndRequest(req, res);
                });
            });
        };
    };
    
    return function(agent, http) {
        setup(agent, http);
        
        return http;
    }; 
})();


module.exports = {
    init: init
};