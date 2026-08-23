import fs from 'fs-extra';
import threadsData from '../../src/utils/threadsData.js';

const LIST_TEXT_LIMIT = 3500;

function toGroupJid(input) {
    const raw = String(input || '').trim();
    if (raw.endsWith('@g.us')) return raw;
    const digits = raw.replace(/[^0-9-]/g, '');
    return digits ? `${digits}@g.us` : null;
}

async function fetchAllGroups(sock) {
    const groups = new Map();
    if (global._botGroupCache?.size) {
        for (const [jid] of global._botGroupCache) {
            if (jid.endsWith('@g.us')) groups.set(jid, null);
        }
    }
    try {
        const raw = await Promise.race([
            sock.groupFetchAllParticipating(),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
        ]);
        for (const [jid, meta] of Object.entries(raw || {})) {
            if (jid.endsWith('@g.us')) groups.set(jid, meta);
        }
    } catch {}
    return groups;
}

export default {
    config: {
        name: 'thread',
        aliases: ['gclist', 'threads'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'List, inspect, or leave the group threads the bot belongs to',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '.thread list | .thread info <gc_jid> | .thread leave [gc_jid] | .thread count' },
    },

    async onStart({ sock, args, from, isGroup, reply }) {
        const sub = (args[0] || 'list').toLowerCase();

        if (sub === 'count') {
            const groups = await fetchAllGroups(sock);
            return reply(`📊 The bot is currently in *${groups.size}* group thread(s).`);
        }

        if (sub === 'list') {
            const groups = await fetchAllGroups(sock);
            if (!groups.size) return reply('📭 The bot is not in any group threads yet.');

            const lines = [];
            let i = 1;
            for (const [jid, meta] of groups) {
                const name = meta?.subject || (await threadsData.get(jid))?.threadName || 'Unknown';
                const memberCount = meta?.participants?.length;
                lines.push(`${i}. ${name}${memberCount ? ` (${memberCount} members)` : ''}\n   ${jid}`);
                i++;
            }

            const header = `📋 Group Threads (${groups.size})\n${'─'.repeat(15)}\n`;
            const body = header + lines.join('\n\n');

            if (body.length <= LIST_TEXT_LIMIT) return reply(body);

            const filePath = '/tmp/thread-list.txt';
            await fs.writeFile(filePath, body, 'utf-8');
            return sock.sendMessage(from, {
                document: await fs.readFile(filePath),
                fileName: 'thread-list.txt',
                mimetype: 'text/plain',
                caption: `📋 ${groups.size} group thread(s) — sent as a file since the list is long.`
            });
        }

        if (sub === 'info') {
            const target = toGroupJid(args[1]) || (isGroup ? from : null);
            if (!target) return reply('⚠️ Provide a group JID or run this inside the group: .thread info <gc_jid>');
            try {
                const meta = await sock.groupMetadata(target);
                const admins = meta.participants.filter(p => p.admin).length;
                return reply([
                    `ℹ️ Thread Info`,
                    `📛 Name    : ${meta.subject}`,
                    `🆔 JID     : ${target}`,
                    `👥 Members : ${meta.participants.length}`,
                    `👑 Admins  : ${admins}`,
                    `📝 Desc    : ${meta.desc ? meta.desc.slice(0, 150) : 'None'}`,
                ].join('\n'));
            } catch (err) {
                return reply(`❌ Could not fetch that thread.\n⚠️ ${err.message}`);
            }
        }

        if (sub === 'leave' || sub === 'out') {
            const target = toGroupJid(args[1]) || (isGroup ? from : null);
            if (!target) return reply('⚠️ Provide a group JID or run this inside the group you want left: .thread leave <gc_jid>');

            let name = target;
            try { name = (await sock.groupMetadata(target)).subject; } catch {}

            try {
                if (target === from) await reply(`👋 Leaving "${name}" now, goodbye!`);
                await sock.groupLeave(target);
                if (target !== from) await reply(`✅ Left thread "${name}" (${target}).`);
            } catch (err) {
                await reply(`❌ Could not leave that thread.\n⚠️ ${err.message}`);
            }
            return;
        }

        return reply('❓ Usage: .thread list | .thread info <gc_jid> | .thread leave [gc_jid] | .thread count');
    },
};
