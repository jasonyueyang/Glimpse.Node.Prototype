var moduleProxy = require('./inspectors/module-proxy');
var agentBroker = require('./messaging/agent-broker')

var inspectors = [
    'http'
];

module.exports = function() {
    var agent = {
        broker: agentBroker
    };
    
    // setup interceptor
    moduleProxy.init(agent, require('module'));
    
    // register interceptor
    for (var inspectorIndex in inspectors) {
        var inspectorKey = inspectors[inspectorIndex];
        moduleProxy.regsiter(inspectorKey, require('./inspectors/' + inspectorKey + '-proxy').init)
    }
};