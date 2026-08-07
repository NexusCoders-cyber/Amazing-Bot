export default {
    config: {
        name: 'cryptoprice',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Couldn't find a coin called "${coin}". Try the full name, e.g. bitcoin, ethereum',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}cryptoprice <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const coin = (args[0] || 'bitcoin').toLowerCase();
            try {
                const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
                if (!data[coin]) return reply(`Couldn't find a coin called "${coin}". Try the full name, e.g. bitcoin, ethereum, dogecoin.`);
                reply(`💹 *${coin}*: $${data[coin].usd.toLocaleString()} USD`);
            } catch (e) {
                reply('Could not fetch crypto price right now.');
            }
        
    },
};
