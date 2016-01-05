'use strict';

var inspectors = [
    'http',
    'express'
];

var proxyProvider = (function() {
    var interceptions = {};
    
    var setupProxy = function(agent, Module) {
        var moduleRequire = Module.prototype.require;
        
        var glimpseRequire = function(id) {
            // TODO: check the usage of `this` in this context 
            var res = moduleRequire.call(this, id);

            if (interceptions[id]) {
                if (!interceptions[id].cache) {
                    interceptions[id].cache = interceptions[id](agent, res);
                }
                res = interceptions[id].cache;
            }

            return res;
        }
        
        Module.prototype.require = glimpseRequire;
    };
    
    var setupProxies = function() {
        for (var inspectorIndex in inspectors) {
            var inspectorKey = inspectors[inspectorIndex];
            interceptions[inspectorKey] = require('./' + inspectorKey + '-proxy').init;
        }
    };
    
    var init = function(agent, Module) {
        setupProxy(agent, Module);
        setupProxies();
    };
    
    return {
        init: init
    }
})();

module.exports = proxyProvider;
