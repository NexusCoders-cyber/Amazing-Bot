import axios from 'axios';

export default {
    config: {
        name: 'tiktok2',
        aliases: ['tt2', 'ttdl2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download TikTok video (v2)',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}tiktok2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📱');
        if (!args.length) return reply(`Usage: ${prefix}tiktok2 <TikTok URL>`);

        const url = args[0];
        if (!url.includes('tiktok.com') && !url.includes('vm.tiktok')) {
            return reply(`❌ Provide a valid TikTok URL.`);
        }

        try {
            const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 15000 });

            if (!data.data) return reply(`❌ Could not fetch video.`);

            const { play, music, title, author } = data.data;
            let text = `📱 *TikTok Download*\n━━━━━━━━━━━━━━━━━━━━\n`;
            text += `📝 ${title || 'No title'}\n`;
            text += `👤 @${author?.unique_id || 'unknown'}\n`;
            text += `❤️ ${data.data.digg_count || 0} likes\n`;
            text += `💬 ${data.data.comment_count || 0} comments\n`;
            text += `━━━━━━━━━━━━━━━━━━━━`;

            if (play) {
                const videoRes = await axios.get(play, { responseType: 'arraybuffer', timeout: 30000 });
                await reply({
                    video: Buffer.from(videoRes.data),
                    caption: text,
                });
            } else {
                reply(`❌ No video URL found.`);
            }

            if (music) {
                try {
                    const musicRes = await axios.get(music, { responseType: 'arraybuffer', timeout: 15000 });
                    await reply({
                        audio: Buffer.from(musicRes.data),
                        mimetype: 'audio/mpeg',
                    });
                } catch {}
            }
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
