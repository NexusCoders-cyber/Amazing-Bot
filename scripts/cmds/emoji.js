export default {
    config: {
        name: 'emoji',
        aliases: ['randemoji'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random emoji picker',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emoji <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const e = ['😂','😍','🥳','🤔','😎','🤯','💀','👻','🤡','💀','🔥','✨','💯','🎉','🦄','🌈','⭐','🌟','💫','🎯','🎨','🎪','🎭','🎤','🎵','🎶','🎸','🎹','🎺','🎻','🎲','♟️','🏆','🥇','🎖️','🏅','⚽','🏀','🏈','⚾','🎾','🏐','🎱','🏓','🏸','🥊','🥋','🎮','🕹️','👾','🤖','🛸','🚀','✈️','🚗','🏎️','🚂','🚢']; reply(e.sort(() => Math.random()-0.5).slice(0,10).join(' '));
    },
};
