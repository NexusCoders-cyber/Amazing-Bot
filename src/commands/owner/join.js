export default {
  config: { name: 'join', aliases: ['joingroup'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Join a group via invite code', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}join <invite code or link>' } },
  async onStart({ args, reply, sock, message }) {
const link = args[0] || ''; const code = link.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/)?.[1] || link;
    if (!code) return reply('Send an invite link or code.');
    try { await sock.groupAcceptInvite(code); reply('✅ Joined group'); } catch (e) { reply('❌ ' + e.message); }
  },
};
