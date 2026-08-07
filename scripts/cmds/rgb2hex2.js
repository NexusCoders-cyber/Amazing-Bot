export default {
    config: {
        name: 'rgb2hex2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert RGB to hex',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rgb2hex2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [r,g,b] = args.map(Number); if(args.length<3||isNaN(r)) return reply('Usage: .rgb2hex 255 87 51'); reply(`Hex: #${[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}`);
    },
};
