var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Glimpse for Express', status: '' });
});

router.get('/submitAction', function(req, res, next) {
  console.log(req.query);
   setTimeout( 
       function() {
           res.render('index', { title: 'Glimpse for Express', status: "Thanks for submitting!  You're request waited for " + req.query.waitSeconds + " seconds!" }); },
       req.query.waitSeconds * 1000);
});

module.exports = router;
