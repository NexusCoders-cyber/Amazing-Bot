import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import { createWriteStream } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

function isUrl(str) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(str);
}

async function searchAndGetUrl(query) {
    const res = await ytSearch(query);
    const vid = res.videos?.[0];
    return vid ? { url: `https://www.youtube.com/watch?v=${vid.videoId}`, title: vid.title, duration: vid.timestamp, author: vid.author?.name, seconds: vid.seconds } : null;
}

export default {
    config: {
        name: 'video',
        aliases: ['mp4', 'ytvideo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download YouTube video by URL or search term',
        longDescription: 'Downloads a YouTube video as MP4. Works with a direct URL or a search term.',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}video <url or search term>' },
    },

    async onStart({ sock, message, args, from, reply }) {
        const query = args.join(' ').trim();
        if (!query) return reply('Usage: video <url or search term>');

        try {
            let url, title, duration, author, seconds;

            if (isUrl(query)) {
                const info = await ytdl.getInfo(query);
                url = query;
                title = info.videoDetails.title;
                duration = info.videoDetails.lengthSeconds;
                author = info.videoDetails.author.name;
                seconds = parseInt(duration);
            } else {
                const found = await searchAndGetUrl(query);
                if (!found) return reply('No results found for: ' + query);
                ({ url, title, duration, author, seconds } = found);
            }

            if (seconds > 600) return reply('Video too long. Max 10 minutes for downloads.');

            await reply(`Downloading: ${title}\nBy: ${author}\nPlease wait...`);

            const tmpFile = path.join(os.tmpdir(), `video_${Date.now()}.mp4`);

            await new Promise((resolve, reject) => {
                const stream = ytdl(url, { quality: 'highestvideo', filter: 'videoandaudio' });
                stream.pipe(createWriteStream(tmpFile));
                stream.on('end', resolve);
                stream.on('error', reject);
            });

            const buffer = await fs.readFile(tmpFile);
            await fs.remove(tmpFile);

            await sock.sendMessage(from, {
                video: buffer,
                caption: `${title}\n${author}`,
                mimetype: 'video/mp4',
            }, { quoted: message });

        } catch (err) {
            const msg = err.message?.includes('age') ? 'Age-restricted video.'
                : err.message?.includes('private') ? 'Private video.'
                : 'Download failed. Try a different video.';
            reply(msg);
        }
    },
};
