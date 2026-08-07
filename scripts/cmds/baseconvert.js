export default {
    config: {
        name: 'baseconvert',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .baseconvert <number> <from_base> <to_base>nExample: .baseconvert 255 10',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}baseconvert <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .baseconvert <number> <from_base> <to_base>\nExample: .baseconvert 255 10 16');
            const [num, fromBase, toBase] = args;
            try {
                const decimal = parseInt(num, parseInt(fromBase));
                if (isNaN(decimal)) return reply('Invalid number for that base.');
                reply(`🔢 ${num} (base ${fromBase}) = *${decimal.toString(parseInt(toBase))}* (base ${toBase})`);
            } catch (e) {
                reply('Conversion failed. Bases must be between 2 and 36.');
            }
        
    },
};
