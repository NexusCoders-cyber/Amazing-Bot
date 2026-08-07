export default {
    config: {
        name: 'uuid3',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate multiple UUIDs',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}uuid3' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = Math.min(parseInt(args[0])||5, 20); const uuids = Array.from({length:n}, ()=> 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16)})); reply(`🆔 *${n} UUIDs:*\n\n${uuids.map(u=>`\`${u}\``).join('\n')}`);
    },
};
