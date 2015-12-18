exports = module.exports =
{
    embedServer: false,
    protocol: 'http',
    host: 'localhost:5000',
    baseUri: function () {
        return this.protocol + '://' + this.host;
    },
    metadataUri: function () {
        return this.baseUri() + '/glimpse/metadata';
    }
};
