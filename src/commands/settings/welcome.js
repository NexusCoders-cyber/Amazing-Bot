import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'welcome', aliases: ['setwelcome'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Group welcome message', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}welcome on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'welcome')) ?? true);
    await threadsData.setSetting(from, 'welcome', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Group welcome message');
  },
};
