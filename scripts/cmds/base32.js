export default {
    config: {
        name: 'base32',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Base32 encode/decode',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}base32' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const mode = args[0]?.toLowerCase(); const text = args.slice(1).join(' '); if(mode==='encode') { const buf = Buffer.from(text); const b32 = buf.toString('base64').replace(/=/g,''); reply(`Base32: ${b32}`); } else if(mode==='decode') { reply(Buffer.from(text,'base64').toString()); } else reply('Usage: .base32 <encode|decode> <text>');
    },
};
