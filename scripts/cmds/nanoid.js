export default {
    config: {
        name: 'nanoid',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🆔 ${id}',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}nanoid <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const len = Math.min(Math.max(parseInt(args[0]) || 21, 4), 64);
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
            let id = '';
            const bytes = crypto.randomBytes(len);
            for (let i = 0; i < len; i++) id += chars[bytes[i] % chars.length];
            reply(`🆔 ${id}`);
        
    },
};
