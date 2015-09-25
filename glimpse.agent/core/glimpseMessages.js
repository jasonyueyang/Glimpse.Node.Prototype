var http = require('http');
var uuid = require ('node-uuid'); 
var util = require('util');

function Context() {
	this.id = uuid.v4();
	this.Type = "Request"
}

var getNextOrdinal = (function() {
  var i = 0;  
  
  return function() {
    return ++i;
  };
})();

function createMessage(data, indices, types, context) {
    var message = {};
      message.id = uuid.v4();
	message.context = context;
	message.ordinal = getNextOrdinal();

    message.types = types;
	  message.indices =  indices;
	  var payloadObject = {
  		id: message.id,
	  	payload: data,
		  ordinal: message.ordinal,
		  context: message.context,
      types: types
	  };  
	  message.payload = JSON.stringify(payloadObject);
    
      
   return message;
  
}

function beginRequestMessage(context, hostUrl) {

    var data = {url: hostUrl};
	  var indices =  {"request-url":hostUrl}
    var types = ["begin-request-message"];
      
    var message = createMessage(data,  indices, types, context);
  return message;
}  
  
function endRequestMessage(context, hostUrl, beginTime, endTime) {

  var duration = endTime.getTime() - beginTime.getTime();

	var data = {
		 duration : duration,
         startTime : beginTime,
         endTime:endTime,
         url:hostUrl,
         method:"GET",
         contentType :"text/html; charset=utf-8",
         statusCode:200
	};

	var indices = {
		 "request-duration": duration,
         "request-datetime":beginTime,
         "request-url":hostUrl,
         "request-method":"GET",
         "request-content-type":"text/html; charset=utf-8",
         "request-status-code":200 };

  var types = ["end-request-message"];


  var message = createMessage(data, indices, types, context);
  return message;
}

function GlimpseAgent() {
	var that = this;
	
	that.send = function (messages) {
		
		// convert a single message into an array of messages
		if( !util.isArray(messages)) {
            messages = [messages]; 
        }
		
		var str  = '';
        var callback = function(response) {
	        console.log("GlimpseAgent:  callback started");
	        response.on('data', function(chunk) {
		        str += chunk;
	        });
	
	        response.on('end', function() {
		        console.log("GlimpseAgent:  end:  " + str);
	        });
		}
	 
	    var options = {
	        host:  'localhost',
	        path: '/glimpse/AgentMessage',
 	        port:5000,
	        method: 'POST'
        };
	
	    var req = http.request(options, callback);

        console.log("calling write");
		var json = JSON.stringify(messages);
    
    console.log(json);
    
        req.write(json);
        console.log("calling end");
        req.end();

        console.log("DONE!")
    }	
}
	




var glimpseMessages = {
	GlimpseAgent: GlimpseAgent,
	Context: Context,
	beginRequestMessage: beginRequestMessage,
  endRequestMessage: endRequestMessage
};

module.exports =  glimpseMessages;