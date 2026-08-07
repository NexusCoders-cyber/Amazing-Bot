import fs from 'fs-extra';
import path from 'path';
import usersData from '../../src/utils/usersData.js';

const FILE = path.join(process.cwd(), 'data', 'warnings.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }
function key(group, user) { return `${group.split('@')[0]}::${user.split('@')[0].split(':')[0]}`; }

export default {
    config: {
        name: 'warn',
        aliases: ['warning', 'w'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Warn a group member (3 warnings = kick)',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}warn @user [reason] | {prefix}warn reset @user | {prefix}warn list' },
    },

    async onStart({ sock, message, args, from, sender, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('❌ Group only.');
        if (!isGroupAdmin) return reply('❌ Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const quoted = message.message?.extendedTextMessage?.contextInfo;
        const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (sub === 'list') {
            const d = load();
            const gid = from.split('@')[0];
            const groupWarns = Object.entries(d).filter(([k]) => k.startsWith(gid + '::'));
            if (!groupWarns.length) return reply('📋 No warnings in this group.');
            const list = await Promise.all(groupWarns.map(async ([k, v]) => {
                const phone = k.split('::')[1];
                const user = await usersData.get(phone);
                const label = user?.name ? `${user.name} (+${phone})` : `+${phone}`;
                return `• ${label} — ${v.count} warn${v.count !== 1 ? 's' : ''}`;
            }));
            return reply(`📋 *Warning List:*\n${list.join('\n')}`);
        }
        if (sub === 'reset') {
            const target = quoted?.participant || mentions[0];
            if (!target) return reply('❌ Mention someone to reset warnings.');
            const k = key(from, target);
            delete load()[k];
            save();
            return reply(`✅ Warnings reset for @${target.split('@')[0]}.`);
        }

        const target = sub.startsWith('@') ? mentions[0] : (quoted?.participant || mentions[0]);
        if (!target) return reply('❌ Reply to or mention someone to warn.');
        const reason = (sub.startsWith('@') ? args.slice(1) : args.slice(1)).join(' ') || 'No reason given';

        const d = load();
        const k = key(from, target);
        if (!d[k]) d[k] = { count: 0, reasons: [] };
        d[k].count++;
        d[k].reasons.push(reason);
        save();

        const count = d[k].count;
        await reply(`⚠️ Warning ${count}/3`);

        if (count >= 3) {
            delete d[k]; save();
            try { await sock.groupParticipantsUpdate(from, [target], 'remove'); }
            catch {}
            return sock.sendMessage(from, { text: `🚫 @${target.split('@')[0]} has been kicked after 3 warnings!`, mentions: [target] }, { quoted: message });
        }
        sock.sendMessage(from, {
            text: `⚠️ *Warning ${count}/3*\n\n@${target.split('@')[0]} — ${reason}\n\n${count === 2 ? '🔴 One more warning = kick!' : ''}`,
            mentions: [target]
        }, { quoted: message });
    },
};
