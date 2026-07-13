export default {
    name: 'listgroups',
    aliases: ['lsg', 'mygroups', 'botgroups'],
    category: 'owner',
    description: 'List all groups the bot is in with member counts',
    usage: 'listgroups [name|members]',
    example: 'listgroups\nlistgroups members\nlistgroups name',
    cooldown: 10,
    ownerOnly: true,
    args: false,

    async execute({ sock, message, args, from }) {
        const sortBy = (args[0] || 'members').toLowerCase();
        const prog = await sock.sendMessage(from, { text: '🔍 Fetching your group list…' }, { quoted: message });

        try {
            const groups = await sock.groupFetchAllParticipating();
            let list = Object.values(groups);

            if (sortBy === 'name') {
                list.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
            } else {
                list.sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));
            }

            const total = list.length;
            const totalMembers = list.reduce((s, g) => s + (g.participants?.length || 0), 0);

            await sock.sendMessage(from, {
                text: `📊 ${total} groups · ${totalMembers} total members · sorted by ${sortBy}`,
                edit: prog.key
            });

            const chunks = [];
            let chunk = '';
            list.forEach((g, i) => {
                const admins = (g.participants || []).filter(p => p.admin).length;
                const line = `*${i + 1}.* ${g.subject || 'Unnamed'}\n   👥 ${g.participants?.length || 0} members · 👑 ${admins} admins\n   🔑 \`${g.id}\`\n\n`;
                if ((chunk + line).length > 3500) { chunks.push(chunk.trim()); chunk = ''; }
                chunk += line;
            });
            if (chunk.trim()) chunks.push(chunk.trim());

            for (const c of chunks) {
                await sock.sendMessage(from, { text: c }, { quoted: message });
                await new Promise(r => setTimeout(r, 400));
            }
        } catch (e) {
            await sock.sendMessage(from, {
                text: `❌ Failed to fetch groups: ${e.message}`,
                edit: prog.key
            });
        }
    }
};
