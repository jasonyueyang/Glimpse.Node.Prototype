var uuid = require('node-uuid');

var glimpseCore = require("../core/glimpseMiddleware.js"); 
var interceptor = require('../core/moduleInterceptor.js');
var glimpseSession = require('../core/glimpseSession.js');
var glimpseRuntime = require('../core/glimpseRuntime.js');
var glimpseOptions = require('../core/glimpseOptions');

var glimpseServer = require('../../glimpse.server');

function interceptExpress (express) {
    var expressWrapper = function () {
        var app = express.apply(this, arguments);

        if (glimpseOptions.embedServer) {            
            app.use(glimpseServer.express());
            
            app.use(function(req, res, next){
               if (glimpseOptions.metadataUri === undefined) {
                   glimpseOptions.metadataUri = req.protocol + '://' + req.get('host') + '/glimpse/metadata';
               }
               
               next();
            });
        }

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

    if (options !== undefined) {
        if (options.embedServer !== undefined && options.embedServer) {
            glimpseOptions.embedServer = options.embedServer;
            
            // NOTE: When embedded, the metadata URI will be updated upon the first request 
            //       (to obtain the correct hostname and port). 
            
            glimpseOptions.metadataUri = undefined;
        }
               
        if (options.metadataUri !== undefined) {
            glimpseOptions.metadataUri = options.metadataUri;
        }
    }
    
    interceptor.intercept('express', interceptExpress);    
};