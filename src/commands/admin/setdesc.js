export default {
  config: { name: 'setdesc', aliases: ['setdesc'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set group description', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}setdesc <text>' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
if (!args[0]) return reply('Usage: setdesc <text>'); try { await sock.groupUpdateDescription(from, args.join(' ')); reply('✅ Description updated'); } catch (e) { reply('❌ ' + e.message); }
  },
};
