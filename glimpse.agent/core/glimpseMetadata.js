var request = require('request');
var url = require('url');

var glimpseOptions = require('./glimpseOptions');

var _metadata = undefined;
var _getMetadataQueue = undefined;

var getMetadataFromServer = function(callback) {
	if (_metadata === undefined) {
		if (_getMetadataQueue === undefined) {

			_getMetadataQueue = [];
			_getMetadataQueue.push(callback);

			var options =
			{
				uri: glimpseOptions.metadataUri,
				json: true
			};	
			
			var req = request(options, function(err, res, body) {
				if (err) throw err;
					
				_metadata = body;
					
				_getMetadataQueue.forEach(function(metadataCallback) {
					metadataCallback(null, _metadata);			
				});
			});
			
			req.end();		
		}
		else {
			_getMetadataQueue.push(callback);
		}
	}	
	else {
		callback(null, _metadata);
	}
};

var getMetadataForResource = function(resource, callback) {
	getMetadataFromServer(function(err, metadata) {
		if (err) throw err;
		
		callback(null, metadata.resources[resource]);			
	});
};

exports.getMetadataForResource = getMetadataForResource;