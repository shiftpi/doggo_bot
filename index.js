const ReplyBot = require('./components/reply.bot');
const PixabayApi = require('./components/image/pixabay.api');
const config = require('config');

const telegram = new ReplyBot(config.get('telegram.bot_token'));
const pixabay = new PixabayApi(config.get('pixabay.api_key'));

telegram.start(() => pixabay.getRandom(), pixabay.getCredits());