const ImageApi = require('./image.api');
const request = require('request-promise-native');

module.exports = class UnsplashApi extends ImageApi {
    getRandom() {
        return request({
            uri: 'https://source.unsplash.com/1200x800/?dog',
            followRedirect: false,
            resolveWithFullResponse: true,
            simple: false
        }).then(response => response.headers.location);
    }

    getCredits() {
        return null;
    }
};