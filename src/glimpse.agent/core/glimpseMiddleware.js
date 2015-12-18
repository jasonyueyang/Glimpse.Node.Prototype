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
    glimpseSession.init(next);
}

function glimpseMiddleware(req, res, next) {    

    res.end = bindResponseEnd(req, res);

    runtime.beginRequest({
        request: req,
        response: res
    }, function (err) {
        if (err) {
            // TODO, hopefully this doesn't break
            // but we should still call next if it does
        }
        
        next();
    });
}

function bindResponseEnd(req, res) {
    var resEnd = res.end;
    function glimpseResEnd(data, encoding, callback) {
        var that = this;
        //var endArgs = Array.prototype.slice.call(arguments, 2);

        runtime.endRequest({
            request: req,
            response: res
        }, function (err) {
            if (err) {
                // TODO, hopefully this doesn't break
                // but we should still call next if it does
            }
            
            resEnd.call(that, data, encoding, callback);
        });
    }

    return glimpseResEnd;
}

module.exports = { glimpseMiddleware, glimpseSessionInit };