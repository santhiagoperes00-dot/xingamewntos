const TelegramBot = require('node-telegram-bot-api');

const token = '8925041208:AAHP4_na2-fIa1hhQqPZH40v2UpJn0c4Sl8';
const OWNER_ID = 8308508544;

// Lista de grupos alvo fornecidos pelo usuário
const TARGET_GROUPS = [
    "-1002104174391",
    "-1003310008289",
    "-1003134663443"
];

const bot = new TelegramBot(token, { polling: true });

const roasts = [
    "esse aqui ja deu muito o cu kkkk 💀",
    "esse foi molestado pelo Edson",
    "nem a mae desse quer ele em casa",
    "foi estudado pelo Epstein",
    "MEU PAU BATE NO UTERO DA TUA MINA"
];

const getRandomRoast = () => roasts[Math.floor(Math.random() * roasts.length)];

// Função para tentar enviar mensagem para múltiplos grupos (Broadcast)
async function attackAll(alvo) {
    let results = [];
    for (const chatId of TARGET_GROUPS) {
        try {
            await bot.sendMessage(chatId, `💀 ${alvo}, ${getRandomRoast()}`);
            results.push(`✅ Enviado para ${chatId}`);
        } catch (err) {
            results.push(`❌ Erro em ${chatId}: ${err.message}`);
        }
    }
    return results.join('\n');
}

bot.onText(/\/start/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    bot.sendMessage(msg.chat.id, 
        "🔥 **Bot de Ataque Total**\n\n" +
        "Comandos atualizados:\n" +
        "1. `/roast <alvo>` - Xinga no grupo atual.\n" +
        "2. `/atacar_todos <alvo>` - Manda xingamento em TODOS os grupos da sua lista.\n" +
        "3. `/spam <chat_id> <alvo> <vezes>` - Spam em um grupo específico."
    );
});

// Comando Roast (Melhorado para responder mesmo se não for comando /)
bot.on('message', (msg) => {
    if (!msg.text) return;
    
    // Se o dono mandar algo que comece com @ no grupo, o bot xinga (opcional, mas ajuda se o / falhar)
    if (msg.from.id === OWNER_ID && msg.text.startsWith('@')) {
        bot.sendMessage(msg.chat.id, `💀 ${msg.text}, ${getRandomRoast()}`).catch(() => {});
    }
});

bot.onText(/\/roast(?: (.+))?/, (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;
    const alvo = match[1] || "alguém";
    bot.sendMessage(msg.chat.id, `💀 ${alvo}, ${getRandomRoast()}`).catch(e => {
        bot.sendMessage(msg.chat.id, `❌ Não consegui xingar aqui: ${e.message}`);
    });
});

bot.onText(/\/atacar_todos (.+)/, async (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;
    const alvo = match[1];
    bot.sendMessage(msg.chat.id, `🚀 Iniciando ataque em massa para: ${alvo}...`);
    const report = await attackAll(alvo);
    bot.sendMessage(msg.chat.id, `📊 **Relatório de Ataque:**\n${report}`);
});

bot.onText(/\/spam (\-?\d+) (.+) (\d+)/, async (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;
    const chatId = match[1];
    const alvo = match[2];
    const vezes = Math.min(parseInt(match[3]), 20);

    bot.sendMessage(msg.chat.id, `💣 Bombardeando ${chatId}...`);
    for (let i = 0; i < vezes; i++) {
        await bot.sendMessage(chatId, `💀 ${alvo}, ${getRandomRoast()}`).catch(() => {});
        await new Promise(r => setTimeout(r, 800));
    }
    bot.sendMessage(msg.chat.id, `✅ Bombardeio finalizado.`);
});

bot.on('polling_error', (error) => console.log(`[Erro]: ${error.message}`));

console.log('Bot atualizado e rodando.');
