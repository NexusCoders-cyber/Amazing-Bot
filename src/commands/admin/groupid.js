export default {
  config: { name: 'groupid', aliases: ['gid'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get group ID', category: 'admin', coolDown: 3, role: 1, guide: { en: '{prefix}groupid' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
reply('🆔 ' + from);
  },
};
