export default {
    config: {
        name: 'typecheck',
        aliases: ['tc'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Check typing speed result',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}typecheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = global._typetest?.[from]; if(!t) return reply('Start with .typetest'); const elapsed = (Date.now()-t.time)/1000; delete global._typetest[from]; reply(`⌨️ *Result:*\nTime: ${elapsed.toFixed(2)}s\nWord: ${t.word}\nWPM: ~${Math.round((t.word.length/5)/(elapsed/60))}`);
    },
};
