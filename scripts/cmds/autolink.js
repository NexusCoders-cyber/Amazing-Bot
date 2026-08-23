import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import threadsData from '../../src/utils/threadsData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '..', '..', 'cache');
const HOURLY_LIMIT = parseInt(process.env.AUTODL_HOURLY_LIMIT || '25', 10);
const MAX_SIZE_MB = parseInt(process.env.AUTODL_MAX_SIZE_MB || '60', 10);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const PRIMARY_API = 'https://dev-priyanshi.onrender.com/api/alldl';
const BACKUP_API = 'https://apis.prexzyvilla.site/download/aio';

const supportedPlatforms = {
    youtube: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/i,
    facebook: /^(https?:\/\/)?((?:www|m|web)\.)?(facebook|fb)\.(com|watch)\/\S+/i,
    instagram: /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(?:p|reel)\/([A-Za-z0-9_-]+)/i,
    tiktok: /^(https?:\/\/)?((?:www|m|vm|vt)\.)?tiktok\.com\/\S+/i,
    twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/i,
};

const downloadQueue = new Map();
const userDownloadLimits = new Map();

function checkRateLimit(userId) {
    const now = Date.now();
    const entry = userDownloadLimits.get(userId) || { count: 0, timestamp: now };
    if (now - entry.timestamp > 3600000) {
        userDownloadLimits.set(userId, { count: 1, timestamp: now });
        return true;
    }
    if (entry.count >= HOURLY_LIMIT) return false;
    entry.count++;
    userDownloadLimits.set(userId, entry);
    return true;
}

function unanchor(source) {
    return source.replace(/^\^/, '').replace(/\$$/, '');
}

function extractValidUrls(text) {
    const found = [];
    const source = String(text || '');
    for (const [platform, regex] of Object.entries(supportedPlatforms)) {
        const pattern = unanchor(regex.source);
        const matches = source.matchAll(new RegExp(pattern, 'gi'));
        for (const match of matches) found.push({ url: match[0], platform });
    }
    const seen = new Set();
    return found.filter(f => (seen.has(f.url) ? false : seen.add(f.url)));
}

function deepFind(obj, keys, depth = 0) {
    if (depth > 5 || !obj) return null;
    if (typeof obj === 'object') {
        for (const k of keys) if (obj[k]) return obj[k];
        for (const k of Object.keys(obj)) {
            const found = deepFind(obj[k], keys, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

async function callDownloadApi(url) {
    const primary = await axios.get(PRIMARY_API, {
        params: { url }, timeout: 30000, headers: { 'User-Agent': UA },
    }).then(r => r.data).catch(() => null);

    const primaryUrl = deepFind(primary, ['high', 'low', 'downloadUrl', 'download_url', 'videoUrl', 'url']);
    if (primaryUrl) {
        return {
            title: deepFind(primary, ['title']) || 'Video',
            thumbnail: deepFind(primary, ['thumbnail', 'thumb']) || '',
            downloadUrl: primaryUrl,
            quality: deepFind(primary, ['high']) ? 'High' : 'Auto',
        };
    }

    const backup = await axios.get(BACKUP_API, {
        params: { url }, timeout: 30000, headers: { 'User-Agent': UA },
    }).then(r => r.data).catch(() => null);

    const backupUrl = deepFind(backup, ['high', 'low', 'url', 'download', 'video', 'downloadUrl']);
    if (backupUrl) {
        return {
            title: deepFind(backup, ['title']) || 'Video',
            thumbnail: deepFind(backup, ['thumbnail', 'thumb']) || '',
            downloadUrl: backupUrl,
            quality: deepFind(backup, ['high']) ? 'High' : 'Auto',
        };
    }

    throw new Error('Could not resolve a download link from either source.');
}

async function checkFileSize(url) {
    try {
        const res = await axios.head(url, { timeout: 10000, headers: { 'User-Agent': UA } });
        const len = parseInt(res.headers['content-length'] || '0', 10);
        return len ? len / (1024 * 1024) : null;
    } catch {
        return null;
    }
}

async function downloadToFile(url, threadID) {
    const filePath = path.join(TEMP_DIR, `autodl_${threadID.replace(/[^0-9]/g, '')}_${Date.now()}.mp4`);
    await fs.ensureDir(TEMP_DIR);
    const res = await axios.get(url, {
        responseType: 'arraybuffer', timeout: 90000, headers: { 'User-Agent': UA },
    });
    await fs.writeFile(filePath, Buffer.from(res.data));
    return filePath;
}

export async function handleAutoDownload(sock, message, from, sender, text) {
    const enabled = await threadsData.getSetting(from, 'autoDownload');
    if (!enabled) return false;

    const urls = extractValidUrls(text);
    if (!urls.length) return false;

    if (!checkRateLimit(sender)) {
        const resetTime = new Date(Date.now() + 3600000).toLocaleTimeString();
        await sock.sendMessage(from, {
            text: `⚠️ Auto-download rate limit reached.\n➤ Limit: ${HOURLY_LIMIT}/hour\n➤ Resets: ${resetTime}`
        }, { quoted: message });
        return true;
    }

    for (const { url, platform } of urls) {
        const queue = downloadQueue.get(from) || new Set();
        if (queue.has(url)) continue;
        queue.add(url);
        downloadQueue.set(from, queue);

        let filePath = null;
        try {
            await sock.sendMessage(from, { react: { text: '⏳', key: message.key } });

            const videoData = await callDownloadApi(url);
            const sizeMb = await checkFileSize(videoData.downloadUrl);
            if (sizeMb && sizeMb > MAX_SIZE_MB) {
                await sock.sendMessage(from, { react: { text: '⚠️', key: message.key } });
                await sock.sendMessage(from, {
                    text: `⚠️ Skipped: file is ~${sizeMb.toFixed(0)}MB, over the ${MAX_SIZE_MB}MB auto-download limit.\n🔗 ${url}`
                }, { quoted: message });
                continue;
            }

            filePath = await downloadToFile(videoData.downloadUrl, from);

            await sock.sendMessage(from, {
                video: { url: filePath },
                caption: `🎥 Auto-Downloaded\n➤ Platform: ${platform[0].toUpperCase()}${platform.slice(1)}\n➤ Title: ${videoData.title}\n➤ Quality: ${videoData.quality}`
            }, { quoted: message });

            await sock.sendMessage(from, { react: { text: '✅', key: message.key } });
        } catch (err) {
            await sock.sendMessage(from, { react: { text: '❌', key: message.key } });
            await sock.sendMessage(from, {
                text: `❌ Auto-download failed for ${platform}\n➤ ${err.message}\n🔗 ${url}`
            }, { quoted: message });
        } finally {
            queue.delete(url);
            if (filePath) await fs.remove(filePath).catch(() => {});
        }
    }

    return true;
}

export default {
    config: {
        name: 'autolink',
        aliases: ['autodl', 'autodownload'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Auto-download supported video links posted in a chat',
        longDescription: 'When enabled for a chat (group or private), automatically detects YouTube, Facebook, Instagram, TikTok, and Twitter/X links and downloads/sends the video.',
        category: 'downloader',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}autolink on | off | status' },
    },

    async onStart({ message, args, from, isGroup, isGroupAdmin, isOwner, isSudo, reply }) {
        const sub = (args[0] || '').toLowerCase();

        if (!['on', 'off', 'status'].includes(sub)) {
            return reply(
                `📱 Autolink Commands:\n` +
                `• autolink on — enable auto-download\n` +
                `• autolink off — disable auto-download\n` +
                `• autolink status — check current status\n\n` +
                `🎥 Supported: ${Object.keys(supportedPlatforms).join(', ')}`
            );
        }

        if (sub === 'status') {
            const enabled = await threadsData.getSetting(from, 'autoDownload');
            return reply(
                `📊 Auto-Download Status\n` +
                `➤ State: ${enabled ? 'enabled ✅' : 'disabled ❌'}\n` +
                `➤ Limit: ${HOURLY_LIMIT} downloads/hour per user\n` +
                `➤ Max size: ${MAX_SIZE_MB}MB\n` +
                `➤ Supported: ${Object.keys(supportedPlatforms).join(', ')}`
            );
        }

        const canManage = isGroup ? (isGroupAdmin || isOwner || isSudo) : true;
        if (!canManage) return reply('🚫 Only a group admin or bot owner can toggle auto-download here.');

        await threadsData.setSetting(from, 'autoDownload', sub === 'on');
        reply(
            sub === 'on'
                ? `✅ Auto-download enabled!\n🎯 Post any link from: ${Object.keys(supportedPlatforms).join(', ')}`
                : `❌ Auto-download disabled for this ${isGroup ? 'group' : 'chat'}.`
        );
    },
};
