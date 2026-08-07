import axios from 'axios';

export default {
    config: {
        name: 'threads',
        aliases: ['threadsd', 'threadsdl'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download from Threads',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}threads <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🧵');
        if (!args.length) return reply(`Usage: ${prefix}threads <Threads URL>`);

        const url = args[0];
        if (!url.includes('threads.net') && !url.includes('threads.app')) {
            return reply(`❌ Provide a valid Threads URL.`);
        }

        try {
            const api = `https://api.veegee.xyz/api/threads?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 15000 });

            if (!data?.success) return reply(`❌ Could not fetch media.`);

            for (const item of (data.data || []).slice(0, 5)) {
                if (item.type === 'video') {
                    const vRes = await axios.get(item.url, { responseType: 'arraybuffer', timeout: 30000 });
                    await reply({ video: Buffer.from(vRes.data) });
                } else {
                    const iRes = await axios.get(item.url, { responseType: 'arraybuffer', timeout: 15000 });
                    await reply({ image: Buffer.from(iRes.data) });
                }
            }

            reply(`✅ Threads media downloaded!`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
