import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'antidelete', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Detect deleted messages', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}antidelete on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'antidelete')) ?? true);
    await threadsData.setSetting(from, 'antidelete', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Detect deleted messages');
  },
};
