// setsudo — owner command to manage sudo users (combines addsudo/delsudo).
// Kept for compatibility with older configs that reference setsudo.js.
import addsudo from './addsudo.js';
import delsudo from './delsudo.js';

export default {
  config: {
    name: 'setsudo',
    aliases: ['addsudo', 'sudo'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Add a sudo user (alias of addsudo)',
    category: 'owner',
    coolDown: 3,
    role: 2,
    guide: { en: '{prefix}setsudo <phone or mention>' },
  },
  async onStart(ctx) {
    return addsudo.onStart(ctx);
  },
};
