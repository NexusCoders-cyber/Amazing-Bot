export default {
    config: {
        name: 'base16',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Hex encode/decode',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}base16' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const mode = args[0]?.toLowerCase(); const text = args.slice(1).join(' '); if(mode==='encode') reply(`0x${Buffer.from(text).toString('hex')}`); else if(mode==='decode') reply(Buffer.from(text.replace('0x',''),'hex').toString()); else reply('Usage: .base16 <encode|decode> <text>');
    },
};
