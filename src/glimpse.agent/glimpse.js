var moduleProxy = require('./inspectors/module-proxy');
var agentBroker = require('./messaging/agent-broker')


module.exports = function() {
    var agent = {
        broker: agentBroker
    };
    
    // setup interceptor
    moduleProxy.init(agent, require('module'));
};