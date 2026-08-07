export default {
    config: {
        name: 'currency2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .currency2 <amount> <from> <to>nExample: .currency2 100 USD EUR',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}currency2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .currency2 <amount> <from> <to>\nExample: .currency2 100 USD EUR');
            const amount = parseFloat(args[0]);
            const from = args[1].toUpperCase();
            const to = args[2].toUpperCase();
            if (isNaN(amount)) return reply('Please provide a valid amount.');
            try {
                const { data } = await axios.get(`https://open.er-api.com/v6/latest/${from}`);
                if (!data.rates || !data.rates[to]) return reply(`Could not find exchange rate for ${from} → ${to}.`);
                const result = amount * data.rates[to];
                reply(`💱 ${amount} ${from} = *${result.toFixed(2)} ${to}*`);
            } catch (e) {
                reply('Could not fetch exchange rates right now.');
            }
        
    },
};
