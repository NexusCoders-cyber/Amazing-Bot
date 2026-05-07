import logger from '../utils/logger.js';

export default async function handleMessageReaction(sock, reactions) {
    try {
        if (!reactions) return;

        const reactionList = Array.isArray(reactions) ? reactions : [reactions];

        for (const reaction of reactionList) {
            try {
                let messageId, from, sender, reactionEmoji;

                if (reaction.key) {
                    messageId = reaction.key.id;
                    from = reaction.key.remoteJid;
                    sender = reaction.key.participant || reaction.key.remoteJid;
                    reactionEmoji = reaction.reaction?.text || reaction.text;
                } else if (reaction.reaction) {
                    messageId = reaction.reaction.key?.id;
                    from = reaction.reaction.key?.remoteJid || reaction.key?.remoteJid;
                    sender = reaction.participant || reaction.reaction.key?.participant || from;
                    reactionEmoji = reaction.reaction.text;
                } else {
                    continue;
                }

                if (!reactionEmoji || !messageId) continue;

                logger.debug(`Reaction received: ${reactionEmoji} on message ${messageId} by ${sender}`);

                if (global.reactHandlers && global.reactHandlers[messageId]) {
                    const reactHandler = global.reactHandlers[messageId];
                    if (typeof reactHandler.handler === 'function') {
                        const reactorNum = String(sender || '').split(':')[0];
                        await reactHandler.handler(reactionEmoji, reactorNum);
                    }
                }
            } catch (innerErr) {
                logger.error('Error processing single reaction:', innerErr);
            }
        }
    } catch (error) {
        logger.error('Reaction handling error:', error);
    }
}
