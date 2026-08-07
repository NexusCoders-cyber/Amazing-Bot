export default {
    config: {
        name: 'lifehack',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💡 ${hacks[Math.floor(Math.random() * hacks.length)]}',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lifehack <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const hacks = [
                "Write tomorrow's top 3 tasks before you go to bed tonight.",
                "Keep a glass of water by your bed — hydration first thing helps focus.",
                "Use the 2-minute rule: if a task takes under 2 minutes, do it now.",
                "Batch similar small tasks together instead of switching between them.",
                "Put your phone in another room while doing focused work."
            ];
            reply(`💡 ${hacks[Math.floor(Math.random() * hacks.length)]}`);
        
    },
};
