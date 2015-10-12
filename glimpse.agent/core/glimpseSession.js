var cls = require('continuation-local-storage');
var uuid = require('node-uuid');

var glimpseNamespace = 'glimpse-session';
var keyContext = 'context';
var keyStartTime = 'start-time';

function Context() {
    this.id = uuid.v4();
    this.Type = "Request"
}

function init(next) {
    var session = cls.createNamespace(glimpseNamespace);
    session.run( function() {
        session.set(keyContext, new Context());
        session.set(keyStartTime, new Date());
        next() } );
}

function getContinuationLocalStorage() {
    var session = cls.getNamespace(glimpseNamespace);
    return session;    
}

function getContext() {
    var session = cls.getNamespace(glimpseNamespace);
    return session.get(keyContext);   
}

function getStartTime() {
    var session = cls.getNamespace(glimpseNamespace);
    return session.get(keyStartTime);   
}

var glimpseSession = {
    init: init,
    getContinuationLocalStorage: getContinuationLocalStorage,
    getContext: getContext,
    getStartTime: getStartTime
};

module.exports = glimpseSession;