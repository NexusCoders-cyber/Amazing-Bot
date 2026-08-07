export default {
    config: {
        name: 'passwordstrength',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .passwordstrength <password>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}passwordstrength <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .passwordstrength <password>');
            let score = 0;
            if (text.length >= 8) score++;
            if (text.length >= 12) score++;
            if (/[a-z]/.test(text) && /[A-Z]/.test(text)) score++;
            if (/[0-9]/.test(text)) score++;
            if (/[^a-zA-Z0-9]/.test(text)) score++;
            const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
            reply(`🔒 Password strength: *${labels[score]}* (${score}/5)`);
        
    },
};
