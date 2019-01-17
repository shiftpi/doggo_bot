const ImageApi = require('./image.api');
const request = require('request-promise-native');

module.exports = class TenorApi extends ImageApi {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    getRandom() {
        return request({
            uri: 'https://api.tenor.com/v1/random',
            qs: {
                key: this.apiKey,
                q: 'cute dog',
                locale: 'en_US',
                media_filter: 'basic',
                ar_range: 'standard',
                limit: 1
            },
            json: true
        }).then(response => response.results[0].media[0].gif.url);
    }

    getCredits() {
        return 'Via Tenor';
    }

    getPicType() {
        return ImageApi.PicType.gif;
    }
};