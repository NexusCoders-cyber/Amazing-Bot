export default {
    config: {
        name: 'compatibility',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Check compatibility',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}compatibility <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const r = Math.floor(Math.random()*101); reply(`💕 Compatibility: *${r}%*
        ${r>80?'💍 Perfect match!':r>60?'😊 Great match!':r>40?'🤔 Could work...':'😬 Not great...'}`);
    },
};
