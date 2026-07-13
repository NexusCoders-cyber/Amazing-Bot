import config from '../../config.js';

export default {
    name: 'creato', aliases: ['creator', 'ownerinfo'], category: 'general',
    description: 'Bot creator information', usage: 'creato', cooldown: 3,
    async execute({ sock, message, from }) {
        const ownerContact = process.env.OWNER_CONTACT || 'Contact the owner via WhatsApp';
        await sock.sendMessage(from, {
            text: `🤖 *${config.botName || 'Amazing-Bot'}*\n\n👑 Creator: Ilom\n💻 Version: ${config.version || '2.0.0'}\n🔗 GitHub: https://github.com/NexusCoders-cyber/Amazing-Bot\n\n${ownerContact}\n\nPowered by Amazing-Bot Engine`
        }, { quoted: message });
    }
};
