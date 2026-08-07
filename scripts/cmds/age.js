export default {
    config: {
        name: 'age',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .age YYYY-MM-DD',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}age <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const input = args[0];
            if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return reply('Usage: .age YYYY-MM-DD');
            const birth = new Date(input);
            if (isNaN(birth.getTime())) return reply('Invalid date. Use format YYYY-MM-DD.');
            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            const monthDiff = now.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--;
            reply(`🎂 You are ${years} years old.`);
        
    },
};
