export default {
    config: {
        name: 'ethprice',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Ξ *Ethereum*: $${data.ethereum.usd.toLocaleString()} USD',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ethprice <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            try {
                const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                reply(`Ξ *Ethereum*: $${data.ethereum.usd.toLocaleString()} USD`);
            } catch (e) {
                reply('Could not fetch ETH price right now.');
            }
        
    },
};
