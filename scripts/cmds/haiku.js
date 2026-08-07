export default {
    config: {
        name: 'haiku',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random haiku',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}haiku <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const h = [['Old silent pond','A frog jumps into the pond','Splash! Silence again'],['Autumn moonlight—','A worm digs silently','Into the chestnut'],['In the twilight rain','These brilliant-hued hibiscus','A lovely sunset'],['Over the wintry','Forest winds wail with rage','With wait for spring']]; const [l1,l2,l3] = h[Math.floor(Math.random()*h.length)]; reply(`🌸 *Haiku:*\n\n${l1}\n${l2}\n${l3}`);
    },
};
