import axios from 'axios';

export default {
    config: {
        name: 'gdrive2',
        aliases: ['gd2', 'googledrive2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download from Google Drive (v2)',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}gdrive2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📁');
        if (!args.length) return reply(`Usage: ${prefix}gdrive2 <Google Drive URL>`);

        const url = args[0];
        if (!url.includes('drive.google.com')) return reply(`❌ Provide a valid Google Drive URL.`);

        try {
            const fileId = url.match(/[-\w]{25,}/)?.[0];
            if (!fileId) return reply(`❌ Could not extract file ID.`);

            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            const { headers } = await axios.head(downloadUrl, { timeout: 10000 });

            reply({
                document: { url: downloadUrl },
                fileName: 'gdrive_download',
                mimetype: headers['content-type'] || 'application/octet-stream',
                caption: `📁 *Google Drive Download*\n━━━━━━━━━━━━━━━━━━━━\n✅ Downloading...\n━━━━━━━━━━━━━━━━━━━━`,
            });
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
