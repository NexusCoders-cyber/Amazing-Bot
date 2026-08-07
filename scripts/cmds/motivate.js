export default {
    config: {
        name: 'motivate',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💪 ${lines[Math.floor(Math.random() * lines.length)]}',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}motivate <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const lines = [
                'Small steps every day add up to big change.',
                "You don't have to be perfect, you just have to start.",
                'Progress, not perfection.',
                'The only bad workout is the one that did not happen.',
                'Discipline is choosing what you want most over what you want now.'
            ];
            reply(`💪 ${lines[Math.floor(Math.random() * lines.length)]}`);
        
    },
};
