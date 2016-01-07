var _ = require('lodash');

var _messages = [];

var addMessages = function (messages) {
    if (messages && Array.isArray(messages)) {
        messages.forEach(function (message) {
            _messages.push(message);
        });
    }
};

var getMessages = function (requestId, types) {
    if (!requestId && !types) {
        return _messages;
    }

    return _.filter(
        _messages,
        function (message) {
            if (requestId && types) {
                return message.context.id == requestId && _.intersection(message.types, types).length > 0;
            }

            if (requestId) {
                return message.context.id == requestId;
            }

            if (types) {
                return _.intersection(message.types, types).length > 0;
            }
        });
};

exports.addMessages = addMessages;
exports.getMessages = getMessages;
