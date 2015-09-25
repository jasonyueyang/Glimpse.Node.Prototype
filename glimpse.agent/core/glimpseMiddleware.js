var useragent = require('useragent');
var glimpseMessages = require('./glimpseMessages.js');
var runtime = require('./glimpseRuntime.js');


// TODO: Need to do this better 
// var config = require('../configuration.js');
// var reqResTab = require('./tabs/requestResponse.js');
// config.tabs.push(reqResTab);


function glimpseMiddleware (req, res, next) {
    console.log('EXPRESS - Begin Request - ' + req.path);

    var glimpseContext = new glimpseMessages.Context();
    var glimpseAgent = new glimpseMessages.GlimpseAgent();

    // TODO: gotta be a better way to do this
    //console.log("res.end is" + res.end);
    
    res.end = bindResponseEnd(req, res, glimpseContext, glimpseAgent, new Date());

    runtime.beginRequest({
        request: req,
        response: res
    }, function (err) {
        if (err) {
            // TODO, hopefully this doesn't break
            // but we should still call next if it does
        }
         
        var message = glimpseMessages.beginRequestMessage(glimpseContext, req.originalUrl);
        glimpseAgent.send(message);
        
        next();
    });
}

function bindResponseEnd (req, res, glimpseContext, glimpseAgent, beginTime) {
    var resEnd = res.end;
    function glimpseResEnd (data, encoding, callback) {
        console.log('EXPRESS - End Request');

        var that = this;
        //var endArgs = Array.prototype.slice.call(arguments, 2);
 
        runtime.endRequest({
            request: req,
            response: res
        }, function (err) {
            if (err) {
                // TODO, hopefully this doesn't break
                // but we should still call next if it does
            }

            console.log("we are here in endRequest");

            var message =  glimpseMessages.endRequestMessage(glimpseContext, req.originalUrl, beginTime, new Date());
            glimpseAgent.send(message);
            
                        console.log("calling resEnd.Apply");
            resEnd.call(that, data, encoding, callback);

// 
// 
//             // TODO, switch endRequest and injectScript over to use
//             // async.series() or similar
//             runtime.injectScript({
//                 request: req,
//                 response: res,
//                 data: data,
//                 encoding: encoding
//             }, function (err, result) {
//                 if (err) {
//                     // TODO, hopefully this doesn't break
//                     // but we should still call next if it does
//                 }
// 
//                 result = result || {};
// 
//                 endArgs.unshift(result.encoding || encoding);
//                 endArgs.unshift(result.data || data);
// 
//                 resEnd.apply(that, endArgs);
//            }); 

 
        }); 
    }

    return glimpseResEnd;
}

module.exports = { glimpseMiddleware } ;