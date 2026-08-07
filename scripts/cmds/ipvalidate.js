export default {
    config: {
        name: 'ipvalidate',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .ipvalidate <ip address>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ipvalidate <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .ipvalidate <ip address>');
            const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
            const isValidV4 = ipv4.test(text) && text.split('.').every(o => parseInt(o) <= 255);
            const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
            if (isValidV4) return reply(`✅ *${text}* is a valid IPv4 address.`);
            if (ipv6.test(text)) return reply(`✅ *${text}* is a valid IPv6 address.`);
            reply(`❌ *${text}* is not a valid IP address.`);
        
    },
};
