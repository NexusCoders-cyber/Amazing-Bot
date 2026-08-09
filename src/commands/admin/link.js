export default {
  config: { name: 'link', aliases: ['grouplink', 'invite'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get group invite link', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}link' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { const code = await sock.groupInviteCode(from); reply('🔗 https://chat.whatsapp.com/' + code); } catch (e) { reply('❌ ' + e.message); }
  },
};
