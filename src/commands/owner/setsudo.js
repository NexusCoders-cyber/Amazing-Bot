// setsudo — owner command to manage sudo users (self-contained, no cross-imports).
import { addSudoer, removeSudoer } from '../../utils/sessionControl.js';
import { isTopOwner, getTopOwnerNumbers } from '../../utils/privilegedUsers.js';

export default {
  config: {
    name: 'setsudo',
    aliases: ['addsudo', 'sudo', 'removesudo'],
    author: 'Broken_vzn',
    version: '1.1',
    shortDescription: 'Add or remove a sudo user (owner only)',
    category: 'owner',
    coolDown: 3,
    role: 2,
    guide: { en: '{prefix}setsudo add <phone|@mention>\n{prefix}setsudo remove <phone|@mention>' },
  },
  async onStart({ args, reply, message, sender }) {
    if (!isTopOwner(sender)) return reply('❌ Owner only command.');
    const mention = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message?.message?.extendedTextMessage?.contextInfo?.participant;
    const sub = (args[0] || '').toLowerCase();
    const target = (sub === 'add' || sub === 'remove') ? args[1] : args[0];
    const num = String(target || (mention ? mention.split('@')[0] : '')).replace(/[^0-9]/g, '');
    if (!num || num.length < 7) return reply('📱 Usage: `setsudo <phone or @mention>` or `setsudo add/remove <phone>`');
    if (getTopOwnerNumbers().includes(num)) return reply('⚠️ That number is already a top owner.');
    if (sub === 'remove') { await removeSudoer(num); return reply('✅ Removed sudo: +' + num); }
    await addSudoer(num);
    return reply('✅ Added sudo: +' + num);
  },
};
