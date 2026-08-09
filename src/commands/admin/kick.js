export default {
  config: { name: 'kick', aliases: ['remove', 'rm'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Remove a member', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}kick @mention or reply' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention or reply to the person to kick.'); try { await sock.groupParticipantsUpdate(from, [target], 'remove'); reply('👢 Kicked'); } catch (e) { reply('❌ ' + e.message); }
  },
};
