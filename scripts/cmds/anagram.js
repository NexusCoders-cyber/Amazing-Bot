export default {
    config: {
        name: 'anagram',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .anagram <word1>|<word2>nChecks if two words are anagrams of each other.',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}anagram <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .anagram <word1>|<word2>\nChecks if two words are anagrams of each other.');
            const [a, b] = text.split('|').map(s => s.trim().toLowerCase().replace(/[^a-z]/g, ''));
            const sort = s => s.split('').sort().join('');
            const isAnagram = sort(a) === sort(b) && a.length > 0;
            reply(isAnagram ? `✅ Yes, "${a}" and "${b}" are anagrams!` : `❌ No, "${a}" and "${b}" are not anagrams.`);
        
    },
};
