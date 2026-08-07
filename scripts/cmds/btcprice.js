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
                const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                reply(`₿ *Bitcoin*: $${data.bitcoin.usd.toLocaleString()} USD`);
            } catch (e) {
                reply('Could not fetch BTC price right now.');
            }
        
    },
};
