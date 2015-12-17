var _ = require('lodash');

var _messages = [ ];

var addMessages = function(messages) {
	messages.forEach(function(message) {
    	_messages.push(message);
  	});	
};

var getMessagesByType = function(types) {
	return _.filter(
		_messages,
		function(message) {
			return _.intersection(message.types, types).length > 0;
		});
};

exports.addMessages = addMessages;
exports.getMessagesByType = getMessagesByType;