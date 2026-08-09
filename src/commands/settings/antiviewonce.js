import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'antiviewonce', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Detect view-once messages', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}antiviewonce on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'antiviewonce')) ?? false);
    await threadsData.setSetting(from, 'antiviewonce', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Detect view-once messages');
  },
};
