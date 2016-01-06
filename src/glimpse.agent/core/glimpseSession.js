var cls = require('continuation-local-storage');
var uuid = require('node-uuid');

var glimpseNamespace = 'glimpse-session';
var keyContext = 'context';
var keyStartTime = 'start-time';

var ns = cls.createNamespace(glimpseNamespace);

function Context() {
    // strip dashes out of the guid (cause that's what glimpse server & client expects)
    this.id = uuid.v4().replace(new RegExp('-', 'g'), '');
    this.type = "Request"
}

function init(req, res, next) {
    var session =
    {
        context: new Context(),
        startTime: new Date()
    }        
        
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run( 
        function() {        
            ns.set(keyContext, session.context);
            ns.set(keyStartTime, session.startTime);
                            
            next(session);
        });
}

function getContext() {
    return ns.get(keyContext);   
}

function getStartTime() {
    return ns.get(keyStartTime);   
}

var glimpseSession = {
    init: init,
    getContext: getContext,
    getStartTime: getStartTime
};

module.exports = glimpseSession;