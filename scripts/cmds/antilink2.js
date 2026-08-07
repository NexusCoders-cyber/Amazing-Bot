export default {
    config: {
        name: 'antilink2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle antilink',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}antilink2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const s = args[0]?.toLowerCase(); if(!['on','off'].includes(s)) return reply('Usage: .antilink on|off'); reply(`🛡️ Antilink: ${s==='on'?'✅ Enabled':'❌ Disabled'}`);
    },
};
