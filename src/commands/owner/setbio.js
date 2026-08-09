export default {
  config: { name: 'setbio', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set bot profile bio', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}setbio <text>' } },
  async onStart({ args, reply, sock, message }) {
if (!args[0]) return reply('Usage: setbio <text>');
    try { await sock.updateProfileStatus(args.join(' ')); reply('✅ Bio updated'); } catch (e) { reply('❌ ' + e.message); }
  },
};
