import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'goodbye', aliases: ['setgoodbye'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Group goodbye message', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}goodbye on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'goodbye')) ?? true);
    await threadsData.setSetting(from, 'goodbye', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Group goodbye message');
  },
};
