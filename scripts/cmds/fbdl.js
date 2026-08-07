import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';

export default {
    config: {
        name: 'fbdl',
        aliases: ['facebook', 'fb', 'fbvideo'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download Facebook videos',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}fbdl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📘');
        if (!args.length) return reply(`Usage: ${prefix}fbdl <Facebook video URL>`);
        const url = args[0];
        if (!validateUrl(url, ['facebook.com', 'fb.watch', 'fb.com'])) {
            return reply(`❌ Provide a valid Facebook URL.`);
        }

        await reply(`📘 Downloading Facebook video...`);

        const result = await cobaltDownload(url);
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    await reply({ video: buf, caption: `📘 *Facebook Download* ✅` });
                    return;
                }
            } catch {}
        }

        reply(`❌ Failed. Check URL and try again.`);
    },
};
