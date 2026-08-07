export default {
    config: {
        name: 'broadcast',
        aliases: ['bc'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Broadcast a message to all groups without triggering notifications',
        category: 'owner',
        coolDown: 30,
        role: 2,
        guide: { en: '{prefix}broadcast <message>' },
    },
    async onStart({ sock, args, reply }) {
        if (!args.length) return reply('Usage: broadcast <message>\nUse "broadcast tag <message>" to also tag everyone.');

        const isTag = args[0]?.toLowerCase() === 'tag';
        const text = isTag ? args.slice(1).join(' ') : args.join(' ');
        if (!text.trim()) return reply('Message cannot be empty.');

        const groups = [];

        if (global._botGroupCache?.size) {
            for (const [jid] of global._botGroupCache) {
                if (jid.endsWith('@g.us')) groups.push(jid);
            }
        }

        if (!groups.length) {
            try {
                const raw = await Promise.race([
                    sock.groupFetchAllParticipating(),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
                ]);
                Object.keys(raw || {}).forEach(jid => { if (jid.endsWith('@g.us')) groups.push(jid); });
            } catch {
                return reply('Could not fetch groups. Make sure the bot is in at least one group.');
            }
        }

        if (!groups.length) return reply('No groups found.');

        await reply(`Starting broadcast to ${groups.length} group(s)...`);

        let sent = 0, failed = 0;

        for (const gid of groups) {
            try {
                if (isTag) {
                    const meta = await sock.groupMetadata(gid).catch(() => null);
                    const members = meta?.participants?.map(p => p.id) || [];
                    const tags = members.map(m => `@${m.split('@')[0]}`).join(' ');
                    await sock.sendMessage(gid, { text: `${text}\n\n${tags}`, mentions: members });
                } else {
                    await sock.sendMessage(gid, { text });
                }
                sent++;
            } catch {
                failed++;
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        reply(`Broadcast complete.\nSent: ${sent}\nFailed: ${failed}\nTotal: ${groups.length}`);
    },
};
