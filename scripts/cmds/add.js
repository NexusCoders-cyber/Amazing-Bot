export default {
    config: { name: 'add', aliases: ['addmember'], author: 'Raphael Ilom', version: '1.0',
        shortDescription: 'Add a member to the group', category: 'admin', coolDown: 5, role: 1,
        guide: { en: '{prefix}add <phone number>' } },
    async onStart({ sock, message, args, from, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only command.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need admin rights.');
        if (!args[0]) return reply('Usage: add <phone number>\nExample: add 2348012345678');
        const phone = args[0].replace(/[^0-9]/g, '');
        const jid = phone + '@s.whatsapp.net';
        try {
            const [res] = await sock.groupParticipantsUpdate(from, [jid], 'add');
            const status = res?.status;
            if (status === '200') return reply(`@${phone} has been added.`);
            if (status === '403') return reply(`@${phone} has privacy settings preventing being added.`);
            if (status === '408') return reply(`@${phone} is not on WhatsApp.`);
            reply(`Could not add @${phone}. Status: ${status}`);
        } catch { reply('Failed to add member.'); }
    },
};
