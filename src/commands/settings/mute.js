import threadsData from '../../utils/threadsData.js';
export default {
  config: { name: 'mute', aliases: ['mutegroup'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Mute the group', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}mute on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await threadsData.getSetting(from, 'mute')) ?? false);
    await threadsData.setSetting(from, 'mute', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Mute the group');
  },
};
