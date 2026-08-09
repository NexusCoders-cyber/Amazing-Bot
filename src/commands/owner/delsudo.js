import { removeSudoer } from '../../utils/sessionControl.js';
import { isTopOwner } from '../../utils/privilegedUsers.js';

export default {
  config: {
    name: 'delsudo',
    aliases: ['removesudo', 'unsudo'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Remove a sudo user (owner only)',
    category: 'owner',
    coolDown: 3,
    role: 2,
    guide: { en: '{prefix}delsudo <phone or mention>' },
  },
  async onStart({ args, reply, message, sender }) {
    if (!isTopOwner(sender)) return reply('❌ Owner only command.');
    const mention = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message?.message?.extendedTextMessage?.contextInfo?.participant;
    const target = args[0] || (mention ? mention.split('@')[0] : '');
    const num = String(target).replace(/[^0-9]/g, '');
    if (!num || num.length < 7) return reply('📱 Usage: `delsudo <phone number or @mention>`');
    await removeSudoer(num);
    return reply('✅ Removed sudo: +' + num);
  },
};
