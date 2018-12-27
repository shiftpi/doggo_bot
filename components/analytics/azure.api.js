const request = require('request-promise-native');

module.exports = class AzureApi {
    constructor(region, apiKey) {
        this.url = `https://${region}/text/analytics/v2.0/sentiment`;
        this.apiKey = apiKey;
    }

    getSentiment(text) {
        return request({
            method: 'POST',
            uri: this.url,
            headers: this.getAuthHeader(),
            body: {
                documents: [{
                    id: 1,
                    language: 'en',
                    text: text
                }]
            },
            json: true
        }).then(response => response.documents.find(doc => +doc.id === 1).score);
    }

    getAuthHeader() {
        return { 'Ocp-Apim-Subscription-Key': this.apiKey };
    }
};