export default {
  config: { name: 'unblock', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Unblock a user', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}unblock @mention' } },
  async onStart({ args, reply, sock, message }) {
const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!target) return reply('Mention the user to unblock.');
    try { await sock.updateBlockStatus(target, 'unblock'); reply('✅ Unblocked'); } catch (e) { reply('❌ ' + e.message); }
  },
};
