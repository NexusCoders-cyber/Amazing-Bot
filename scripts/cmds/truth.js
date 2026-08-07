export default {
    config: {
        name: 'truth',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Truth or dare - truth',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}truth <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = ['What is your biggest fear?','What is your most embarrassing moment?','What is your crush name?','What is the last lie you told?','What is your secret talent?','What is your biggest regret?']; reply(`🩷 *Truth:*
        ${t[Math.floor(Math.random()*t.length)]}`);
    },
};
