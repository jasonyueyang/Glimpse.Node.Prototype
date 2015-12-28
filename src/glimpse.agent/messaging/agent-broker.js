var messageConverter = require('./message-converter');
var messagePublisher = require('./message-publisher-http');

var sendMessage = function(data, context, types, indices) {
    var message = messageConverter.convertMessage(data, context, types, indices);
    
    messagePublisher.publishMessage(message);
};

module.exports = {
    // TODO: review to see the best way of giving access to the incoming 
    //       stream of messages.
    // onSenderThread: null,
    // offSenderThread: null,
    sendMessage: sendMessage
};