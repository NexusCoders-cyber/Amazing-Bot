import axios from 'axios';

/**
 * Shared cobalt.tools download helper
 * Works with TikTok, Instagram, Twitter, Facebook, Pinterest, YouTube, Reddit, etc.
 */
export async function cobaltDownload(url, opts = {}) {
    // Try cobalt v7 API
    try {
        const { data } = await axios.post('https://api.cobalt.tools/api/json', {
            url,
            vCodec: 'h264',
            vQuality: opts.quality || '720',
            isAudioOnly: opts.audio || false,
            isNoTTWatermark: true,
            isNoWM: true,
        }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 30000,
        });
        if (data?.url) return { url: data.url, filename: data.filename };
    } catch {}

    // Try cobalt v10 API
    try {
        const { data } = await axios.post('https://api.cobalt.tools/', {
            url,
            videoQuality: opts.quality || '720',
            audioFormat: opts.audio ? 'mp3' : undefined,
            filenameStyle: 'basic',
        }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 30000,
        });
        if (data?.url) return { url: data.url };
    } catch {}

    return null;
}

/**
 * Download buffer from URL with timeout
 */
export async function fetchBuffer(url, timeout = 60000) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout });
    return Buffer.from(res.data);
}

/**
 * Validate URL belongs to a specific platform
 */
export function validateUrl(url, patterns) {
    return patterns.some(p => url.includes(p));
}
