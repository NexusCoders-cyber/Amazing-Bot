export default {
    config: {
        name: 'shell2',
        aliases: ['exec'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Execute shell command',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}shell2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const { execSync } = require('child_process'); try { const out = execSync(args.join(' '), {timeout: 10000}).toString(); reply(out.substring(0,1900)); } catch(e) { reply(`❌ ${e.message}`); }
    },
};
