export default {
  config: { name: 'open', aliases: ['unlockgroup'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Open group (all can send)', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}open' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { await sock.groupSettingUpdate(from, 'not_announcement'); reply('🔓 Group opened'); } catch (e) { reply('❌ ' + e.message); }
  },
};
