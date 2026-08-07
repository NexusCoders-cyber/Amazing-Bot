import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheFolder = path.resolve(__dirname, 'cache');

if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder, { recursive: true });
}

function deepFindUrl(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'string' && obj.startsWith('http') && (
        obj.includes('.mp3') || obj.includes('.mp4') || obj.includes('.m4a') ||
        obj.includes('googlevideo') || obj.includes('youtube') || obj.includes('ytdl') ||
        obj.includes('cdn') || obj.includes('download') || obj.includes('audio') || obj.includes('media')
    )) return obj;
    if (typeof obj === 'object' && obj !== null) {
        const priorityKeys = ['url', 'link', 'audio', 'audioUrl', 'download', 'downloadUrl', 'file', 'src', 'stream', 'media', 'mp3', 'result', 'data', 'output', 'response'];
        for (const key of priorityKeys) {
            if (obj[key]) { const found = deepFindUrl(obj[key], depth + 1); if (found) return found; }
        }
        for (const key of Object.keys(obj)) {
            if (!priorityKeys.includes(key)) { const found = deepFindUrl(obj[key], depth + 1); if (found) return found; }
        }
    }
    return null;
}

function deepFindTitle(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'object' && obj !== null) {
        const titleKeys = ['title', 'name', 'videoTitle', 'song', 'track', 'fileName'];
        for (const key of titleKeys) {
            if (obj[key] && typeof obj[key] === 'string') return obj[key];
        }
        for (const key of Object.keys(obj)) {
            const found = deepFindTitle(obj[key], depth + 1);
            if (found) return found;
        }
    }
    return null;
}

function deepFindThumbnail(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'string' && obj.startsWith('http') && (
        obj.includes('thumb') || obj.includes('thumbnail') || obj.includes('image') ||
        obj.includes('img') || obj.includes('cover') || obj.includes('album') ||
        obj.includes('artwork') || obj.includes('.jpg') || obj.includes('.jpeg') ||
        obj.includes('.png') || obj.includes('.webp')
    )) return obj;
    if (typeof obj === 'object' && obj !== null) {
        const priorityKeys = ['thumbnail', 'thumb', 'image', 'cover', 'artwork', 'albumArt', 'album_art', 'img', 'photo', 'poster', 'banner', 'preview', 'result', 'data', 'output'];
        for (const key of priorityKeys) {
            if (obj[key]) { const found = deepFindThumbnail(obj[key], depth + 1); if (found) return found; }
        }
        for (const key of Object.keys(obj)) {
            if (!priorityKeys.includes(key)) { const found = deepFindThumbnail(obj[key], depth + 1); if (found) return found; }
        }
    }
    return null;
}

function deepFindDuration(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'object' && obj !== null) {
        const durationKeys = ['duration', 'timestamp', 'length', 'time', 'durationFormatted'];
        for (const key of durationKeys) {
            if (obj[key] && (typeof obj[key] === 'string' || typeof obj[key] === 'number')) return String(obj[key]);
        }
        for (const key of Object.keys(obj)) {
            const found = deepFindDuration(obj[key], depth + 1);
            if (found) return found;
        }
    }
    return null;
}

async function fetchThumbnailBuffer(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' } });
        return Buffer.from(res.data);
    } catch { return null; }
}

async function fetchFastApiUrl(query, format = 'audio') {
    const headers = { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' };
    const endpoints = [
        { name: 'DrexApp', url: `https://api.drexapp.space/downloader/ytplayv2?q=${encodeURIComponent(query)}` },
        { name: 'DavidCyril', url: `https://apis.davidcyril.name.ng/play?query=${encodeURIComponent(query)}&format=${format}` },
    ];

    for (const endpoint of endpoints) {
        try {
            const res = await axios.get(endpoint.url, { headers, timeout: 25000 });
            const data = res.data;
            const downloadUrl = deepFindUrl(data);
            const title = deepFindTitle(data) || query;
            const thumbnail = deepFindThumbnail(data);
            const duration = deepFindDuration(data);
            if (downloadUrl) return { url: downloadUrl, title, thumbnail, duration, source: endpoint.name };
        } catch {}
    }
    return null;
}

export default {
    config: {
        name: 'play',
        aliases: ['music', 'song'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download and send YouTube audio',
        longDescription: 'Searches YouTube for your query and sends the top result as an audio file with album art.',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}play <search query>' },
    },

    async onStart({ sock, message, args, from, reply }) {
        if (!args[0]) return reply('Usage: play <search query>');

        const query = args.join(' ').trim();
        const result = await fetchFastApiUrl(query, 'audio');

        if (!result?.url) return reply('Could not find or download that song. Try a different search term.');

        const caption = [
            result.title,
            result.duration ? `Duration: ${result.duration}` : '',
        ].filter(Boolean).join('\n');

        if (result.thumbnail) {
            const thumbBuffer = await fetchThumbnailBuffer(result.thumbnail);
            if (thumbBuffer) {
                await sock.sendMessage(from, { image: thumbBuffer, caption: caption + '\n\nDownloading audio...' }, { quoted: message });
            } else {
                await sock.sendMessage(from, { text: caption + '\n\nDownloading audio...' }, { quoted: message });
            }
        } else {
            await sock.sendMessage(from, { text: caption + '\n\nDownloading audio...' }, { quoted: message });
        }

        const safeName = result.title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').slice(0, 40);
        const tmpFilePath = path.join(cacheFolder, `${safeName}_${Date.now()}.mp3`);

        try {
            const stream = await axios({
                url: result.url,
                method: 'GET',
                responseType: 'stream',
                timeout: 60000,
                headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' },
            });

            const writer = fs.createWriteStream(tmpFilePath);
            stream.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const thumbBuffer = result.thumbnail ? await fetchThumbnailBuffer(result.thumbnail) : null;

            await sock.sendMessage(from, {
                audio: { url: tmpFilePath },
                mimetype: 'audio/mpeg',
                fileName: `${safeName}.mp3`,
                ...(thumbBuffer && { jpegThumbnail: thumbBuffer }),
            }, { quoted: message });

        } catch {
            await reply('Failed to download or send the audio. Please try again.');
        } finally {
            if (fs.existsSync(tmpFilePath)) fs.unlink(tmpFilePath, () => {});
        }
    },
};
