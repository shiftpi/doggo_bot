const Telegraf = require('telegraf');

module.exports = class ReplyBot {
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
    }

    start(imagePromiseCb, textRecogCb) {
        this.bot.use((ctx, next) => {
            return textRecogCb(ctx.message.text).then(score => {
                const date = new Date(ctx.message.date * 1000);
                console.log(`${ctx.message.from.first_name} (${ctx.message.from.id}) [${date.toISOString()}] `
                    + `[Happy score: ${score}]: ${ctx.message.text}`);

                ctx.happyScore = score;

                return next(ctx);
            });
        });

        this.bot.start(this.opening);
        this.bot.help(this.opening);
        this.bot.hears(/(hello|hi)/i, this.opening);

        this.bot.hears(/.*/, ctx => {
            ctx.reply(`I think with ${Math.round(ctx.happyScore * 100)}% certainty you are happy`).then(() => {
                if (ctx.happyScore < 0.33) {
                    ctx.reply('How bad. Do you give me another chance');
                } else if (ctx.happyScore < 0.66) {
                    ctx.reply('You\'re not happy as any cute doggo. Do you give me another chance?');
                } else {
                    ctx.reply('Yeay, you cute doggo lover... Here is one');
                    this.sendPicture(imagePromiseCb, ctx);
                }
            });
        });

        this.bot.startPolling();
    }

    opening(ctx) {
        ctx.reply('Hello human, may I show you some cute doggos?');
    }

    sendPicture(cb, ctx) {
        let loadingId;

        ctx.reply('...', { disable_notification: true })
            .then(message => loadingId = message.message_id)
            .then(() => cb())
            .then(picture => ctx.replyWithPhoto({ url: picture }, { caption: 'Isn\'t that a cute one?' }))
            .then(() => ctx.deleteMessage(loadingId));
    }
};