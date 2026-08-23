import axios from 'axios';
import ytdl from 'ytdl-core';

const SEARCH_API = 'https://api.eaglegnick.tech/api/play/yt';
const DOWNLOAD_API = 'https://dev-priyanshi.onrender.com/api/alldl';
const MAX_DURATION_SECONDS = 15 * 60;

function isYoutubeUrl(str) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(str.trim());
}

function parseDurationToSeconds(duration) {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    const parts = String(duration).split(':').map(Number);
    if (parts.some(Number.isNaN)) return 0;
    return parts.reduce((acc, p) => acc * 60 + p, 0);
}

function deepFindVideoUrl(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'string' && obj.startsWith('http') && (
        obj.includes('.mp4') || obj.includes('googlevideo') || obj.includes('cdn') ||
        obj.includes('download') || obj.includes('video')
    )) return obj;
    if (typeof obj === 'object') {
        const keys = ['download_url', 'downloadUrl', 'videoUrl', 'url', 'link', 'result', 'data', 'hd', 'sd'];
        for (const k of keys) if (obj[k]) { const f = deepFindVideoUrl(obj[k], depth + 1); if (f) return f; }
        for (const k of Object.keys(obj)) if (!keys.includes(k)) { const f = deepFindVideoUrl(obj[k], depth + 1); if (f) return f; }
    }
    return null;
}

async function searchVideo(query) {
    const { data } = await axios.get(SEARCH_API, { params: { q: query }, timeout: 20000 });
    if (!data?.ok || !data?.id) return null;
    return {
        url: data.url,
        title: data.title || query,
        duration: data.duration || '',
        seconds: parseDurationToSeconds(data.duration),
    };
}

async function downloadViaApi(youtubeUrl) {
    const { data } = await axios.get(DOWNLOAD_API, { params: { url: youtubeUrl }, timeout: 60000 });
    return deepFindVideoUrl(data);
}

async function resolveViaYtdl(youtubeUrl) {
    const info = await ytdl.getInfo(youtubeUrl);
    const d = info.videoDetails;
    return {
        title: d.title,
        seconds: parseInt(d.lengthSeconds, 10) || 0,
        format: ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' }),
    };
}

async function downloadToBuffer(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' } });
    return Buffer.from(res.data);
}

export default {
    config: {
        name: 'video',
        aliases: ['mp4', 'ytvideo', 'playvid'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Download and send a YouTube video',
        longDescription: 'Searches YouTube for a video (or accepts a direct YouTube link) and sends it into the chat as an MP4.',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}video <query or youtube link>' },
    },

    async onStart({ sock, message, args, from, reply }) {
        if (!args[0]) return reply('🎬 Usage: video <query or youtube link>\nExample: video shape of you');

        const query = args.join(' ').trim();
        const youtubeUrl = isYoutubeUrl(query) ? query : null;

        let title, seconds, sourceUrl;

        if (youtubeUrl) {
            sourceUrl = youtubeUrl;
        } else {
            try {
                const found = await searchVideo(query);
                if (!found) return reply('❌ Could not find that video on YouTube.');
                sourceUrl = found.url;
                title = found.title;
                seconds = found.seconds;
            } catch {
                return reply('❌ Video search failed. Try again shortly.');
            }
        }

        if (seconds && seconds > MAX_DURATION_SECONDS) {
            return reply(`⏱️ That video is too long (max ${MAX_DURATION_SECONDS / 60} minutes). Try a shorter one.`);
        }

        await reply(`⏳ Downloading${title ? `: ${title}` : ''}... this may take a moment.`);

        let videoUrl = null;
        try {
            videoUrl = await downloadViaApi(sourceUrl);
        } catch {}

        if (videoUrl) {
            try {
                await sock.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: title ? `🎬 ${title}\n⏱️ ${seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : ''}\n🔗 ${sourceUrl}` : `🔗 ${sourceUrl}`,
                }, { quoted: message });
                return;
            } catch {
                try {
                    const buffer = await downloadToBuffer(videoUrl);
                    await sock.sendMessage(from, { video: buffer, mimetype: 'video/mp4', caption: title || '' }, { quoted: message });
                    return;
                } catch {}
            }
        }

        try {
            const resolved = await resolveViaYtdl(sourceUrl);
            if (!resolved.format) throw new Error('No downloadable format found.');
            if (resolved.seconds > MAX_DURATION_SECONDS) {
                return reply(`⏱️ That video is too long (max ${MAX_DURATION_SECONDS / 60} minutes). Try a shorter one.`);
            }
            const buffer = await downloadToBuffer(resolved.format.url);
            await sock.sendMessage(from, {
                video: buffer,
                mimetype: 'video/mp4',
                caption: `🎬 ${resolved.title}`,
            }, { quoted: message });
        } catch (err) {
            const msg = err.message?.includes('age') ? 'Age-restricted video.'
                : err.message?.includes('private') ? 'Private video.'
                : 'Could not download that video. Try a different query.';
            reply(`❌ ${msg}`);
        }
    },
};
