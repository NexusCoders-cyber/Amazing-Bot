export default {
    config: { name: 'leave', aliases: ['leavegroup'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Make the bot leave the group', category: 'owner', coolDown: 5, role: 2,
        guide: { en: '{prefix}leave' } },
    async onStart({ sock, from, reply, isGroup }) {
        if (!isGroup) return reply('Run this inside the group you want me to leave.');
        await reply('Goodbye everyone!');
        await new Promise(r => setTimeout(r, 1500));
        try { await sock.groupLeave(from); } catch {}
    },
};
