import fs from 'fs-extra';
import path from 'path';

const STORE = path.join(process.cwd(), 'data', 'threads.json');
async function loadStore() { try { return await fs.readJSON(STORE); } catch { return {}; } }
async function saveStore(d) { await fs.ensureDir(path.dirname(STORE)); await fs.writeJSON(STORE, d, { spaces: 2 }); }

export default {
    name: 'thread',
    aliases: ['threads', 'gc', 'gclist', 'grouplist'],
    category: 'owner',
    description: 'Manage all group threads the bot is in',
    usage: 'thread [list|count|info|send|kick|leave|mute|unmute|save]',
    example: 'thread list\nthread count\nthread info\nthread send Hello!\nthread kick @user\nthread leave <jid>\nthread mute\nthread unmute\nthread save',
    cooldown: 5,
    ownerOnly: true,
    args: false,

    async execute({ sock, message, args, from, prefix }) {
        const sub = (args[0] || 'list').toLowerCase();
        const isGroup = from.endsWith('@g.us');

        if (sub === 'count') {
            const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
            const list = Object.values(groups);
            const total = list.length;
            const members = list.reduce((a, g) => a + (g.participants?.length || 0), 0);
            const largest = [...list].sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))[0];
            return sock.sendMessage(from, {
                text: `📊 *Thread Statistics*\n\n👥 Groups: *${total}*\n🧑‍🤝‍🧑 Total members: *${members}*\n📈 Avg per group: *${total > 0 ? Math.round(members / total) : 0}*\n🏆 Largest: *${largest?.subject || 'N/A'}* (${largest?.participants?.length || 0} members)`
            }, { quoted: message });
        }

        if (sub === 'list') {
            const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
            const list = Object.values(groups).sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));
            if (!list.length) return sock.sendMessage(from, { text: '📭 Bot is not in any groups yet.' }, { quoted: message });
            const chunks = [];
            let chunk = `📋 *Group List — ${list.length} groups*\n\n`;
            list.forEach((g, i) => {
                const line = `*${i + 1}.* ${g.subject || 'Unnamed'}\n   👥 ${g.participants?.length || 0} members · 🔑 \`${g.id}\`\n\n`;
                if ((chunk + line).length > 3500) { chunks.push(chunk.trim()); chunk = ''; }
                chunk += line;
            });
            if (chunk.trim()) chunks.push(chunk.trim());
            for (const c of chunks) {
                await sock.sendMessage(from, { text: c }, { quoted: message });
                await new Promise(r => setTimeout(r, 400));
            }
            return;
        }

        if (sub === 'save') {
            const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
            await saveStore(groups);
            return sock.sendMessage(from, { text: `✅ Saved ${Object.keys(groups).length} groups to disk.` }, { quoted: message });
        }

        if (sub === 'info') {
            if (!isGroup) return sock.sendMessage(from, { text: '❌ Use this command inside a group.' }, { quoted: message });
            const meta = await sock.groupMetadata(from).catch(() => null);
            if (!meta) return sock.sendMessage(from, { text: '❌ Failed to fetch group info.' }, { quoted: message });
            const admins = meta.participants.filter(p => p.admin).map(p => `@${p.id.split('@')[0]}`).join(', ') || 'None';
            const created = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';
            let inviteLink = 'N/A';
            try { const code = await sock.groupInviteCode(from); if (code) inviteLink = `https://chat.whatsapp.com/${code}`; } catch {}
            await sock.sendMessage(from, {
                text: `📋 *Group Thread Info*\n\n📌 Name: ${meta.subject}\n🔑 JID: \`${meta.id}\`\n👥 Members: ${meta.participants.length}\n👑 Admins: ${admins}\n🔒 Locked: ${meta.restrict ? 'Yes ✅' : 'No ❌'}\n📣 Announce-only: ${meta.announce ? 'Yes ✅' : 'No ❌'}\n📅 Created: ${created}\n🔗 Invite: ${inviteLink}\n📝 Desc: ${meta.desc || 'No description'}`,
                mentions: meta.participants.filter(p => p.admin).map(p => p.id)
            }, { quoted: message });
            return;
        }

        if (sub === 'send') {
            const msg = args.slice(1).join(' ');
            if (!msg) return sock.sendMessage(from, { text: `❌ Usage: ${prefix}thread send <message>` }, { quoted: message });
            const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
            const ids = Object.keys(groups);
            if (!ids.length) return sock.sendMessage(from, { text: '📭 No groups found.' }, { quoted: message });
            const prog = await sock.sendMessage(from, { text: `📤 Sending to *${ids.length}* groups…` }, { quoted: message });
            let sent = 0, failed = 0;
            for (const id of ids) {
                try { await sock.sendMessage(id, { text: msg }); sent++; } catch { failed++; }
                await new Promise(r => setTimeout(r, 700));
            }
            return sock.sendMessage(from, {
                text: `✅ *Thread Broadcast Complete*\n\n📤 Sent: ${sent}\n❌ Failed: ${failed}\n📦 Total: ${ids.length}`,
                edit: prog.key
            });
        }

        if (sub === 'kick') {
            if (!isGroup) return sock.sendMessage(from, { text: '❌ Use inside a group.' }, { quoted: message });
            const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (!mentions.length) return sock.sendMessage(from, { text: `❌ Usage: ${prefix}thread kick @user` }, { quoted: message });
            let kicked = 0;
            for (const jid of mentions) {
                try { await sock.groupParticipantsUpdate(from, [jid], 'remove'); kicked++; } catch {}
                await new Promise(r => setTimeout(r, 500));
            }
            return sock.sendMessage(from, { text: `✅ Kicked ${kicked}/${mentions.length} user(s).` }, { quoted: message });
        }

        if (sub === 'leave') {
            const jid = args[1];
            if (!jid) return sock.sendMessage(from, { text: `❌ Usage: ${prefix}thread leave <group_jid>` }, { quoted: message });
            try {
                await sock.groupLeave(jid);
                return sock.sendMessage(from, { text: `✅ Left group:\n\`${jid}\`` }, { quoted: message });
            } catch (e) {
                return sock.sendMessage(from, { text: `❌ Failed to leave: ${e.message}` }, { quoted: message });
            }
        }

        if (sub === 'mute') {
            if (!isGroup) return sock.sendMessage(from, { text: '❌ Use inside a group.' }, { quoted: message });
            try {
                await sock.groupSettingUpdate(from, 'announcement');
                return sock.sendMessage(from, { text: '🔇 Group muted — only admins can send messages.' }, { quoted: message });
            } catch (e) {
                return sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: message });
            }
        }

        if (sub === 'unmute') {
            if (!isGroup) return sock.sendMessage(from, { text: '❌ Use inside a group.' }, { quoted: message });
            try {
                await sock.groupSettingUpdate(from, 'not_announcement');
                return sock.sendMessage(from, { text: '🔊 Group opened — all members can send messages.' }, { quoted: message });
            } catch (e) {
                return sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: message });
            }
        }

        return sock.sendMessage(from, {
            text: `🧵 *Thread Manager*\n\n${prefix}thread list — List all groups\n${prefix}thread count — Group & member stats\n${prefix}thread info — Current group info\n${prefix}thread send <msg> — Broadcast to all groups\n${prefix}thread kick @user — Kick user from group\n${prefix}thread leave <jid> — Leave a specific group\n${prefix}thread mute — Lock current group\n${prefix}thread unmute — Unlock current group\n${prefix}thread save — Save group list to disk`
        }, { quoted: message });
    }
};
