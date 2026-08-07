export default {
    config: {
        name: 'throw',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Throw something',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}throw <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const thing = args.join(' '); const outcomes = ['and it lands perfectly! 🎯','and it crashes into a wall! 💥','and it flies away into the sky! 🦅','and a bird catches it! 🐦','and it bounces back at you! 😂','and it disappears! 👻']; reply(`🏹 You threw *${thing}* ${outcomes[Math.floor(Math.random()*outcomes.length)]}`);
    },
};
