export default {
  config: { name: 'promote', aliases: ['adminadd'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Make a member admin', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}promote @mention' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention the person to promote.'); try { await sock.groupParticipantsUpdate(from, [target], 'promote'); reply('⬆️ Promoted'); } catch (e) { reply('❌ ' + e.message); }
  },
};
