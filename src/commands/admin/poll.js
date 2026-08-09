export default {
  config: { name: 'poll', aliases: ['createpoll'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Create a group poll', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}poll question | opt1 | opt2' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
const parts = args.join(' ').split('|').map(s => s.trim()); if (parts.length < 3) return reply('Usage: poll question | option1 | option2'); const options = parts.slice(1); if (options.length > 10) return reply('Max 10 options.'); try { await sock.sendMessage(from, { poll: { name: parts[0], values: options, selectableCount: 1 } }); } catch (e) { reply('❌ ' + e.message); }
  },
};
