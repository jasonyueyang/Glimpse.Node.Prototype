var request = require('request');
var metadataProvider = require('../configuration/metadata-provider');

var publishMessage = function(messages) {
    metadataProvider.getResourceOptions(function(metadata) {
        var options = 
        {
            uri: metadata['message-ingress'],
            method: 'POST',
            json: true,
            body: messages
        };

        request(options, function(err, res) {
            if (err) {
                throw err;
            }
            
            console.log('GlimpseAgent:  end: ' + res.statusMessage);                
        });    
    });
};

module.exports = {
    publishMessage: publishMessage
};