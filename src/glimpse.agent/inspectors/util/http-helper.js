'use strict';

var parse = require('parseurl');

var request = {
    header: function(req, name) {
        var lc = name.toLowerCase();

        switch (lc) {
            case 'referer':
            case 'referrer':
                return req.headers.referrer || req.headers.referer;
            default:
                return req.headers[lc];
        }
    },
    /*
    // TODO: not worring about trust/procies etc atm
    protocol: function(req) {
        ...
        var trust = this.app.get('trust proxy fn'); 
        if (!trust(req.connection.remoteAddress, 0)) {
            return proto;
        }
        ....
    },
    */
    protocol: function(req) {
        // NOTE: implementation 
        var proto = req.connection.encrypted ? 'https' : 'http';
        proto = request.header(req, 'X-Forwarded-Proto') || proto;
        
        return proto.split(/\s*,\s*/)[0];  
    },
    parseurl: function(req) {
        return parse(req);
    },
    /*
    // TODO: not worring about trust/procies etc atm
    hostname: function(req) {
        ...
        var trust = this.app.get('trust proxy fn');
        var host = request.header(req, 'X-Forwarded-Host');
        if (!host || !trust(req.connection.remoteAddress, 0)) {
            host = request.header(req, 'Host');
        }
        ...
    }
    */
    hostname: function(req) {
        var host = request.header(req, 'X-Forwarded-Host') || request.header(req, 'Host');
        if (!host) {
            return;
        }
        
        // IPv6 literal support
        var offset = host[0] === '[' ? host.indexOf(']') + 1 : 0;
        var index = host.indexOf(':', offset);

        return index !== -1 ? host.substring(0, index) : host;
    }
}

module.exports = {
    request: request
}