import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

const DL_API = 'https://api.qasimdev.dpdns.org/api/loaderto/download';
const API_KEY = process.env.LOADERTO_API_KEY || 'qasim-dev';
const MAX_DURATION_SECONDS = 20 * 60;

const wait = (ms) => new Promise(r => setTimeout(r, ms));

function isYoutubeUrl(str) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(str.trim());
}

async function resolveVideo(query) {
    if (isYoutubeUrl(query)) {
        const info = await ytdl.getInfo(query);
        const d = info.videoDetails;
        const seconds = parseInt(d.lengthSeconds, 10) || 0;
        return {
            url: query,
            title: d.title,
            author: d.author?.name || 'Unknown',
            timestamp: seconds ? new Date(seconds * 1000).toISOString().substring(11, 19) : '?',
            thumbnail: d.thumbnails?.[d.thumbnails.length - 1]?.url,
            seconds,
        };
    }
    const { videos } = await yts(query);
    if (!videos?.length) return null;
    const v = videos[0];
    return {
        url: v.url,
        title: v.title,
        author: v.author?.name || 'Unknown',
        timestamp: v.timestamp,
        thumbnail: v.thumbnail,
        seconds: v.seconds,
    };
}

async function downloadFromLoaderto(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const { data } = await axios.get(DL_API, {
                params: { apiKey: API_KEY, format: 'mp3', url },
                timeout: 90000,
            });
            if (data?.data?.downloadUrl) return data.data;
            throw new Error('No download URL in response');
        } catch (err) {
            if (i === retries - 1) throw err;
            await wait(5000);
        }
    }
    throw new Error('All download attempts failed');
}

function deepFindUrl(obj, depth = 0) {
    if (depth > 6 || !obj) return null;
    if (typeof obj === 'string' && obj.startsWith('http') && (
        obj.includes('.mp3') || obj.includes('.m4a') || obj.includes('googlevideo') ||
        obj.includes('cdn') || obj.includes('download') || obj.includes('audio')
    )) return obj;
    if (typeof obj === 'object') {
        const keys = ['url', 'link', 'audio', 'audioUrl', 'download', 'downloadUrl', 'result', 'data'];
        for (const k of keys) if (obj[k]) { const f = deepFindUrl(obj[k], depth + 1); if (f) return f; }
        for (const k of Object.keys(obj)) if (!keys.includes(k)) { const f = deepFindUrl(obj[k], depth + 1); if (f) return f; }
    }
    return null;
}

async function downloadFromFallback(query) {
    const endpoints = [
        `https://api.drexapp.space/downloader/ytplayv2?q=${encodeURIComponent(query)}`,
        `https://apis.davidcyril.name.ng/play?query=${encodeURIComponent(query)}&format=audio`,
    ];
    for (const endpoint of endpoints) {
        try {
            const { data } = await axios.get(endpoint, { timeout: 25000, headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' } });
            const url = deepFindUrl(data);
            if (url) return { downloadUrl: url };
        } catch {}
    }
    return null;
}

async function fetchThumbnailBuffer(url) {
    if (!url) return null;
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' } });
        return Buffer.from(res.data);
    } catch {
        return null;
    }
}

async function downloadToBuffer(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 90000, headers: { 'User-Agent': 'Mozilla/5.0 (AmazingBot)' } });
    return Buffer.from(res.data);
}

export default {
    config: {
        name: 'play',
        aliases: ['plays', 'music', 'song'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Search and download a song as MP3 from YouTube',
        longDescription: 'Searches YouTube for a song (or accepts a direct YouTube link) and sends it back as an MP3 with cover art.',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}play <song name or youtube link>' },
    },

    async onStart({ sock, message, args, from, reply }) {
        const query = args.join(' ').trim();
        if (!query) return reply('🎵 Which song do you want to play?\nUsage: play <song name or youtube link>');

        let video;
        try {
            await reply('🔍 Searching...');
            video = await resolveVideo(query);
        } catch {
            return reply('❌ Could not read that YouTube link.');
        }

        if (!video) return reply('❌ No results found!');
        if (video.seconds && video.seconds > MAX_DURATION_SECONDS) {
            return reply(`⏱️ That video is too long (max ${MAX_DURATION_SECONDS / 60} minutes). Try a shorter one.`);
        }

        await sock.sendMessage(from, {
            text: `✅ Found: ${video.title}\n⏱️ ${video.timestamp}\n👤 ${video.author}\n\n⏳ Downloading... this may take up to 30s.`
        }, { quoted: message });

        let songData;
        try {
            songData = await downloadFromLoaderto(video.url);
        } catch {
            songData = await downloadFromFallback(`${video.title} ${video.author}`);
        }

        if (!songData?.downloadUrl) {
            return reply('❌ Failed: could not fetch a download link for that song right now. Try again shortly.');
        }

        const thumbBuffer = await fetchThumbnailBuffer(songData.thumbnail || video.thumbnail);
        const title = songData.title || video.title;
        const safeName = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').slice(0, 60) || 'audio';

        try {
            await sock.sendMessage(from, {
                audio: { url: songData.downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${safeName}.mp3`,
                ...(thumbBuffer && { jpegThumbnail: thumbBuffer }),
                contextInfo: {
                    externalAdReply: {
                        title,
                        body: `${video.author} • ${video.timestamp}`,
                        thumbnail: thumbBuffer,
                        mediaType: 2,
                        sourceUrl: video.url,
                    }
                }
            }, { quoted: message });
        } catch {
            try {
                const buffer = await downloadToBuffer(songData.downloadUrl);
                await sock.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${safeName}.mp3`,
                    ...(thumbBuffer && { jpegThumbnail: thumbBuffer }),
                }, { quoted: message });
            } catch (err) {
                reply(`❌ Failed to send audio: ${err.message}`);
            }
        }
    },
};
