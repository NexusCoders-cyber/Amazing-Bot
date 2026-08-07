export default {
    config: {
        name: 'regextest',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .regextest /pattern/flags|test stringnExample: .regextest /^[a-z]+$/i|He',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}regextest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .regextest /pattern/flags|test string\nExample: .regextest /^[a-z]+$/i|Hello');
            try {
                const [patternPart, testStr] = text.split('|');
                const match = patternPart.trim().match(/^\/(.*)\/([a-z]*)$/);
                if (!match) return reply('Pattern must be wrapped like /pattern/flags');
                const regex = new RegExp(match[1], match[2]);
                const result = regex.test(testStr);
                reply(`🧪 Pattern: ${patternPart}\nTest string: "${testStr}"\n\nMatch: ${result ? '✅ Yes' : '❌ No'}`);
            } catch (e) {
                reply('Invalid regex pattern.');
            }
        
    },
};
