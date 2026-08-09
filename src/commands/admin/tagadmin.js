export default {
  config: { name: 'tagadmin', aliases: ['admin'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Tag all group admins', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}tagadmin <msg>' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
try { const meta = await sock.groupMetadata(from); const admins = (meta.participants||[]).filter(p => p.admin).map(p => p.id); if (!admins.length) return reply('No admins found.'); const txt = (args.join(' ')||'📢 Admins'); await sock.sendMessage(from, { text: txt, mentions: admins }); } catch (e) { reply('❌ ' + e.message); }
  },
};
