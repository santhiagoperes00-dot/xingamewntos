const TelegramBot = require('node-telegram-bot-api');

// Token e ID do Dono (Mantidos conforme original)
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

// Função para escolher um xingamento aleatório
const getRandomRoast = () => roasts[Math.floor(Math.random() * roasts.length)];

bot.onText(/\/start/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    bot.sendMessage(
        msg.chat.id,
        `🔥 **Bot de Xingamentos Ativado**\n\n` +
        `👑 Dono: \`${OWNER_ID}\`\n\n` +
        `**Comandos:**\n` +
        `1. \`/roast <alvo>\` - Xinga alguém no grupo atual.\n` +
        `2. \`/ataque <chat_id> <alvo>\` - Envia um xingamento para um grupo específico pelo ID (mesmo sem você estar lá, mas o bot precisa estar).\n` +
        `3. \`/spam <chat_id> <alvo> <vezes>\` - Envia vários xingamentos seguidos.`
    );
});

// Comando Roast Padrão
bot.onText(/\/roast(?: (.+))?/, (msg, match) => {
    if (msg.from.id !== OWNER_ID) {
        return bot.sendMessage(msg.chat.id, "❌ Só o dono pode usar seu fdp arrombado otario do crl.");
    }

    const alvo = match[1] || "alguém";
    bot.sendMessage(msg.chat.id, `💀 ${alvo}, ${getRandomRoast()}`).catch(e => console.log("Erro no roast:", e.message));
});

// Comando de Ataque Remoto (Funciona se o bot estiver no grupo alvo)
bot.onText(/\/ataque (\-?\d+) (.+)/, (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;

    const chatId = match[1];
    const alvo = match[2];

    bot.sendMessage(chatId, `💀 ${alvo}, ${getRandomRoast()}`)
        .then(() => bot.sendMessage(msg.chat.id, `✅ Ataque enviado para ${chatId}`))
        .catch(err => bot.sendMessage(msg.chat.id, `❌ Falha no ataque: ${err.message}\n(O bot pode ter sido banido ou não está no grupo)`));
});

// Comando de Spam
bot.onText(/\/spam (\-?\d+) (.+) (\d+)/, async (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;

    const chatId = match[1];
    const alvo = match[2];
    const vezes = Math.min(parseInt(match[3]), 10); // Limite de 10 para evitar flood block rápido

    bot.sendMessage(msg.chat.id, `🚀 Iniciando spam de ${vezes} mensagens em ${chatId}...`);

    for (let i = 0; i < vezes; i++) {
        await bot.sendMessage(chatId, `💀 ${alvo}, ${getRandomRoast()}`).catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay de 1s para não ser banido pelo Telegram instantaneamente
    }
    
    bot.sendMessage(msg.chat.id, `🏁 Spam finalizado em ${chatId}`);
});

// Tratamento de erros global para evitar que o bot caia
bot.on('polling_error', (error) => {
    console.log(`[ERRO] Polling: ${error.code} - ${error.message}`);
});

console.log('Bot rodando. Pronto para os xingamentos.');
