var crc = require('crc');
var _ = require('lodash');

var hashStrings = function(strings) {
    return crc.crc32(strings.join('&')).toString(16).toLowerCase();
}

var hashKeyValuePairs = function(keyValuePairs) {

    // NOTE: Lodash does not guarantee map order so sorting is required.
    //       Glimpse.Server.Configuration.Metadata.Hash doesn't sort the 
    //       pairs, so hashes between servers cannot be compared directly. 

    return hashStrings(
        _.chain(keyValuePairs)
            .sortBy(
                function(keyValuePair) {
                    return keyValuePair[0];
                })
            .map(
                function(keyValuePair) {
                    return keyValuePair[0].toString() + '=' + keyValuePair[1].toString();
                })
            .value());
}

var hashObject = function(object) {
    return hashKeyValuePairs(_.pairs(object));
};

exports.hashObject = hashObject;