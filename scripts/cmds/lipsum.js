export default {
    config: {
        name: 'lipsum',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'lipsum',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lipsum <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const count = parseInt(args[0]) || 3;
            const sentences = [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
                "Excepteur sint occaecat cupidatat non proident, sunt in culpa."
            ];
            const out = [];
            for (let i = 0; i < Math.min(count, 20); i++) out.push(sentences[i % sentences.length]);
            reply(out.join(' '));
        
    },
};
