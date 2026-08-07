import axios from 'axios';

export default {
    config: {
        name: 'apkdl',
        aliases: ['apk', 'downloadapk'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Search and download APKs from APKPure',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}apkdl <app name>' },
    },
    async onStart({ args, reply, sock, from, message }) {
        if (!args.length) return reply('Search for an APK.\nUsage: apkdl <app name>');

        const query = args.join(' ');

        try {
            // Search APKPure
            const searchUrl = `https://apkpure.net/search?q=${encodeURIComponent(query)}`;
            const { data: html } = await axios.get(searchUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 15000,
            });

            // Parse first result
            const appMatch = html.match(/<a[^>]*class="[^"]*dd[^"]*"[^>]*href="([^"]+)"[^>]*>/i)
                || html.match(/<a[^>]*href="(\/[a-z][a-z0-9-]+\/[^"]+)"[^>]*class="[^"]*p1[^"]*"/i);

            if (!appMatch) return reply(`No APK found for "${query}".`);

            const appUrl = appMatch[1].startsWith('http') ? appMatch[1] : `https://apkpure.net${appMatch[1]}`;
            const { data: appPage } = await axios.get(appUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 15000,
            });

            // Extract info
            const nameMatch = appPage.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            const versionMatch = appPage.match(/Version[^<]*<[^>]*>([^<]+)/i);
            const sizeMatch = appPage.match(/Size[^<]*<[^>]*>([^<]+)/i);

            const name = nameMatch?.[1]?.trim() || query;
            const version = versionMatch?.[1]?.trim() || 'Unknown';
            const size = sizeMatch?.[1]?.trim() || 'Unknown';

            // Find download link
            const dlMatch = appPage.match(/href="(https?:\/\/[^"]*\.apk[^"]*)"/i)
                || appPage.match(/data-dt-url="([^"]+)"/i);

            if (dlMatch) {
                const dlUrl = dlMatch[1];
                const { data: buffer, headers } = await axios.get(dlUrl, {
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                });

                if (buffer.length > 100 * 1024 * 1024) return reply(`APK too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Max 100MB.`);

                await sock.sendMessage(from, {
                    document: buffer,
                    fileName: `${name.replace(/\s+/g, '_')}.apk`,
                    mimetype: 'application/vnd.android.package-archive',
                }, { quoted: message });

                reply(`📱 *${name}*\nVersion: ${version}\nSize: ${size}`);
            } else {
                reply(`📱 *${name}*\nVersion: ${version}\nSize: ${size}\n\nDirect download not available. Visit: ${appUrl}`);
            }
        } catch (err) {
            reply('APK search/download failed. Try a different app name.');
        }
    },
};
