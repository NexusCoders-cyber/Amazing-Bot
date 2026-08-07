import axios from 'axios';

export default {
    config: {
        name: 'facebook2',
        aliases: ['fb2', 'fbdl2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download Facebook video (v2)',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}facebook2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📘');
        if (!args.length) return reply(`Usage: ${prefix}facebook2 <Facebook video URL>`);

        const url = args[0];
        if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
            return reply(`❌ Provide a valid Facebook URL.`);
        }

        try {
            const api = `https://api.konalube.my.id/fb?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 30000 });

            if (!data?.url) return reply(`❌ Could not fetch video.`);

            const videoRes = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 60000 });
            await reply({
                video: Buffer.from(videoRes.data),
                caption: `📘 *Facebook Download*\n━━━━━━━━━━━━━━━━━━━━\n✅ Video downloaded successfully\n━━━━━━━━━━━━━━━━━━━━`,
            });
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
