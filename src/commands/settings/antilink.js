import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'antilink', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Anti-link protection', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}antilink on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'antilink')) ?? true);
    await threadsData.setSetting(from, 'antilink', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Anti-link protection');
  },
};
