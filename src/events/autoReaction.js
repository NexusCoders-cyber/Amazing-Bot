import logger from '../utils/logger.js';
import config from '../config.js';

const autoReactKeywords = {
    '❤️': ['love', 'heart', 'cute', 'beautiful', 'amazing'],
    '😂': ['haha', 'lol', 'funny', 'lmao', 'rofl', '😂', '🤣'],
    '🔥': ['fire', 'hot', 'lit', 'awesome', 'dope'],
    '👏': ['congrats', 'congratulations', 'well done', 'applause', 'bravo'],
    '💯': ['perfect', '100', 'exactly', 'facts', 'true'],
    '🎉': ['party', 'celebrate', 'birthday', 'anniversary', 'yay'],
    '😍': ['gorgeous', 'stunning', 'lovely', 'pretty'],
    '💪': ['strong', 'power', 'strength', 'motivation', 'gym'],
    '🙏': ['thank', 'thanks', 'grateful', 'appreciate', 'bless'],
    '⚡': ['energy', 'electric', 'shock', 'lightning', 'fast'],
    '✨': ['sparkle', 'shine', 'magic', 'magical', 'special'],
    '🎯': ['goal', 'target', 'aim', 'bullseye', 'perfect'],
    '💎': ['diamond', 'precious', 'valuable', 'gem', 'treasure'],
    '🌟': ['star', 'superstar', 'shine', 'bright', 'excellent'],
    '👑': ['king', 'queen', 'royal', 'crown', 'boss'],
    '🚀': ['rocket', 'launch', 'space', 'speed', 'fast'],
    '💰': ['money', 'cash', 'rich', 'profit', 'win'],
    '🎵': ['music', 'song', 'melody', 'tune', 'beat'],
    '📚': ['book', 'study', 'learn', 'education', 'knowledge'],
    '☕': ['coffee', 'tea', 'drink', 'morning', 'caffeine']
};

export default async function handleAutoReaction(sock, message) {
    try {
        if (!config.events?.autoReaction) return;

        const messageText = message.message?.conversation
            || message.message?.extendedTextMessage?.text
            || '';

        if (!messageText || messageText.trim().length === 0) return;

        const from = message.key.remoteJid;
        if (!from || from === 'status@broadcast') return;

        const messageKey = message.key;
        if (!messageKey?.id) return;

        const lowerText = messageText.toLowerCase();

        for (const [emoji, keywords] of Object.entries(autoReactKeywords)) {
            let matched = false;
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    matched = true;
                    break;
                }
            }
            if (matched) {
                try {
                    await sock.sendMessage(from, {
                        react: { text: emoji, key: messageKey }
                    });
                } catch (error) {
                    logger.debug(`Auto-reaction failed: ${error.message}`);
                }
                return;
            }
        }

        if (message.message?.imageMessage || message.message?.videoMessage || message.message?.documentMessage) {
            try {
                await sock.sendMessage(from, {
                    react: { text: '📎', key: messageKey }
                });
            } catch {}
        }

    } catch (error) {
        logger.error('Error in autoReaction event:', error);
    }
}
