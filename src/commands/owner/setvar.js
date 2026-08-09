export default {
  config: { name: 'setvar', aliases: ['setenv'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set an env variable', category: 'owner', coolDown: 2, role: 2, guide: { en: '{prefix}setvar KEY=value' } },
  async onStart({ args, reply, sock, message }) {
const eq = args.join(' ').indexOf('='); if (eq < 0) return reply('Usage: setvar KEY=value');
    const k = args.join(' ').slice(0, eq).trim(), v = args.join(' ').slice(eq + 1).trim();
    process.env[k] = v; reply('✅ ' + k + ' = ' + v);
  },
};
