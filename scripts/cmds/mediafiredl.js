import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'mediafiredl',
        aliases: ['mf', 'mfdl', 'mediafire'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download from MediaFire',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}mediafiredl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🔥');
        if (!args.length) return reply(`Usage: ${prefix}mediafiredl <MediaFire URL>`);
        const url = args[0];
        if (!validateUrl(url, ['mediafire.com'])) {
            return reply(`❌ Provide a valid MediaFire URL.`);
        }

        await reply(`🔥 Downloading from MediaFire...`);

        // Try cobalt first
        const result = await cobaltDownload(url);
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    await reply({ document: buf, fileName: result.filename || 'mediafire_download', mimetype: 'application/octet-stream', caption: `🔥 *MediaFire Download* ✅` });
                    return;
                }
            } catch {}
        }

        // Direct scraping
        try {
            const { data: page } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                timeout: 15000,
            });

            // Extract download link
            const dlMatch = page.match(/href="(https?:\/\/download\d+\.mediafire\.com\/[^"]+)"/);
            if (dlMatch) {
                const dlUrl = dlMatch[1];
                const fileName = page.match(/<div class="filename">([^<]+)/)?.[1] || 'download';
                const buf = await fetchBuffer(dlUrl);
                if (buf.length > 1000) {
                    await reply({ document: buf, fileName, mimetype: 'application/octet-stream', caption: `🔥 *${fileName}* ✅` });
                    return;
                }
            }
        } catch {}

        reply(`❌ Failed. Check URL and try again.`);
    },
};
