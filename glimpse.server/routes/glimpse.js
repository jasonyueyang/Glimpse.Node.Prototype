var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var glimpseService = require('../services/glimpseService');

router.get('/context', function(req, res) {
  res.sendStatus(501);
});

router.get('/export-config', function(req, res) {
  res.sendStatus(501);
});

router.get('/message-history', function(req, res) {

  var payloads = glimpseService.getMessagePayloadsByType(req.query.types.split(','));

  res.status(200);
  res.type('application/json');  
  
  res.send(payloads);
});

router.post('/message-ingress', bodyParser.json(), function(req, res) {
  glimpseService.addMessages(req.body);
  
  res.sendStatus(200);
});

router.get('/message-stream', function(req, res) {
  res.sendStatus(501);
});

router.get('/metadata', function(req, res) {    
  var baseUrl = req.protocol + '://' + req.get('host') + '/glimpse';

  var metadata = glimpseService.getMetadata(baseUrl);
  
  res.json(metadata);
});

router.get('/request-history', function(req, res) {
  res.sendStatus(501);
});

module.exports = router;
