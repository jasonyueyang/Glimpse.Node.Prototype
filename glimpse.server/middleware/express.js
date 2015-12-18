var express = require('express');
var path = require('path');

var glimpse = require('../routes/glimpse');

var expressMiddleware = function () {
    var app = express();

    app.use('/glimpse', express.static(path.join(__dirname, '../resources/root')));
    app.use('/glimpse/client', express.static(path.join(__dirname, '../resources/client')));
    app.use('/glimpse/hud', express.static(path.join(__dirname, '../resources/hud')));
    app.use('/glimpse/agent', express.static(path.join(__dirname, '../resources/agent')));
    app.use('/glimpse', glimpse);

    return app;
};

exports = module.exports = expressMiddleware;