import axios from 'axios';

export default {
    config: {
        name: 'cryptoprice',
        aliases: ['crypto', 'coincap'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Check current crypto price in USD',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}cryptoprice <coin>\nExample: {prefix}cryptoprice bitcoin' },
    },
    async onStart({ args, reply, React }) {
        React('💹');
        const coin = (args[0] || 'bitcoin').toLowerCase().trim();
        try {
            const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/trading/crypto/prices`, { params: { symbols: args[0] || '' }, timeout: 60000 });
            if (!data[coin]) return reply(`Couldn't find a coin called "${coin}". Try the full name, e.g. bitcoin, ethereum, dogecoin.`);
            reply(`💹 *${coin}*: $${data[coin].usd.toLocaleString()} USD`);
        } catch (err) {
            reply('Could not fetch crypto price right now.');
        }
    },
};
