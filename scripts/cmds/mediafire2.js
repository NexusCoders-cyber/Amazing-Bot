import axios from 'axios';

export default {
    config: {
        name: 'mediafire2',
        aliases: ['mf2', 'mfdl2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download from MediaFire (v2)',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}mediafire2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🔥');
        if (!args.length) return reply(`Usage: ${prefix}mediafire2 <MediaFire URL>`);

        const url = args[0];
        if (!url.includes('mediafire.com')) return reply(`❌ Provide a valid MediaFire URL.`);

        try {
            const api = `https://api.konalube.my.id/mediafire?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 30000 });

            if (!data?.url) return reply(`❌ Could not fetch file.`);

            await reply({
                document: { url: data.url },
                fileName: data.name || 'download',
                mimetype: 'application/octet-stream',
                caption: `🔥 *MediaFire Download*\n━━━━━━━━━━━━━━━━━━━━\n📁 ${data.name || 'file'}\n💾 ${data.size || 'unknown size'}\n━━━━━━━━━━━━━━━━━━━━`,
            });
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
