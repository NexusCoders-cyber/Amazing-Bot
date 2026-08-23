import { getSessionControl, updateSessionControl } from '../../src/utils/sessionControl.js';
import threadsData from '../../src/utils/threadsData.js';
import config from '../../src/config.js';

const BOLD_SANS_A = 0x1D5D4;
const BOLD_SANS_a = 0x1D5EE;
const BOLD_SANS_0 = 0x1D7EC;
const BOLD_ITALIC_A = 0x1D63C;
const BOLD_ITALIC_a = 0x1D656;

function styleChar(ch, upperBase, lowerBase, digitBase) {
    const code = ch.codePointAt(0);
    if (ch >= 'A' && ch <= 'Z') return String.fromCodePoint(upperBase + (code - 65));
    if (ch >= 'a' && ch <= 'z') return String.fromCodePoint(lowerBase + (code - 97));
    if (digitBase && ch >= '0' && ch <= '9') return String.fromCodePoint(digitBase + (code - 48));
    return ch;
}

function boldSans(str) {
    return [...str].map(ch => styleChar(ch, BOLD_SANS_A, BOLD_SANS_a, BOLD_SANS_0)).join('');
}

function boldItalicSans(str) {
    return [...str].map(ch => styleChar(ch, BOLD_ITALIC_A, BOLD_ITALIC_a)).join('');
}

function splitBotName(name) {
    const m = name.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
    if (m) return [m[1], m[2]];
    if (/\s/.test(name)) {
        const parts = name.trim().split(/\s+/);
        return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
    }
    const mid = Math.ceil(name.length / 2);
    return [name.slice(0, mid), name.slice(mid)];
}

function extractText(message) {
    const m = message?.message || {};
    return m.conversation
        || m.extendedTextMessage?.text
        || m.imageMessage?.caption
        || m.videoMessage?.caption
        || '';
}

function stylizedBotName() {
    const [first, second] = splitBotName(config.botName || 'AmazingBot');
    return `${boldItalicSans(first)}𖣘${boldItalicSans(second)}࿐`;
}

function buildDisplay(systemPrefix, boxPrefix) {
    return [
        `Hey, ${stylizedBotName()} speaking!🔥`,
        `⚙ ${boldSans('System Prefix')}:- *${systemPrefix}*`,
        `🛸 ${boldSans('Box Chat Prefix')}:- *${boxPrefix}*`,
        `Remember this doesn't require the use of prefix.`
    ].join('\n');
}

export default {
    config: {
        name: 'prefix',
        aliases: ['setprefix'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'View or change the bot prefix for this chat',
        category: 'general',
        coolDown: 3,
        role: 0,
        noPrefix: true,
        guide: { en: '{prefix}prefix (view) | {prefix}prefix <new_prefix> (change) | {prefix}prefix reset' },
    },

    async onStart({ sock, message, args, from, isGroup, isGroupAdmin, isOwner, isSudo, reply, prefix }) {
        const session = await getSessionControl(sock);
        const systemPrefix = session.prefix || config.prefix;

        const thread = isGroup ? await threadsData.get(from) : null;
        const boxPrefix = thread?.data?.prefix || systemPrefix;

        if (!args.length) {
            return reply(buildDisplay(systemPrefix, boxPrefix));
        }

        const rawText = extractText(message).trim();
        const wasPrefixed = rawText.startsWith(boxPrefix) && boxPrefix.length > 0;

        if (!wasPrefixed) {
            return reply(`⚠️ To change the prefix you must use the current one.\nExample: ${boxPrefix}prefix ${args[0]}`);
        }

        const canManage = isOwner || isSudo || (isGroup && isGroupAdmin);
        if (!canManage) {
            return reply(isGroup
                ? '🚫 Only a group admin or bot owner can change the prefix here.'
                : '🚫 Only the bot owner can change the prefix here.');
        }

        const sub = args[0].toLowerCase();

        if (sub === 'reset') {
            if (isGroup) {
                await threadsData.set(from, null, 'data.prefix');
                return reply(`♻️ Box chat prefix reset to system default: *${systemPrefix}*`);
            }
            return reply(`ℹ️ This chat already uses the system prefix: *${systemPrefix}*`);
        }

        const newPrefix = args[0].trim().slice(0, 5);
        if (!newPrefix || /\s/.test(newPrefix)) return reply('⚠️ Invalid prefix.');

        if (isGroup) {
            await threadsData.set(from, newPrefix, 'data.prefix');
            return reply(`✅ Box chat prefix for this group changed to *${newPrefix}*\n⚙ System prefix remains *${systemPrefix}*`);
        }

        await updateSessionControl(sock, { prefix: newPrefix });
        reply(`✅ System prefix changed from *${systemPrefix}* to *${newPrefix}*`);
    },
};
