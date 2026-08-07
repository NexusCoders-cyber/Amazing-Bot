export default {
    config: {
        name: 'textart',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '✨ (づ｡◕‿‿◕｡)づ *${label.toUpperCase()}* ✨',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}textart <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const label = text || 'HELLO';
            reply(`✨ (づ｡◕‿‿◕｡)づ *${label.toUpperCase()}* ✨`);
        
    },
};
