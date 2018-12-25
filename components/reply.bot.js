const Telegraf = require('telegraf');

module.exports = class ReplyBot {
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
    }

    start(imagePromiseCb, credits) {
        this.bot.start(this.opening);
        this.bot.help(this.opening);

        this.bot.hears(/(hello|hi)/i, this.opening);
        this.bot.hears(/(yes|yeah|yep|sure|ok)/i, ctx => {
            imagePromiseCb().then(picture => {
                let loadingId;

                ctx.replyWithMarkdown(credits, { disable_web_page_preview: true, disable_notification: true }).then(() => {
                        return ctx.reply('...', { disable_notification: true });
                    }).then(message => {
                        loadingId = message.message_id;
                        return ctx.replyWithPhoto({ url: picture }, { caption: 'Isn\'t that a cute one? Wanna have another?' });
                    }).then(() => {
                        ctx.deleteMessage(loadingId);
                    });
            });
        });
        this.bot.hears(/(no|'nope)/i, ctx => ctx.reply('Oh now so sad. What about now?'));
        this.bot.hears(/.*/, ctx => ctx.reply('What did you say?'));

        this.bot.startPolling();
    }

    opening(ctx) {
        ctx.reply('Hello human, may I show you some cute doggos?');
    }
};