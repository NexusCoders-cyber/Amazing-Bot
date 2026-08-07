import axios from 'axios';

export default {
    config: {
        name: 'pinterest2',
        aliases: ['pin2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download Pinterest media (v2)',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}pinterest2 <url or search>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📌');
        if (!args.length) return reply(`Usage: ${prefix}pinterest2 <url or search query>`);

        const query = args.join(' ');
        try {
            if (query.includes('pinterest.com') || query.includes('pin.it')) {
                const api = `https://api.konalube.my.id/pinterest?url=${encodeURIComponent(query)}`;
                const { data } = await axios.get(api, { timeout: 15000 });

                if (data?.url) {
                    const imgRes = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 15000 });
                    await reply({
                        image: Buffer.from(imgRes.data),
                        caption: `📌 *Pinterest Download*\n━━━━━━━━━━━━━━━━━━━━\n✅ Downloaded\n━━━━━━━━━━━━━━━━━━━━`,
                    });
                } else {
                    reply(`❌ Could not fetch media.`);
                }
            } else {
                // Search for images
                const searchUrl = `https://api.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&access_token=pin_`;
                reply(`📌 *Pinterest Search:* ${query}\n\nℹ️ Use a direct Pinterest URL for download, or set up API access for search.`);
            }
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
