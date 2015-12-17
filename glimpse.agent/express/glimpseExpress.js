var uuid = require('node-uuid');

var glimpseCore = require("../core/glimpseMiddleware.js"); 
var interceptor = require('../core/moduleInterceptor.js');
var glimpseSession = require('../core/glimpseSession.js');
var glimpseRuntime = require('../core/glimpseRuntime.js');
var glimpseOptions = require('../core/glimpseOptions');

function interceptExpress (express) {
    var expressWrapper = function () {
        var app = express.apply(this, arguments);

        app.use(function(req, res, next) {
           glimpseCore.glimpseSessionInit(req, res, next);  
        });

        app.use(function(req, res, next) {
            glimpseCore.glimpseMiddleware(req,res,next);
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

    return expressWrapper;
}

exports = module.exports = function(options) {

    if (options !== undefined && options.metadataUri !== undefined) {
        glimpseOptions.metadataUri = options.metadataUri;
    }
    
    interceptor.intercept('express', interceptExpress);    
};