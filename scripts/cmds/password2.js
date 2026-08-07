export default {
    config: {
        name: 'password2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate strong password',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}password2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const len = Math.min(parseInt(args[0])||20, 64); const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-='; const pass = Array.from({length:len}, ()=>chars[Math.floor(Math.random()*chars.length)]).join(''); reply(`🔑 *Password (${len} chars):*\n\`${pass}\`\n\nScore: ${len>=16?'🟢 Strong':len>=10?'🟡 Medium':'🔴 Weak'}`);
    },
};
