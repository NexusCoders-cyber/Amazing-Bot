export default {
  config: { name: 'block', aliases: ['blk'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Block a user', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}block @mention' } },
  async onStart({ args, reply, sock, message }) {
const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!target) return reply('Mention the user to block.');
    try { await sock.updateBlockStatus(target, 'block'); reply('🚫 Blocked'); } catch (e) { reply('❌ ' + e.message); }
  },
};
