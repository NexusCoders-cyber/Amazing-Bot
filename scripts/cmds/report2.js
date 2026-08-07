export default {
    config: {
        name: 'report2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Report to admins',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}report2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; const r = args.filter(a=>!a.startsWith('@')).join(' ')||'No reason'; reply(`🚨 *Report:*\nTarget: ${t?'@'+t.split('@')[0]:'N/A'}\nReason: ${r}\n\nAdmins will review.`, {mentions:t?[t]:[]});
    },
};
