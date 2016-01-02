var interceptor = require('./platform/module-interceptor');
var broker = require('./messaging/agent-broker')

var inspectors = [
    'http'
];

module.exports = function() {
    var agent = {
        broker: broker
    };
    
    // setup interceptor
    interceptor.init(agent);
    
    // register interceptor
    for (var inspectorIndex in inspectors) {
        var inspectorKey = inspectors[inspectorIndex];
        interceptor.regsiter(inspectorKey, require('./inspectors/' + inspectorKey + '-inspector').init)
    }
};