const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Добро пожаловать ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}! Какой вопрос вас интересует?`,getMainMenu()))
bot.help((ctx) => ctx.reply(text.commands))
// bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
//bot.hears('hi', (ctx) => ctx.reply('Hey there')) // Проверка текста напечатанного пользователем?


// Если вызывать меню по команде /ask
    bot.command('ask', async (ctx) => {
        try {
       await ctx.replyWithHTML('<b>Вопросы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Аренда не завершилась', 'btn_1')],
                [Markup.button.callback('Депозит не вернулся', 'btn_2')],
                [Markup.button.callback('Тарифы и условия аренды(Частые вопросы)', 'btn_3')],
                [Markup.button.callback('Сотрудничество', 'btn_4')],
                [Markup.button.callback('Аккумулятор не заряжает', 'btn_5')],
                [Markup.button.callback('Аккумулятор не вышел из слота', 'btn_6')],
                [Markup.button.callback('Аккумулятор увезен/утерян/украден', 'btn_7')]
            ]
        ))
    
        } catch(e) {
            console.error(e)
        }
        
    })

// Если вызывать меню по команде /start 
    function getMainMenu() {
        return Markup.inlineKeyboard(
            [
                [Markup.button.callback('Аренда не завершилась', 'btn_1')],
                [Markup.button.callback('Депозит не вернулся', 'btn_2')],
                [Markup.button.callback('Тарифы и условия аренды(Частые вопросы)', 'btn_3')],
                [Markup.button.callback('Сотрудничество', 'btn_4')],
                [Markup.button.callback('Аккумулятор не заряжает', 'btn_5')],
                [ Markup.button.callback('Аккумулятор не вышел из слота', 'btn_6')],
                [Markup.button.callback('Аккумулятор увезен/утерян/украден', 'btn_7')]
            ]
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
addActionBot('btn_1',false, text.btn_1Text)
addActionBot('btn_2',false, text.btn_2Text)
addActionBot('btn_3',false, text.btn_3Text)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))