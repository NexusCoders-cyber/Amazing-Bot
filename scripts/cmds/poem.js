export default {
    config: {
        name: 'poem',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate random poem',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}poem <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const lines = ['Roses are red,','Violets are blue,','Sugar is sweet,','And so are you.','The sun rises high,','The moon glows bright,','Stars fill the sky,','On every night.','Wind blows softly,','Rain falls gently,','Nature speaks loudly,','If you listen intently.']; reply(`📖 *Random Poem:*\n\n${lines.slice(0,4).join('\n')}\n\n${lines.slice(4,8).join('\n')}`);
    },
};
