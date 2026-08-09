import { addSudoer } from '../../src/utils/sessionControl.js';
import { isTopOwner, getTopOwnerNumbers } from '../../src/utils/privilegedUsers.js';

export default {
  config: {
    name: 'addsudo',
    aliases: ['sudo', 'addsudoer'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Add a sudo user (owner only)',
    category: 'owner',
    coolDown: 3,
    role: 2,
    guide: { en: '{prefix}addsudo <phone or mention>' },
  },
  async onStart({ args, reply, message, sock, sender }) {
    if (!isTopOwner(sender)) return reply('❌ Owner only command.');
    // get target from mention or args
    const mention = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message?.message?.extendedTextMessage?.contextInfo?.participant;
    const target = args[0] || (mention ? mention.split('@')[0] : '');
    const num = String(target).replace(/[^0-9]/g, '');
    if (!num || num.length < 7) return reply('📱 Usage: `addsudo <phone number or @mention>`');
    if (getTopOwnerNumbers().includes(num)) return reply('⚠️ That number is already a top owner.');
    await addSudoer(num);
    return reply('✅ Added sudo: +' + num);
  },
};
