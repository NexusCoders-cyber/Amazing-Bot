export default {
  config: { name: 'setprefix', aliases: ['prefix'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Change the command prefix', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}setprefix <symbol>' } },
  async onStart({ args, reply, sock, message }) {
if (!args[0]) return reply('Usage: setprefix <symbol>');
    try { await import('../../config.js'); process.env.PREFIX = args[0]; reply('✅ Prefix set to: ' + args[0]); } catch (e) { reply('❌ ' + e.message); }
  },
};
