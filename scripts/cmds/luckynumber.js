export default {
    config: {
        name: 'luckynumber',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🍀 Your lucky number today is: *${number}*',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}luckynumber <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const seed = sender.split('@')[0];
            let hash = 0;
            for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
            const dayFactor = new Date().getDate();
            const number = ((hash + dayFactor) % 99) + 1;
            reply(`🍀 Your lucky number today is: *${number}*`);
        
    },
};
