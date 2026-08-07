export default {
    config: {
        name: 'rgb2hex',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .rgb2hex <r 0-255> <g 0-255> <b 0-255>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rgb2hex <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const [r, g, b] = args.map(Number);
            if ([r, g, b].some(v => isNaN(v) || v < 0 || v > 255)) return reply('Usage: .rgb2hex <r 0-255> <g 0-255> <b 0-255>');
            const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
            reply(`🎨 ${hex}`);
        
    },
};
