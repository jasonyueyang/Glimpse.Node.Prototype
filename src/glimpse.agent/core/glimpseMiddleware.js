var useragent = require('useragent');
var glimpseMessages = require('./glimpseMessages.js');
var runtime = require('./glimpseRuntime.js');
var uuid = require('node-uuid');
var glimpseSession = require('./glimpseSession.js');

// TODO: Need to do this better 
// var config = require('../configuration.js');
// var reqResTab = require('./tabs/requestResponse.js');
// config.tabs.push(reqResTab);

function glimpseSessionInit(req, res, next) {
    if (!req.glimpse) {

        glimpseSession.init(req, res, function (session) {
            req.glimpse = session;
            
            next();
        });       
    }
    else {
        next();
    }    
}

function glimpseMiddleware(req, res, next) {    

    if (!req.glimpse.middlewareAttached) {
        
        req.glimpse.middlewareAttached = true;

        res.on('finish', function () {
            runtime.endRequest(
                {
                    request: req,
                    response: res
                }, 
                function (err) {
                });       
        });
        
        runtime.beginRequest(
            {
                request: req,
                response: res
            }, 
            function (err) {            
                next();
            });
    }
    else {
        next();
    }
}

module.exports = { glimpseMiddleware, glimpseSessionInit };