export default {
    config: {
        name: 'uuid2',
        aliases: ['uid2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate UUID v4',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}uuid2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0; return(c==='x'?r:(r&0x3|0x8)).toString(16)}); reply(`🆔 \`${u}\`\n\`${u}\`\n\`${u}\`');
    },
};
