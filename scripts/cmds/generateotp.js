export default {
    config: {
        name: 'generateotp',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🔢 Your OTP: *${otp}*n(valid for demonstration purposes only)',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}generateotp <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const digits = Math.min(Math.max(parseInt(args[0]) || 6, 4), 10);
            const otp = Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join('');
            reply(`🔢 Your OTP: *${otp}*\n(valid for demonstration purposes only)`);
        
    },
};
