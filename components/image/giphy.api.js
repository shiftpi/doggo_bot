const ImageApi = require('./image.api');
const request = require('request-promise-native');

module.exports = class GiphyApi extends ImageApi {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    getRandom(iterationCnt) {
        const limit = 100;
        const position = Math.floor(Math.random() * limit);

        iterationCnt = iterationCnt === undefined ? 0 : iterationCnt;

        return request({
            uri: 'http://api.giphy.com/v1/gifs/search',
            qs: {
                api_key: this.apiKey,
                q: 'cute dog',
                limit: limit,
                offset: 0
            },
            json: true
        }).then(response => {
            if (response.pagination.count >= position + 1) {
                return response.data[position].images.original.url;
            } else if (response.pagination.count > 0) {
                return response.data[response.pagination.count - 1].images.original.url;
            } else {
                return this.getRandom(iterationCnt++);
            }
        });
    }

    getCredits() {
        return 'Powered By GIPHY';
    }

    getPicType() {
        return ImageApi.PicType.gif;
    }
};