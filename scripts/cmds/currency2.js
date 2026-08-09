import axios from 'axios';

export default {
    config: {
        name: 'currency2',
        aliases: ['fx', 'exchange'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert currency between two codes',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}currency2 <amount> <FROM> <TO>' },
    },
    async onStart({ args, reply, React }) {
        React('💱');
        const amount = parseFloat(args[0]);
        const fromCur = args[1]?.toUpperCase();
        const toCur = args[2]?.toUpperCase();
        if (!amount || !fromCur || !toCur) return reply('Usage: .currency2 <amount> <FROM> <TO>\nExample: .currency2 100 USD EUR');

        try {
            const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/tools/currency`, { timeout: 30000 });
            const rate = data.rates?.[toCur];
            if (!rate) return reply(`❌ Unknown currency: ${toCur}`);
            const result = (amount * rate).toFixed(2);
            reply(`💱 *${amount.toLocaleString()} ${fromCur}* = *${result} ${toCur}*\n\nRate: 1 ${fromCur} = ${rate.toFixed(4)} ${toCur}`);
        } catch (err) {
            reply('❌ Could not fetch exchange rates right now.');
        }
    },
};
