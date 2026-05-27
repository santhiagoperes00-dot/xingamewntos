const TelegramBot = require('node-telegram-bot-api');

const token = '8925041208:AAHP4_na2-fIa1hhQqPZH40v2UpJn0c4Sl8';
const OWNER_ID = 8308508544;

const bot = new TelegramBot(token, { polling: true });

const roasts = [
    "esse aqui ja deu muito o cu kkkk 💀",
    "esse foi molestado pelo Edson",
    "nem a mae desse quer ele em casa",
    "foi estudado pelo Epstein",
    "MEU PAU BATE NO UTERO DA TUA MINA"
];

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `🔥 Bot online.\n👑 Dono autorizado: ${OWNER_ID}`
    );
});

bot.onText(/\/roast(?: (.+))?/, (msg, match) => {

    if (msg.from.id !== OWNER_ID) {
        return bot.sendMessage(msg.chat.id, "❌ Só o dono pode usar seu fdp arrombado otario do crl.");
    }

    const alvo = match[1] || "alguém";
    const frase = roasts[Math.floor(Math.random() * roasts.length)];

    bot.sendMessage(
        msg.chat.id,
        `💀 ${alvo}, ${frase}`
    );
});

bot.on('polling_error', console.log);

console.log('Bot online.');
