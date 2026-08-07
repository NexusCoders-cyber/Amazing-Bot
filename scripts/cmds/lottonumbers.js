export default {
    config: {
        name: 'lottonumbers',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎟️ Your lucky numbers: ${[...nums].sort((a, b) => a - b).join(', ')}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lottonumbers <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const nums = new Set();
            while (nums.size < 6) nums.add(Math.floor(Math.random() * 49) + 1);
            reply(`🎟️ Your lucky numbers: ${[...nums].sort((a, b) => a - b).join(', ')}`);
        
    },
};
