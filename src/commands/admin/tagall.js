export default {
  config: { name: 'tagall', aliases: ['mentionall', 'all'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Tag all group members', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}tagall <message>' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { const meta = await sock.groupMetadata(from); const txt = (args.join(' ')||'📢 @everyone'); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: txt, mentions }); } catch (e) { reply('❌ ' + e.message); }
  },
};
