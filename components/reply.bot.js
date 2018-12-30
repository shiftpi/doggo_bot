const Telegraf = require('telegraf');
const ImageApi = require('./image/image.api');

module.exports = class ReplyBot {
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
    }

    start(picSourceCb, textRecogCb) {
        this.bot.use((ctx, next) => {
            if (!ctx.message.text) {
                return;
            }

            return textRecogCb(ctx.message.text).then(score => {
                const date = new Date(ctx.message.date * 1000);

                ctx.picSource = picSourceCb();
                ctx.happyScore = score;

                console.log(`${ctx.message.from.first_name} (${ctx.message.from.id}) [${date.toISOString()}] `
                    + `[Happy score: ${score}] [Pic source: ${ctx.picSource.constructor.name}]: ${ctx.message.text}`);

                return next(ctx);
            });
        });

        this.bot.start(this.opening);
        this.bot.help(this.opening);
        this.bot.hears(/(hello|hi)/i, this.opening);

        this.bot.hears(/.*/, ctx => {
            if (ctx.happyScore < 0.33) {
                ctx.reply(this.getNoMessage());
            } else if (ctx.happyScore < 0.66) {
                ctx.reply('Are you happy or not? I\'m not sure');
            } else {
                ctx.reply(this.getYesMessage());
                this.sendPicture(ctx.picSource, ctx);
            }
        });

        this.bot.startPolling();
    }

    opening(ctx) {
        ctx.reply('Hello human, may I show you some cute doggos?');
    }

    sendPicture(picSource, ctx) {
        let loadingId;

        ctx.reply('Give me a sec 🐶🐶🐶', { disable_notification: true })
            .then(message => loadingId = message.message_id)
            .then(() => picSource.getRandom())
            .then(picture => {
                const replyCb = picSource.getPicType() === ImageApi.PicType.gif ? ctx.replyWithVideo
                    : ctx.replyWithPhoto;

                return replyCb({ url: picture }, { caption: picSource.getCredits() });
            })
            .then(() => ctx.deleteMessage(loadingId))
            .then(() => ctx.reply('Isn\'t that a cute one?'))
            .catch(error => {
                console.error('FATAL', picSource.constructor.name, error.message);
                ctx.reply('Sorry, the doggos went walkies. Try again later.');
            });
    }

    getYesMessage() {
        const messages = [
            'Yeay, you cute doggo lover... Here is one',
            'Here you are!',
            'Wuhu, look at this cute doggo',
            'And another cute doggo',
            'That\'s a cute one...'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    getNoMessage() {
        const messages = [
            'How bad. Do you give me another chance?',
            'I\'m sorry to hear that. Shall I try again?',
            'Oh no... Please give me another chance',
            'Uh that hurts. Please let me try again',
            'Ok, that\'s sad. But if human wishes I\'ll try again'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }
};