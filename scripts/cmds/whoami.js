import axios from 'axios';

export default {
    config: {
        name: 'whoami',
        aliases: ['myinfo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Show your user info',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}whoami' },
    },

    async onStart({ reply, sender, pushName, isGroup, isGroupAdmin, isBotAdmin, isOwner, prefix, React }) {
        React('ℹ️');

        const phone = sender.replace(/[^0-9]/g, '').split(':')[0];
        const roles = [];
        if (isOwner) roles.push('👑 Bot Owner');
        if (isGroupAdmin) roles.push('🛡️ Group Admin');
        if (isBotAdmin) roles.push('🤖 Bot Admin');
        if (!roles.length) roles.push('👤 User');

        let text = `━━━━━━━━━━━━━━━━━━━━\n  ℹ️ *USER INFO*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `  👤 Name: *${pushName || 'Unknown'}*\n`;
        text += `  📱 Number: *${phone}*\n`;
        text += `  🏷️ JID: \`${sender}\`\n`;
        text += `  📍 Type: ${isGroup ? '👥 Group' : '💬 Private'}\n`;
        text += `  🎭 Roles: ${roles.join(', ')}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━`;

        reply(text);
    },
};
