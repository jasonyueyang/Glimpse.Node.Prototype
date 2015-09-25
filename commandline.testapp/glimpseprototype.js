var http = require('http');
var uuid = require ('node-uuid'); 
var glimpse = require('../glimpse.agent/core/glimpseMessages.js')


var readline = require('readline');
var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

var agent = new glimpse.GlimpseAgent();
var context;
var beginTime;
var myUrl = "http://my.url.com:5000";

rl.setPrompt("options:\r\n\tq:  quit\r\n\tc:  new context\r\n\tbm:  send begin-request message\r\n\tem: end-request message\r\n?");

rl.prompt(true);
rl.on('line', function(cmd) {
	if ( cmd === 'q') {
		process.exit(0);
	}
	else if (cmd === 'nc') {
		context = new glimpse.Context();
	}
	else if (cmd === 'bm') {
	    context = new glimpse.Context()
		beginTime = new Date();
		//var message = new glimpse.BeginRequestMessage(context, myUrl);
		// (data, indices, types, context) {
		var message =  glimpse.beginRequestMessage(context, myUrl);
		agent.send(message);
		//console.log(JSON.stringify(message));
	}
	else if (cmd === 'em') {
//		var message = new glimpse.EndRequestMessage(context, myUrl, beginTime, new Date());
		var message =  glimpse.endRequestMessage(context, myUrl, beginTime, new Date());
		agent.send(message);
		console.log(JSON.stringify(message));
	}

	rl.prompt(true);
});


