var uuid = require('node-uuid');

var getNextOrdinal = (function () {
    var i = 0;

    return function () { return ++i; };
})();

var convertMessage = function(data, indices, types, context) {
    var message = {};
    message.id = uuid.v4().replace(new RegExp('-', 'g'), '');
    message.context = context;
    message.ordinal = getNextOrdinal();
    message.types = types;
    message.indices = indices;
    
    var payload = {
        id: message.id,
        payload: data,
        ordinal: message.ordinal,
        context: message.context,
        types: types
    };
    
    message.payload = JSON.stringify(payload);

    return message;
};

module.exports = {
    convertMessage: convertMessage
}