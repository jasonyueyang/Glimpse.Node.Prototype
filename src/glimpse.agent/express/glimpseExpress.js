var uuid = require('node-uuid');

var glimpseCore = require("../core/glimpseMiddleware.js");
var interceptor = require('../core/moduleInterceptor.js');
var glimpseSession = require('../core/glimpseSession.js');
var glimpseRuntime = require('../core/glimpseRuntime.js');
var glimpseOptions = require('../core/glimpseOptions');

var glimpseServer = require('../../glimpse.server');

function interceptExpress(express) {
    var expressWrapper = function () {
        var app = express.apply(this, arguments);

        if (glimpseOptions.embedServer) {
            app.use(glimpseServer.express());

            app.use(function (req, res, next) {
                if (glimpseOptions.protocol === undefined) {
                    glimpseOptions.protocol = req.protocol;
                    glimpseOptions.host = req.get('host');
                }

                next();
            });
        }

        app.use(function (req, res, next) {
            glimpseCore.glimpseSessionInit(req, res, next);
        });

        app.use(function (req, res, next) {
            glimpseCore.glimpseMiddleware(req, res, next);
        });

        return app;
    };

    for (var k in express) {
        expressWrapper[k] = express[k];
    }

    // over-ride definition of dispatch so we can generate route-dispatch events
    var expressDispatch = expressWrapper['Route'].prototype.dispatch;
    expressWrapper['Route'].prototype.dispatch = function dispatch(req, res, done) {

        // at time this method is called, we're invoked on a "Route" object. 
        var route = this;

        /* TODO - figure out what correct data to display here for a "route" and an "action" */
        var actionData = {
            id: uuid.v4(),
            name: route.stack[0].name,
            displayName: route.stack[0].name,
            controllerName: route.stack[0].name,
        };

        var routeData = {
            name: route.stack[0].name,
            pattern: route.path,
            data: {} /* TODO */
        };

        glimpseRuntime.dispatchRoute(actionData, routeData);
        expressDispatch.apply(route, arguments);
    };

    var expressSend = expressWrapper['response'].send;
    expressWrapper['response'].send = function send(body) {

        // at time this method is called, we're invoked on a "Response" object. 
        var response = this;

        var payload = glimpseRuntime.getHUDScriptTags();

        if (typeof body === 'string') {
            body = glimpseRuntime.injectScript(body, payload);
        }
        expressSend.apply(response, arguments);
    }

    return expressWrapper;
}

exports = module.exports = function (options) {

    if (options !== undefined) {
        if (options.embedServer !== undefined && options.embedServer) {
            glimpseOptions.embedServer = options.embedServer;

            // NOTE: When embedded, the metadata URI will be updated upon the first request 
            //       (to obtain the correct hostname and port). 

            glimpseOptions.protocol = undefined;
            glimpseOptions.host = undefined;
        }

        if (options.host !== undefined) {
            glimpseOptions.host = options.host;
        }
        if ( options.protocol !== undefined ) {
            glimpseOptions.protocol = options.protocol;
        }
    }

    interceptor.intercept('express', interceptExpress);
};
