import axios from 'axios';
export default {
    config: {
        name: 'btcprice',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '₿ *Bitcoin*: $${data.bitcoin.usd.toLocaleString()} USD',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}btcprice <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            try {
                const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/trading/crypto`, { params: { symbol: args[0] || '' }, timeout: 60000 });
                reply(`₿ *Bitcoin*: $${data.bitcoin.usd.toLocaleString()} USD`);
            } catch (e) {
                reply('Could not fetch BTC price right now.');
            }
        
    },
};
