import asyncio
import random
from telethon import TelegramClient, events

# --- CONFIGURAÇÕES DO USUÁRIO ---
api_id = 31475441
api_hash = 'a361d643a7d2a35955afddaaa147bf70'
# --------------------------------

# Lista de xingamentos
roasts = [
    "esse aqui ja deu muito o cu kkkk 💀",
    "esse foi molestado pelo Edson",
    "nem a mae desse quer ele em casa",
    "foi estudado pelo Epstein",
    "MEU PAU BATE NO UTERO DA TUA MINA"
]

# Nome da sessão (vai criar um arquivo .session)
client = TelegramClient('sessao_xingamentos', api_id, api_hash)

@client.on(events.NewMessage(pattern=r'\.xinga (.*)'))
async def handler(event):
    # Só responde se for você mesmo mandando o comando
    if not event.out:
        return

    alvo = event.pattern_match.group(1)
    xingamento = random.choice(roasts)
    
    # Apaga o comando ".xinga" para ficar discreto
    await event.delete()
    
    # Envia o xingamento
    await event.respond(f"💀 {alvo}, {xingamento}")

@client.on(events.NewMessage(pattern=r'\.spam (\d+) (.*)'))
async def spam_handler(event):
    if not event.out:
        return

    try:
        vezes = int(event.pattern_match.group(1))
        alvo = event.pattern_match.group(2)
        
        await event.delete()
        
        # Limite de 15 mensagens para segurança
        for _ in range(min(vezes, 15)):
            xingamento = random.choice(roasts)
            await event.respond(f"💀 {alvo}, {xingamento}")
            await asyncio.sleep(0.8) # Delay curto para parecer rápido mas não ser banido na hora
            
    except Exception as e:
        print(f"Erro no spam: {e}")

print("--- USERBOT CONFIGURADO ---")
print("1. Execute este script: python userbot.py")
print("2. Digite o número de telefone da conta secundária.")
print("3. Digite o código que o Telegram enviar.")
print("4. No Telegram, digite .xinga @usuario em qualquer chat.")

client.start()
client.run_until_disconnected()
