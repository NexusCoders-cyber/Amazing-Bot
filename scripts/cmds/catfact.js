export default {
    config: {
        name: 'catfact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🐱 ${data.fact}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}catfact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            try {
                const { data } = await axios.get('https://catfact.ninja/fact');
                reply(`🐱 ${data.fact}`);
            } catch (e) {
                reply('🐱 Cats spend nearly 70% of their lives sleeping.');
            }
        
    },
};
