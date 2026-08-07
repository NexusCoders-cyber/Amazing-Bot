import { getStickerHashFromMessage } from '../../utils/stickerVault.js';

export function getStickerFingerprint(message) {
    try { return getStickerHashFromMessage(null, message); } catch { return null; }
}

export default {
    config: {
        name: 'setcmd',
        aliases: ['stickercmd'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Bind a command to a sticker',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}setcmd <command> - reply to a sticker' },
    },
    async onStart({ message, args, reply }) {
        const stickerMsg = message?.message?.stickerMessage;
        const quotedSticker = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
        if (!stickerMsg && !quotedSticker) return reply('Reply to a sticker or send a sticker with this command.');
        if (!args[0]) return reply('Specify a command name: setcmd <command>');
        return reply(`Sticker bound to command: ${args[0]}`);
    },
};
