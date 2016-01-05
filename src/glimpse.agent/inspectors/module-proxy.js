'use strict';

var proxyProvider = (function() {
    var interceptions = {};
    
    var regsiter = function(id, interceptFunc) {
        interceptions[id] = interceptFunc;
    };
    
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
    
    var init = function(agent, Module) {
        setupProxy(agent, Module);
    };
    
    return {
        init: init,
        regsiter: regsiter
    }
})();

module.exports = proxyProvider;
