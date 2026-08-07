export default {
    config: {
        name: 'dare',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Truth or dare - dare',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dare <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const d = ['Send a voice note singing','Change your profile pic for 1 hour','Send your last photo in camera roll','Type with your nose for 3 messages','Send a message to your crush','Post a status saying I love bots']; reply(`🔥 *Dare:*
        ${d[Math.floor(Math.random()*d.length)]}`);
    },
};
