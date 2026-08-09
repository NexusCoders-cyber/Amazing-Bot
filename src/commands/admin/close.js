export default {
  config: { name: 'close', aliases: ['lockgroup'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Close group (admin only can send)', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}close' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { await sock.groupSettingUpdate(from, 'announcement'); reply('🔒 Group closed'); } catch (e) { reply('❌ ' + e.message); }
  },
};
