const ImageApi = require('./image.api');
const request = require('request-promise-native');

module.exports = class PixabayApi extends ImageApi {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    getRandom() {
        const page = Math.floor(Math.random() * 100 + 1);

        return request({
            uri: 'https://pixabay.com/api/',
            qs: {
                key: this.apiKey,
                q: 'dog',
                image_type: 'photo',
                per_page: 3,
                page: page
            },
            json: true
        }).then(results => {
            if (results.total === 0) {
                throw 'No images found';
            }

            return results.hits[0].largeImageURL;
        })
    }

    getCredits() {
        return 'Picture kindly contributed by [Pixabay](https://pixabay.com)';
    }
};