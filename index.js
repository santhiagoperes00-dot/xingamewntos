const TelegramBot = require('node-telegram-bot-api');

const token = '8925041208:AAHP4_na2-fIa1hhQqPZH40v2UpJn0c4Sl8';
const OWNER_ID = 8308508544;

// Grupos que você quer atacar
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

// Comando para listar onde o bot está
bot.onText(/\/onde_estou/, async (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    
    bot.sendMessage(msg.chat.id, "🔍 Verificando grupos ativos...");
    
    let ativos = [];
    for (const id of TARGET_GROUPS) {
        try {
            const chat = await bot.getChat(id);
            ativos.push(`✅ **${chat.title || 'Grupo'}** (ID: \`${id}\`)`);
        } catch (e) {
            ativos.push(`❌ **Não encontrado** (ID: \`${id}\`) - O bot precisa ser adicionado aqui!`);
        }
    }
    
    bot.sendMessage(msg.chat.id, `📊 **Status dos Grupos Alvo:**\n\n${ativos.join('\n')}\n\n💡 **Dica:** Se o grupo estiver com ❌, adicione o bot no grupo e mande um /start lá.`);
});

// Comando de Ataque em Massa
bot.onText(/\/atacar_todos (.+)/, async (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;
    const alvo = match[1];
    
    bot.sendMessage(msg.chat.id, `🚀 Iniciando ataque em massa para: ${alvo}...`);
    
    for (const chatId of TARGET_GROUPS) {
        try {
            await bot.sendMessage(chatId, `💀 ${alvo}, ${getRandomRoast()}`);
            await bot.sendMessage(msg.chat.id, `✅ Sucesso no grupo \`${chatId}\``);
        } catch (err) {
            if (err.message.includes('chat not found')) {
                await bot.sendMessage(msg.chat.id, `❌ Erro no grupo \`${chatId}\`: O bot não está nesse grupo ou o ID está errado.`);
            } else {
                await bot.sendMessage(msg.chat.id, `❌ Erro no grupo \`${chatId}\`: ${err.message}`);
            }
        }
        await new Promise(r => setTimeout(r, 1000)); // Espera 1s entre grupos
    }
    
    bot.sendMessage(msg.chat.id, "🏁 Ataque finalizado.");
});

// Captura automática quando o bot é adicionado a um novo grupo
bot.on('new_chat_members', (msg) => {
    const botId = 8925041208; // ID do seu bot extraído do token
    const addedBot = msg.new_chat_members.find(m => m.id === botId);
    
    if (addedBot) {
        bot.sendMessage(OWNER_ID, `📢 **Fui adicionado a um novo grupo!**\n\n📌 Nome: ${msg.chat.title}\n🆔 ID: \`${msg.chat.id}\`\n\nAgora você pode usar /atacar_todos ou /spam aqui.`);
    }
});

// Comando padrão de xingamento
bot.onText(/\/roast(?: (.+))?/, (msg, match) => {
    if (msg.from.id !== OWNER_ID) return;
    const alvo = match[1] || "alguém";
    bot.sendMessage(msg.chat.id, `💀 ${alvo}, ${getRandomRoast()}`).catch(() => {});
});

bot.on('polling_error', (error) => console.log(`[Erro]: ${error.message}`));

console.log('Bot pronto para diagnóstico.');
