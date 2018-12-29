const ImageApi = require('./image.api');
const request = require('request-promise-native');

module.exports = class GiphyApi extends ImageApi {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    getRandom(iterationCnt) {
        const offset = Math.round(Math.random() * 10000000);
        iterationCnt = iterationCnt === undefined ? 0 : iterationCnt;

        return request({
            uri: 'http://api.giphy.com/v1/gifs/search',
            qs: {
                api_key: this.apiKey,
                q: 'cute dog',
                limit: 1,
                offset: offset
            },
            json: true
        }).then(response => {
            if (response.pagination.count > 0) {
                return response.data[0].images.original.url;
            } else if (iterationCnt < 3) {
                return this.getRandom(iterationCnt++);
            } else {
                return null;
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