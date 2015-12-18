var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var router = express.Router();

var glimpseService = require('../services/glimpseService');

router.use(logger('dev'));
router.use(bodyParser.json());
router.use('/', express.static(path.join(__dirname, '../resources/root')));
router.use('/client', express.static(path.join(__dirname, '../resources/client')));
router.use('/hud', express.static(path.join(__dirname, '../resources/hud')));
router.use('/agent', express.static(path.join(__dirname, '../resources/agent')));

router.get('/context', function (req, res) {
    if (!req.query.contextId) {
        res.sendStatus(404);
        res.send("missing contextId parameter");
    }
    else {
        var types = [];
        if (req.query.types) {
            types = req.query.types.split(',');
        }
        var payloads = glimpseService.getMessagePayloads(req.query.contextId, types);
        res.status(200);
        res.type('application/json');
        res.send(payloads);
    }
});

router.get('/export-config', function (req, res) {
    res.sendStatus(501);
});

router.get('/message-history', function (req, res) {
    var types = req.query.types ? req.query.types.split(',') : [ ];
    var payloads = glimpseService.getMessagePayloads(null, types);

    res.status(200);
    res.type('application/json');
    res.send(payloads);
});

router.post('/message-ingress', function (req, res) {
    glimpseService.addMessages(req.body);
    res.sendStatus(202);
});

router.get('/message-stream', function(req, res) {
  
  var types = req.query.types ? req.query.types.split(',') : [ ];
  var contextId = req.query.contextId;
  
  res.writeHead(
    200,
    {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive' 
    });
  
  var subscription = glimpseService.streamMessagePayloads(
    types,
    contextId, 
    function(err, payload) {
    if (payload) {
      res.write(payload);
    }
    else {
      res.end();
    }
  });
  
  req.on('close', function() {
    subscription.done();
  });
});

router.get('/metadata', function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('host') + '/glimpse';

    var metadata = glimpseService.getMetadata(baseUrl);

    res.json(metadata);
});

router.get('/request-history', function (req, res) {
    res.sendStatus(501);
});

module.exports = router;
