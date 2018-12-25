const ReplyBot = require('./components/reply.bot');
const UnsplashApi = require('./components/image/unsplash.api');
const config = require('config');

const telegram = new ReplyBot(config.get('telegram.bot_token'));
const unsplash = new UnsplashApi();

telegram.start(() => unsplash.getRandom(), unsplash.getCredits());