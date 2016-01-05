'use strict';

var httpHelper = require('./util/http-helper');
var uuid = require('node-uuid');

var inspector = (function() {
    var broker = null;
    var sessionCookie = '.Glimpse.Session';
    
    var onBeginRequest = function(req, res) {
        var cookies = httpHelper.request.parseCookies(req);
        var userId = cookies ? cookies[sessionCookie] : null;
        if (!userId) {
            httpHelper.response.setCookie(res, sessionCookie, uuid.v4().replace(new RegExp('-', 'g'), ''));
        }
    };

    var onEndRequest = function(req, res) {
        // TODO: need figure out where we are going to get the rest of the user data from
        var cookies = httpHelper.request.parseCookies(req);
        var userId = cookies ? cookies[sessionCookie] : null;
        if (!userId) {
            userId = null; // TODO: should be request id... switch when I get context working
        }
        
        var data = {
            userId: userId,
            username: 'avanderhoorn',
            email: 'avan@gmail.com',
            image: 'https://avatars0.githubusercontent.com/u/585619?v=3&s=40',
            isAnonymous: true
        };
        var indices = {
            'request-userId': data.userId
        };
        var types = ['user-identification'];
        
        broker.sendMessage(data, null, types, indices);
    };
    
    var init = function(agent) {
        broker = agent.broker;
    };
    
    return {
        init: init,
        before: onBeginRequest,
        after: onEndRequest
    }; 
})();

module.exports = inspector;