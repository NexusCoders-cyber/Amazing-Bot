export default {
    config: {
        name: 'compliment',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'compliment',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}compliment <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const target = args.join(' ') || 'you';
            const lines = [
                `${target} lights up every room without even trying.`,
                `${target} has the kind of energy people remember.`,
                `${target} makes hard things look easy.`,
                `${target} is proof that good people still exist.`,
                `${target} has impeccable taste — clearly, since they're here.`
            ];
            reply(lines[Math.floor(Math.random() * lines.length)]);
        
    },
};
