import axios from 'axios';

export default {
    config: {
        name: 'twitter2',
        aliases: ['x2', 'xdl2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download Twitter/X video (v2)',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}twitter2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🐦');
        if (!args.length) return reply(`Usage: ${prefix}twitter2 <Twitter/X URL>`);

        const url = args[0];
        if (!url.includes('twitter.com') && !url.includes('x.com')) {
            return reply(`❌ Provide a valid Twitter/X URL.`);
        }

        try {
            const api = `https://api.konalube.my.id/twitter?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 30000 });

            if (!data?.url) return reply(`❌ Could not fetch video.`);

            const videoRes = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 60000 });
            await reply({
                video: Buffer.from(videoRes.data),
                caption: `🐦 *Twitter Download*\n━━━━━━━━━━━━━━━━━━━━\n✅ Video downloaded\n━━━━━━━━━━━━━━━━━━━━`,
            });
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
