export default {
    config: {
        name: 'proscons',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .proscons <decision>|<pro1,pro2>|<con1,con2>nExample: .proscons Take the',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}proscons <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .proscons <decision>|<pro1,pro2>|<con1,con2>\nExample: .proscons Take the new job|higher pay,growth|longer commute');
            const parts = text.split('|');
            const decision = parts[0]?.trim() || 'Decision';
            const pros = (parts[1] || '').split(',').map(s => s.trim()).filter(Boolean);
            const cons = (parts[2] || '').split(',').map(s => s.trim()).filter(Boolean);
            reply(`⚖️ *${decision}*\n\n✅ Pros (${pros.length}):\n${pros.map(p => `+ ${p}`).join('\n') || 'none listed'}\n\n❌ Cons (${cons.length}):\n${cons.map(c => `- ${c}`).join('\n') || 'none listed'}\n\n${pros.length > cons.length ? '👉 Pros outweigh cons on count.' : cons.length > pros.length ? '👉 Cons outweigh pros on count.' : '👉 It\'s balanced — trust your gut on this one.'}`);
        
    },
};
