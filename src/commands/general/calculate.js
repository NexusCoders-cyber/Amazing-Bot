import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'calculate', aliases: ['calc'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Calculate an expression', category: 'tools', coolDown: 3, role: 0, guide: { en: '{prefix}calculate 2+2' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🧮 Use: `calculate 2+2*3`');
    try { const expr = args.join(' ').replace(/[^0-9+\-*/.() ]/g,''); const val = Function('return (' + expr + ')')(); reply('🧮 ' + expr + ' = ' + val); } catch (e) { reply('❌ Invalid expression'); }
  },
};
