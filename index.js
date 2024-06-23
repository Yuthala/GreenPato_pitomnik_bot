// // const { Telegraf, Markup } = require('telegraf');
// // const { message } = require('telegraf/filters');
// // // Changing max listeners for node
// // require('events').EventEmitter.defaultMaxListeners = 0;
require('dotenv').config();
// // const text = require('./const');

// // const bot = new Telegraf(process.env.BOT_TOKEN);


// // bot.start((ctx) => ctx.reply(`Добро пожаловать ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}! Какой вопрос вас интересует?`,getMainMenu()))
// // bot.help((ctx) => ctx.reply(text.commands))


// // // Если вызывать меню по команде /ask
// //     bot.command('ask', async (ctx) => {
// //         try {
// //        await ctx.replyWithHTML('<b>Вопросы</b>', Markup.inlineKeyboard(
// //             [
// //                 [Markup.button.callback('Сделать заказ', 'btn_1')],
// //                 [Markup.button.callback('Депозит не вернулся', 'btn_2')],
// //                 [Markup.button.callback('Тарифы и условия аренды(Частые вопросы)', 'btn_3')],
// //                 [Markup.button.callback('Сотрудничество', 'btn_4')],
// //                 [Markup.button.callback('Сделать заказ', 'btn_5')],
// //                 [Markup.button.callback('Аккумулятор не вышел из слота', 'btn_6')]
// //                 // [Markup.button.callback('Аккумулятор увезен/утерян/украден', 'btn_7')]
// //             ]
// //         ))
    
// //         } catch(e) {
// //             console.error(e)
// //         }
        
// //     })

// // // Если вызывать меню по команде /start 
// //     function getMainMenu() {
// //         return Markup.inlineKeyboard(
// //             [
// //                 [Markup.button.callback('Аренда не завершилась', 'btn_1')],
// //                 [Markup.button.callback('Депозит не вернулся', 'btn_2')],
// //                 [Markup.button.callback('Тарифы и условия аренды(Частые вопросы)', 'btn_3')],
// //                 [Markup.button.callback('Сотрудничество', 'btn_4')],
// //                 [Markup.button.callback('Сделать заказ', 'btn_5')],
// //                 [Markup.button.callback('Аккумулятор не вышел из слота', 'btn_6')]
// //                 // [Markup.button.callback('Аккумулятор увезен/утерян/украден', 'btn_7')]
// //             ]
// //         )
// //     }

// //     bot.on("message", async (ctx) => {
// //         console.log(`ctx.update ${ctx.update}`);
// //         const msgId = ctx.update.message.message_id;
// //         // const fromId = ctx.callbackQuery.from.id;
// //         const id = '573562828';

// //         console.log(`message_id ${msgId}`);

// //         try {         
// //                 if(ctx.message.reply_to_message 
// //                     && ctx.message.reply_to_message.forward_from 
// //                     && ctx.message.from.id === id) {
// //                     ctx.telegram.copyMessage(ctx.message.reply_to_message.forward_from.id, ctx.message);
// //                     console.log(`reply_to ${ctx.message.reply_to_message.forward_from.id}`);
// //                 } else {
// //                     await ctx.forwardMessage(id, msgId);
// //                 }
// //         } catch (e) {
// //             console.error(e)
// //         }
// //     })



// bot.launch()

// Подключаем модули
const Telegraf = require('telegraf');
// const HttpsProxyAgent = require('https-proxy-agent');
// Общие настройки
let config = {
    "token": process.env.BOT_TOKEN, // Токен бота
    "admin": 573562828 // id владельца бота
};
// Создаем объект бота
const bot = new Telegraf(config.token, {
        // Если надо ходить через прокси - укажите: user, pass, host, port
        // telegram: { agent: new HttpsProxyAgent('http://user:pass@host:port') }
    }
);
// Текстовые настройки
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser":  "Приветствую, отправьте мне сообщение. Постараюсь ответить в ближайшее время.",
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};
// Проверяем пользователя на права
let isAdmin = (userId) => {
    return userId == config.admin;
};
// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
    }
};
// Старт бота
bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id)
        ? replyText.helloAdmin
        : replyText.helloUser);
});
// Слушаем на наличие объекта message
bot.on('message', (ctx) => {
    // убеждаемся что это админ ответил на сообщение пользователя
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        // отправляем копию пользователю
        ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    } else {
        // перенаправляем админу
        forwardToAdmin(ctx);
    }
});
// запускаем бот
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))