export default {
    config: {
        name: 'thisorthat',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🤔 ${pairs[Math.floor(Math.random() * pairs.length)]}',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}thisorthat <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const pairs = [
                'Coffee or tea?', 'Beach or mountains?', 'Morning person or night owl?',
                'Sweet or savory?', 'Books or movies?', 'Summer or winter?'
            ];
            reply(`🤔 ${pairs[Math.floor(Math.random() * pairs.length)]}`);
        
    },
};
