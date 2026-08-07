export default {
    config: {
        name: 'palindrome',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .palindrome <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}palindrome <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .palindrome <text>');
            const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
            const isPalindrome = clean === clean.split('').reverse().join('');
            reply(isPalindrome ? '✅ That is a palindrome!' : '❌ Not a palindrome.');
        
    },
};
