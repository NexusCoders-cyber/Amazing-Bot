export default {
  config: { name: 'setbotname', aliases: ['setname'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set bot profile name', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}setbotname <name>' } },
  async onStart({ args, reply, sock, message }) {
if (!args[0]) return reply('Usage: setbotname <name>');
    try { await sock.updateProfileName(args.join(' ')); reply('✅ Name updated'); } catch (e) { reply('❌ ' + e.message); }
  },
};
