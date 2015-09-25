
var glimpseCore = require("../core/glimpseMiddleware.js"); 
var interceptor = require('../core/moduleInterceptor.js');

interceptor.intercept('express', interceptExpress);

function interceptExpress (express) {
    var expressWrapper = function () {
        var app = express.apply(this, arguments);

        app.use(function(req, res, next) {
            console.log("glimpseCore is " + glimpseCore);
            console.log("glimpseCore is " + glimpseCore.glimpseMiddleware);
           // glimpseCore.glimpseMiddleware(req, res, next);
            glimpseCore.glimpseMiddleware(req,res,next);
        });

        return app;
    };
    for (var k in express) {
        expressWrapper[k] = express[k];
    }
    return expressWrapper;
}

module.exports = {};