import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'gdrvdl',
        aliases: ['gdrive', 'gd', 'googledrive'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download from Google Drive',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}gdrvdl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📁');
        if (!args.length) return reply(`Usage: ${prefix}gdrvdl <Google Drive URL>`);
        const url = args[0];
        if (!validateUrl(url, ['drive.google.com', 'docs.google.com'])) {
            return reply(`❌ Provide a valid Google Drive URL.`);
        }

        await reply(`📁 Downloading from Google Drive...`);

        // Extract file ID
        const fileId = url.match(/[-\w]{25,}/)?.[0];
        if (!fileId) return reply(`❌ Could not extract file ID.`);

        try {
            // Get file info
            const infoUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,size&key=${process.env.GOOGLE_API_KEY || ''}`;
            let fileName = 'download';
            try {
                const { data } = await axios.get(infoUrl, { timeout: 10000 });
                fileName = data.name || 'download';
            } catch {}

            // Direct download link
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

            // Try cobalt first
            const result = await cobaltDownload(url);
            if (result?.url) {
                try {
                    const buf = await fetchBuffer(result.url);
                    if (buf.length > 1000) {
                        await reply({ document: buf, fileName, mimetype: 'application/octet-stream', caption: `📁 *${fileName}* ✅` });
                        return;
                    }
                } catch {}
            }

            // Direct download
            const res = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: 60000 });
            const buf = Buffer.from(res.data);
            if (buf.length > 1000 && !buf.toString().includes('Google Drive - Error')) {
                await reply({ document: buf, fileName, mimetype: 'application/octet-stream', caption: `📁 *${fileName}* ✅` });
                return;
            }
        } catch {}

        reply(`❌ Failed. File might be too large or access restricted.`);
    },
};
