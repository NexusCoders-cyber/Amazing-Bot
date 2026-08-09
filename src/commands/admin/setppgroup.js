export default {
  config: { name: 'setppgroup', aliases: ['setgrouppp', 'setgpic'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set group profile pic', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}setppgroup (reply to image)' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const img = message?.message?.imageMessage; if (!img) return reply('Reply to an image.'); try { const buffer = await sock.downloadMediaMessage(message); await sock.updateProfilePicture(from, buffer); reply('✅ Profile pic updated'); } catch (e) { reply('❌ ' + e.message); }
  },
};
