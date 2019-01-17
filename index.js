const ReplyBot = require('./components/reply.bot');
const UnsplashApi = require('./components/image/unsplash.api');
const TenorApi = require('./components/image/tenor.api');
const AzureApi = require('./components/analytics/azure.api');
const config = require('config');

const telegram = new ReplyBot(config.get('telegram.bot_token'));
const azure = new AzureApi(config.get('azure.region'), config.get('azure.key'));

const source = () => {
    if (Math.round(Math.random() * 10) % 2 === 0) {
        return new UnsplashApi();
    } else {
        return new TenorApi(config.get('tenor.key'));
    }
};

telegram.start(source, text => azure.getSentiment(text));