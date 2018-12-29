const Telegraf = require('telegraf');
const ImageApi = require('./image/image.api');

module.exports = class ReplyBot {
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
    }

    start(picSourceCb, textRecogCb) {
        this.bot.use((ctx, next) => {
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
                ctx.reply('How bad. Do you give me another chance');
            } else if (ctx.happyScore < 0.66) {
                ctx.reply('You\'re not happy as any cute doggo. Do you give me another chance?');
            } else {
                ctx.reply('Yeay, you cute doggo lover... Here is one');
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

        ctx.reply('...', { disable_notification: true })
            .then(message => loadingId = message.message_id)
            .then(() => picSource.getRandom())
            .then(picture => {
                const replyCb = picSource.getPicType() === ImageApi.PicType.gif ? ctx.replyWithVideo
                    : ctx.replyWithPhoto;

                replyCb({ url: picture }, { caption: picSource.getCredits() });
            })
            .then(() => ctx.deleteMessage(loadingId))
            .then(() => ctx.reply('Isn\'t that a cute one?'))
            .catch(error => {
                console.error('FATAL', picSource.constructor.name, error.message);
                ctx.reply('Sorry, the doggos went walkies. Try again later.');
            });
    }
};