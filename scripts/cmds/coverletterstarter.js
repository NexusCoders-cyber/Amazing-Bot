export default {
    config: {
        name: 'coverletterstarter',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .coverletterstarter <role> <company>nExample: .coverletterstarter Softwa',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}coverletterstarter <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .coverletterstarter <role> <company>\nExample: .coverletterstarter Software Engineer Acme Inc');
            const company = args[args.length - 1];
            const role = args.slice(0, -1).join(' ');
            reply(`✉️ *Cover Letter Starter*\n\nDear Hiring Team at ${company},\n\nI'm excited to apply for the ${role} position. [Add 1-2 sentences on why this role/company excites you specifically.]\n\nIn my previous experience, I [specific achievement relevant to this role, with a number if possible]. I believe this makes me a strong fit for what you're looking for.\n\n[Add 1 paragraph connecting your background to their needs.]\n\nI'd welcome the chance to discuss how I can contribute to ${company}. Thank you for your consideration.\n\nBest regards,\n[Your name]`);
        
    },
};
