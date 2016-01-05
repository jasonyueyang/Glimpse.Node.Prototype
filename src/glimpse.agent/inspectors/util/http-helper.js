'use strict';

var parse = require('parseurl');
var cookie = require('cookie');
var merge = require('utils-merge');

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
    },
    parseCookies: function(req) {
        var result = request.header(req, 'cookie');
        
        return result ? cookie.parse(result) : null;
    }
};

var response = {
    appendHeader: function(res, field, val) {
        var prev = res.getHeader(res, field);
        var value = val;

        if (prev) {
            // concat the new and prev vals
            value = Array.isArray(prev) ? prev.concat(val)
                : Array.isArray(val) ? [prev].concat(val)
                : [prev, val];
        }

        return res.setHeader(field, value);
    },
    setCookie: function(res, name, value, options) {
        var opts = merge({}, options);
        
        if ('maxAge' in opts) {
            opts.expires = new Date(Date.now() + opts.maxAge);
            opts.maxAge /= 1000;
        }
        if (opts.path == null) {
            opts.path = '/';
        }

        response.appendHeader(res, 'Set-Cookie', cookie.serialize(name, String(value), opts));

        return this;
    },
    clearCookie: function(res, name, options) {
        var opts = merge({ expires: new Date(1), path: '/' }, options);

        return response.setCookie(res, name, '', opts);
    }
};

module.exports = {
    request: request,
    response: response
};