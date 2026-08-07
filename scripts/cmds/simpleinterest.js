export default {
    config: {
        name: 'simpleinterest',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .simpleinterest <principal> <rate%> <years>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}simpleinterest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const principal = parseFloat(args[0]);
            const rate = parseFloat(args[1]);
            const years = parseFloat(args[2]);
            if (!principal || !rate || !years) return reply('Usage: .simpleinterest <principal> <rate%> <years>');
            const interest = (principal * rate * years) / 100;
            reply(`💰 Interest: ${interest.toFixed(2)}\nTotal after ${years} years: ${(principal + interest).toFixed(2)}`);
        
    },
};
