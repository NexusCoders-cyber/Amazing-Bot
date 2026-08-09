export default {
  config: { name: 'demote', aliases: ['adminremove'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Remove admin from a member', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}demote @mention' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention the person to demote.'); try { await sock.groupParticipantsUpdate(from, [target], 'demote'); reply('⬇️ Demoted'); } catch (e) { reply('❌ ' + e.message); }
  },
};
