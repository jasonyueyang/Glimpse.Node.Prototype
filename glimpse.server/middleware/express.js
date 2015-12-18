var express = require('express');

var glimpse = require('../routes/glimpse');

var expressMiddleware = function () {
    var app = express();
    app.use('/glimpse', glimpse);
    return app;
};

exports = module.exports = expressMiddleware;