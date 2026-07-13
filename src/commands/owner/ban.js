import fs from 'fs-extra';
import path from 'path';

const STORE = path.join(process.cwd(), 'data', 'global_ban.json');
async function load() { try { return await fs.readJSON(STORE); } catch { return { users: [] }; } }
async function save(d) { await fs.ensureDir(path.dirname(STORE)); await fs.writeJSON(STORE, d, { spaces: 2 }); }

export async function isGlobalBanned(jid) {
    if (!global._globalBan) {
        global._globalBan = await load();
    }
    const num = jid.replace(/@s\.whatsapp\.net|@g\.us|@c\.us/g, '').split(':')[0];
    return (global._globalBan.users || []).includes(num);
}

export default {
    name: 'gban',
    aliases: ['globalban', 'gb'],
    category: 'owner',
    description: 'Globally ban a user from using the bot across all groups',
    usage: 'gban @user [reason]\ngban list\ngban remove @user',
    example: 'gban @user Spamming\ngban list\ngban remove @user',
    cooldown: 3,
    ownerOnly: true,
    args: false,

    async execute({ sock, message, args, from }) {
        const data = await load();
        if (!global._globalBan) global._globalBan = data;
        const sub = (args[0] || '').toLowerCase();

        if (sub === 'list') {
            if (!data.users.length) {
                return sock.sendMessage(from, { text: '📭 No globally banned users.' }, { quoted: message });
            }
            const list = data.users.map((u, i) => `${i + 1}. +${u}`).join('\n');
            return sock.sendMessage(from, {
                text: `🚫 *Globally Banned Users (${data.users.length})*\n\n${list}`
            }, { quoted: message });
        }

        const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        const targets = [...new Set([...mentions, quotedParticipant].filter(Boolean))];

        if (sub === 'remove' || sub === 'unban') {
            if (!targets.length) {
                return sock.sendMessage(from, { text: '❌ Mention or reply to a user to unban.' }, { quoted: message });
            }
            let removed = 0;
            for (const t of targets) {
                const num = t.replace(/@s\.whatsapp\.net|@c\.us/g, '').split(':')[0];
                const idx = data.users.indexOf(num);
                if (idx !== -1) { data.users.splice(idx, 1); removed++; }
            }
            await save(data);
            global._globalBan = data;
            return sock.sendMessage(from, {
                text: `✅ Removed ${removed} user(s) from global ban.`
            }, { quoted: message });
        }

        if (!targets.length) {
            return sock.sendMessage(from, {
                text: `*Global Ban*\n\n.gban @user [reason] — ban user\n.gban list — list banned users\n.gban remove @user — unban user`
            }, { quoted: message });
        }

        const reason = args.filter(a => !a.startsWith('@')).join(' ') || 'No reason given';
        let banned = 0;
        for (const t of targets) {
            const num = t.replace(/@s\.whatsapp\.net|@c\.us/g, '').split(':')[0];
            if (!data.users.includes(num)) { data.users.push(num); banned++; }
        }
        await save(data);
        global._globalBan = data;

        const mentionStr = targets.map(t => `@${t.split('@')[0]}`).join(', ');
        await sock.sendMessage(from, {
            text: `🚫 *Global Ban Applied*\n\n👤 User(s): ${mentionStr}\n📝 Reason: ${reason}\n\nThey can no longer use the bot in any group.`,
            mentions: targets
        }, { quoted: message });
    }
};
