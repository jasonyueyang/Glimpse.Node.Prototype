var messageStore = require('./messageStore');
var _ = require('lodash');

var _subscriptions = [ ];

var addMessages = function(messages) {
    messageStore.addMessages(messages);

    // NOTE: We copy the array in case subscriptions are removed during the callback.

    var subscriptions = _subscriptions.slice();
    
    subscriptions.forEach(function(subscription) {
        
        var chainedMessages =_.chain(messages);
        
        if (subscription.types !== undefined && subscription.types.length > 0) {
            chainedMessages = chainedMessages.filter(function(message) {
                return _.intersection(message.types, subscription.types).length > 0;
            });
        }
        
        if (subscription.contextId !== undefined) {
            chainedMessages = chainedMessages.filter(function(message) {
                return message.context.id === subscription.contextId;
            });
        }
        
        chainedMessages.value().forEach(function(message) {
            subscription.callback(null, message);
        });
    });
};

var getMessages = function(requestId, types) {
    return messageStore.getMessages(requestId, types);
};

var streamMessages = function(types, contextId, callback) {
    var entry = 
    { 
        types: types,
        contextId: contextId,
        callback: callback
    }; 

    entry.done = function() {
        var index = _subscriptions.indexOf(entry);
        
        if (index >= 0) {
            _subscriptions.splice(index, 1);
        }
    };

    _subscriptions.push(entry);
    
    return entry;
};

exports.addMessages = addMessages;
exports.getMessages = getMessages;
exports.streamMessages = streamMessages;