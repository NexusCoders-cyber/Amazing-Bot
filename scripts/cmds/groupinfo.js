import moment from 'moment';
export default {
    config: { name: 'groupinfo', aliases: ['gcinfo', 'ginfo', 'gi'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Show group information', category: 'admin', coolDown: 5, role: 0,
        guide: { en: '{prefix}groupinfo' } },
    async onStart({ sock, message, from, reply, isGroup }) {
        if (!isGroup) return reply('Group only command.');
        const meta = await sock.groupMetadata(from);
        const admins = meta.participants.filter(p => p.admin).length;
        reply([
            `Group Info`,
            ``,
            `Name    : ${meta.subject}`,
            `ID      : ${from.split('@')[0]}`,
            `Created : ${moment(meta.creation * 1000).format('DD/MM/YYYY')}`,
            `Members : ${meta.participants.length}`,
            `Admins  : ${admins}`,
            `Desc    : ${meta.desc ? meta.desc.slice(0, 100) : 'None'}`,
        ].join('\n'));
    },
};
