export default {
  config: { name: 'hidetag', aliases: ['htag'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Tag all silently', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}hidetag <msg>' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { const meta = await sock.groupMetadata(from); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: args.join(' ')||'', mentions }); } catch (e) { reply('❌ ' + e.message); }
  },
};
