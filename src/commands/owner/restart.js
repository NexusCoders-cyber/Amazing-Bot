export default {
  config: { name: 'restart', aliases: ['reboot'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Restart the bot', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}restart' } },
  async onStart({ args, reply, sock, message }) {
reply('🔄 Restarting...');
    process.exit(0);
  },
};
