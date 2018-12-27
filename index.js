const ReplyBot = require('./components/reply.bot');
const UnsplashApi = require('./components/image/unsplash.api');
const AzureApi = require('./components/analytics/azure.api');
const config = require('config');

const telegram = new ReplyBot(config.get('telegram.bot_token'));
const unsplash = new UnsplashApi();
const azure = new AzureApi(config.get('azure.region'), config.get('azure.key'));

telegram.start(() => unsplash.getRandom(), text => azure.getSentiment(text));