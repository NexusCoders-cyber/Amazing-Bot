export default {
  config: { name: 'leave', aliases: ['leavegroup'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Leave the group', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}leave' } },
  async onStart({ args, reply, sock, message }) {
const from = message?.key?.remoteJid;
    try { await sock.groupLeave(from); } catch (e) { reply('❌ ' + e.message); }
  },
};
