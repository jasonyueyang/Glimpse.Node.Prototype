var _ = require('lodash');

var hash = require('./hash');
var messageStore = require('./messageStore');

var addMessages = function(messages) {
  messageStore.addMessages(messages);	
};

var getMessagePayloadsByType = function(types) {
  
  var messages = messageStore.getMessagesByType(types);

  var payloads =   
    '[' +
    _.map(
      messages, 
      function(message) {
        return message.payload;  
      })
    .join(',')  
    + ']';
	
  return payloads;
};

var getMetadata = function(baseUrl) {
  var resources = 
  {
    'message-history': baseUrl + '/message-history/?types={types}',
    'message-ingress': baseUrl + '/message-ingress/',    
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

exports.addMessages = addMessages;
exports.getMessagePayloadsByType = getMessagePayloadsByType;
exports.getMetadata = getMetadata;