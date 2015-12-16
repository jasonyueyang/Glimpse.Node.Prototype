var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Glimpse for Express', status: '' });
});

function submitAction(req, res, next) {
   setTimeout( 
       function() {
           res.render( 'index', { 
                     title: 'Glimpse for Express', 
                     status: "Thanks for submitting!  You're request waited for " + req.query.waitSeconds + " seconds!" })
       },
       req.query.waitSeconds * 1000);
}

router.get('/submitAction', submitAction);

module.exports = router;
