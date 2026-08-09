import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'alwaysonline', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Always show online', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}alwaysonline on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'alwaysonline')) ?? true);
    await threadsData.setSetting(from, 'alwaysonline', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Always show online');
  },
};
