var express = require('express');
var path = require('path');

var glimpse = require('../routes/glimpse'); 

var expressMiddleware = function() {
	var app = express();
	
	app.use('/glimpse', express.static(path.join(__dirname, '../root')));
	app.use('/glimpse/client', express.static(path.join(__dirname, '../client')));
	app.use('/glimpse', glimpse);
	
	return app;
};

exports = module.exports = expressMiddleware;