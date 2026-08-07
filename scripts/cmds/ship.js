const HEARTS = ['❤️', '💕', '💗', '💖', '💘', '💝'];

export default {
    config: {
        name: 'ship',
        aliases: ['love', 'shipping'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Ship two users and see their love compatibility',
        category: 'fun',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}ship @user1 @user2 (or just reply to someone)' },
    },
    async onStart({ message, sender, from, reply, sock }) {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quoted = message.message?.extendedTextMessage?.contextInfo?.participant;

        let user1, user2;
        if (mentioned.length >= 2) {
            user1 = mentioned[0]; user2 = mentioned[1];
        } else if (mentioned.length === 1 && quoted) {
            user1 = quoted; user2 = mentioned[0];
        } else if (quoted && !mentioned.length) {
            user1 = sender; user2 = quoted;
        } else {
            return reply('Tag two people to ship them! 💕\nUsage: ship @user1 @user2');
        }

        const p1 = user1.split('@')[0];
        const p2 = user2.split('@')[0];
        const percent = Math.floor(Math.random() * 101);
        const heart = HEARTS[Math.floor(Math.random() * HEARTS.length)];

        let verdict;
        if (percent >= 90) verdict = '💍 Perfect match! Get married already!';
        else if (percent >= 70) verdict = '💕 Strong chemistry here!';
        else if (percent >= 50) verdict = '😊 There\'s something going on...';
        else if (percent >= 30) verdict = '😬 Just friends, maybe?';
        else verdict = '💀 Oil and water.';

        const bar = '█'.repeat(Math.round(percent / 5)) + '░'.repeat(20 - Math.round(percent / 5));

        await sock.sendMessage(from, {
            text: [
                `${heart} *SHIP CALCULATOR* ${heart}`,
                '',
                `@${p1}  ×  @${p2}`,
                '',
                `Compatibility: *${percent}%*`,
                `\`${bar}\``,
                '',
                verdict,
            ].join('\n'),
            mentions: [user1, user2],
        }, { quoted: message });
    },
};
