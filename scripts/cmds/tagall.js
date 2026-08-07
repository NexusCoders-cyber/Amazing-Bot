export default {
    config: { name: 'tagall', aliases: ['everyone', 'all', 'mentionall'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Tag all members in the group', category: 'admin', coolDown: 10, role: 1,
        guide: { en: '{prefix}tagall [message]' } },
    async onStart({ sock, message, args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const meta = await sock.groupMetadata(from);
        const members = meta.participants.map(p => p.id);
        const msg = args.join(' ') || 'Attention!';
        const tags = members.map(m => `@${m.split('@')[0]}`).join(' ');
        sock.sendMessage(from, { text: `${msg}\n\n${tags}`, mentions: members }, { quoted: message });
    },
};
