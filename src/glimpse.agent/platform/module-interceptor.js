var Module = require('module');

var proxyProvider = (function() {
    var interceptions = {};
    
    var init = function(agent) {
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
    var regsiter = function(id, interceptFunc) {
        interceptions[id] = interceptFunc;
    };
    
    return {
        init: init,
        regsiter: regsiter
    }
})();

module.exports = proxyProvider;
