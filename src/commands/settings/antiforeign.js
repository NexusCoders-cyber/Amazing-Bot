import { setSetting, getSetting } from '../../utils/threadsData.js';
export default {
  config: { name: 'antiforeign', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Block foreign numbers', category: 'settings', coolDown: 2, role: 0, guide: { en: '{prefix}antiforeign on/off' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await getSetting(from, 'antiforeign')) ?? false);
    await setSetting(from, 'antiforeign', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': Block foreign numbers');
  },
};
