'use strict';

var interceptorKeys = [
    'request'
];

var proxy = (function() {
    var agent = null;
    var interceptors = [];
    
    var requestEvent = function(key, req, res) {
        for (var i = 0; i < interceptors.length; i++) {
            interceptors[i][key](req, res);
        }
    };
    
    var setupProxy = function(http) {
        var oldCreateServer = http.createServer;
        http.createServer = function(callback) { 
            return oldCreateServer(function(req, res) {
                requestEvent('before', req, res);
                
                callback.apply(this, arguments);
                
                res.on('finish', function() {
                    requestEvent('after', req, res);
                });
            });
        };
    };
    var setupInspectors = function() {
        for (var i = 0; i < interceptorKeys.length; i++) {
            var inspector = require('./' + interceptorKeys[i] + '-inspector');
            
            inspector.init(agent);
            
            interceptors.push(inspector);
        }
    };
    
    var init = function(ctx, http) {
        agent = ctx;
        
        setupProxy(http);
        setupInspectors();
        
        return http;
    };
    
    return {
        init: init
    }; 
})();

module.exports = proxy;