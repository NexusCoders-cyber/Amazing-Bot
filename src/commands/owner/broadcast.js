export default {
  config: { name: 'broadcast', aliases: ['bc', 'bcast'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Broadcast a message to all chats', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}broadcast <text>' } },
  async onStart({ args, reply, sock, message }) {
if (!args[0]) return reply('Usage: broadcast <text>');
    const txt = args.join(' ');
    const chats = sock.chats || [];
    let sent = 0;
    for (const c of chats.all?.() || []) { try { if (c.id?.endsWith('@g.us') || c.id?.endsWith('@s.whatsapp.net')) { await sock.sendMessage(c.id, { text: '📢 ' + txt }); sent++; } } catch {} }
    reply('📢 Sent to ' + sent + ' chats');
  },
};
