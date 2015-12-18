var _ = require('lodash');

var hash = require('./hash');
var messageService = require('./messageService');


var addMessages = function (messages) {
    messageService.addMessages(messages);
};

var getMessagePayloads = function (requestId, types) {

    var messages = messageService.getMessages(requestId, types);

    var payloads =
      '[' +
      _.map(
        messages,
        function (message) {
            return message.payload;
        })
      .join(',')
      + ']';

    return payloads;
}

var getMetadata = function (baseUrl) {
    var resources =
    {
        'message-history': baseUrl + '/message-history/?types={types}',
        'message-ingress': baseUrl + '/message-ingress/',
        'message-stream': baseUrl + '/message-stream/{?types, contextId}',
        'metadata': baseUrl + '/metadata/?hash={hash}'
    };

    var resourceHash = hash.hashObject(resources);

    var metadata =
    {
        'resources': resources,
        'hash': resourceHash
    };

    return metadata;
};

var streamMessagePayloads = function (types, contextId, callback) {
    return messageService.streamMessages(types, contextId, function (err, message) {
        if (err) return callback(err);

        var payload = '';

        payload += 'id: ' + message.context.id + '\n';
        payload += 'event: ' + 'message' + '\n';
        payload += 'data: ' + '[' + message.payload + ']' + '\n';
        payload += '\n';

        callback(null, payload);
    });
};

exports.addMessages = addMessages;
exports.getMetadata = getMetadata;
exports.getMessagePayloads = getMessagePayloads;
exports.streamMessagePayloads = streamMessagePayloads;
