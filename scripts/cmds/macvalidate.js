export default {
    config: {
        name: 'macvalidate',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .macvalidate <mac address>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}macvalidate <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .macvalidate <mac address>');
            const mac = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;
            reply(mac.test(text) ? `✅ *${text}* is a valid MAC address.` : `❌ *${text}* is not a valid MAC address.`);
        
    },
};
