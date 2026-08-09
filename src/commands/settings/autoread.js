import { setSetting, getSetting } from '../../utils/threadsData.js';
export default {
  config: { name: 'autoread', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Auto-read messages', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}autoread on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await getSetting(from, 'autoread')) ?? true);
    await setSetting(from, 'autoread', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Auto-read messages');
  },
};
