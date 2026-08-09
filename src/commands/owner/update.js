export default {
  config: { name: 'update', aliases: ['up'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Pull latest updates', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}update' } },
  async onStart({ args, reply, sock, message }) {
reply('🔄 Run git pull manually on the host to update.');
  },
};
