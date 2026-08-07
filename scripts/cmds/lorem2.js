export default {
    config: {
        name: 'lorem2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate lorem ipsum',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lorem2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = Math.min(parseInt(args[0])||3, 10); const w = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' '); const p = Array.from({length:n},()=>Array.from({length:Math.floor(Math.random()*8)+4},()=>w[Math.floor(Math.random()*w.length)]).join(' ')); reply(`📝 *Lorem Ipsum:*
        
        ${p.join('.\n\n')}.`);
    },
};
