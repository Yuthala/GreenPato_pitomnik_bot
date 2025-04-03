const { Telegraf, Markup } = require('telegraf')
//const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

// Общие настройки
let config = {
    "token": "YOUR_TOKEN", // Токен бота
    "admin": 573562828 // id владельца бота
};
 
// Текстовые настройки
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser":  "Здесь вы можете ознакомиться с нашим ассортиментом и актуальными ценами, разместить заказ или задать вопрос.",
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

const bot = new Telegraf(process.env.BOT_TOKEN)

// bot.start((ctx) => ctx.reply(
// `Добро пожаловать ${isAdmin(ctx.message.from.id) ? replyText.helloAdmin : ctx.message.from.first_name }! Вас приветствует питомник луковичных Green Pato.`,
// getMainMenu()))

bot.command('start', async (ctx) => {
            await ctx.reply(`${isAdmin(ctx.message.from.id) ? replyText.helloAdmin : ctx.message.from.first_name }! Вас приветствует питомник луковичных Green Pato.`);

       setTimeout(async() => {
            await ctx.reply('Здесь вы можете ознакомиться с нашим ассортиментом и актуальными ценами, разместить заказ или задать вопрос.')
            
        }, 1000);

        setTimeout(async()=> {
            await ctx.reply('Какой вопрос вас интересует?', getMainMenu())
        }, 3500)
        
      
    } 
)

bot.command


bot.help((ctx) => ctx.reply(text.commands))

// Если вызывать меню по команде /ask
    bot.command('ask', async (ctx) => {
        try {
       await ctx.replyWithHTML('<b>Вопросы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Предзаказ на 2025', 'btn_1')],
                [Markup.button.callback('Чеснок', 'btn_2')],
                [Markup.button.callback('Лук', 'btn_3')],
                [Markup.button.callback('Шалот', 'btn_4')],
                [Markup.button.callback('Доставка и оплата', 'btn_5')],
                [Markup.button.callback('Написать сообщение', 'btn_6')]
            ]
        ))
    
        } catch(e) {
            console.error(e)
        }
        
    })

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

// Если вызывать меню по команде /start 
    function getMainMenu() {
        return Markup.inlineKeyboard(
            [
                [Markup.button.callback('Предзаказ на 2025', 'btn_1')],
                [Markup.button.callback('Чеснок', 'btn_2')],
                [Markup.button.callback('Лук', 'btn_3')],
                [Markup.button.callback('Шалот', 'btn_4')],
                [Markup.button.callback('Доставка и оплата', 'btn_5')],
                [Markup.button.callback('Сделать заказ', 'btn_6')],
                [Markup.button.callback('Написать сообщение', 'btn_7')]
            ]
        )
    }

// Функция вызова кнопки "Сделать заказ"
function makeOrderButton() {
    return Markup.inlineKeyboard(
        [Markup.button.callback('Сделать заказ', 'btn_6')]
    )
}


function addActionBot(name, src, text) {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
          await ctx.replyWithHTML(text, {
            disable_web_page_preview: true
          }) 
        } catch (e) {
            console.error(e)
        }
    })
}

function btn_1Action(name,text) {
bot.action(name, async (ctx) => {
    try {
        await ctx.reply(text, makeOrderButton())
    } catch (e) {
        console.log(e)
    }
})
}

//addActionBot('btn_1',false, text.btn_1Text)
btn_1Action('btn_1',text.btn_1Text)
addActionBot('btn_2',false, text.btn_2Text)
addActionBot('btn_3',false, text.btn_3Text)
addActionBot('btn_4',false, text.btn_4Text)
addActionBot('btn_5',false, text.btn_5Text)
addActionBot('btn_6',false, text.btn_6Text)
addActionBot('btn_7',false, text.btn_7Text)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))