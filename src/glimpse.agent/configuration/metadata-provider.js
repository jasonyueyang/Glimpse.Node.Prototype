var fs = require('fs');

var getMetadata = (function() {
    var metadata = null;
    
    return function(callback) {
        if (metadata) {
            callback(metadata);
            return;
        }
        
        fs.readFile('./glimpse.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            
            metadata = JSON.parse(data);
            
            callback(metadata);
        });
    };
});

var getResourceOptions = function(callback) {
    getMetadata(function(data) { 
        callback(data.resources); 
    });
};

module.exports = {
    getResourceOptions: getResourceOptions
};