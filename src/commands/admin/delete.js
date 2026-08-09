export default {
  config: { name: 'delete', aliases: ['del', 'removemsg'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Delete a bot message', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}delete (reply to message)' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const key = message?.message?.extendedTextMessage?.contextInfo?.stanzaId; if (!key) return reply('Reply to a message to delete.'); try { await sock.sendMessage(from, { delete: { remoteJid: from, id: key, participant: message?.message?.extendedTextMessage?.contextInfo?.participant } }); } catch (e) { reply('❌ ' + e.message); }
  },
};
