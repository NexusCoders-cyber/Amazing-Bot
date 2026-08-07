export default {
    config: {
        name: 'antispam2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle antispam',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}antispam2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const s = args[0]?.toLowerCase(); if(!['on','off'].includes(s)) return reply('Usage: .antispam on|off'); reply(`🛡️ Antispam: ${s==='on'?'✅ Enabled':'❌ Disabled'}`);
    },
};
