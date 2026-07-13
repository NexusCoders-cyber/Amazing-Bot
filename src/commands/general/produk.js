export default {
    name: 'produk', aliases: ['product', 'produkbot'], category: 'general',
    description: 'Bot product/package info', usage: 'produk', cooldown: 3,
    async execute({ sock, message, from }) {
        const contact = process.env.OWNER_CONTACT || 'Contact the owner for pricing';
        await sock.sendMessage(from, {
            text: `🛒 *Amazing-Bot Packages*\n\n1. Premium - Unlock all bug commands\n2. Source Code - Full bot source\n\n${contact}\n🔗 https://github.com/NexusCoders-cyber/Amazing-Bot`
        }, { quoted: message });
    }
};
