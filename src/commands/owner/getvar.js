export default {
  config: { name: 'getvar', aliases: ['getenv'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get an env variable', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}getvar <KEY>' } },
  async onStart({ args, reply, sock, message }) {
if (!args[0]) return reply('Usage: getvar KEY');
    reply('🔑 ' + args[0] + ' = ' + (process.env[args[0]] || '(not set)'));
  },
};
