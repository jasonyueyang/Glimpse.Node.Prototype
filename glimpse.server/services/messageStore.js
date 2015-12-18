var _ = require('lodash');

var _messages = [ ];

var addMessages = function(messages) {
	messages.forEach(function(message) {
    	_messages.push(message);
  	});	
};

var getMessagesByType = function(types) {
	if (types !== undefined && types.length > 0) {
		return _.filter(
			_messages,
			function(message) {
				return _.intersection(message.types, types).length > 0;
			});	
	}
	else {
		return _messages;
	}
};

exports.addMessages = addMessages;
exports.getMessagesByType = getMessagesByType;