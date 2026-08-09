export default {
  config: { name: 'totalmembers', aliases: ['members'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Total group members', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}totalmembers' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { const meta = await sock.groupMetadata(from); reply('👥 ' + meta.participants.length + ' members'); } catch (e) { reply('❌ ' + e.message); }
  },
};
