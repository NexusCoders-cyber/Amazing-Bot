import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import logger from '../utils/logger.js';
import { cache } from '../utils/cache.js';
import config from '../config.js';

class DownloadService {
    constructor() {
        this.downloadQueue = new Map();
        this.activeDownloads = new Set();
        this.downloadStats = {
            total: 0,
            successful: 0,
            failed: 0,
            totalSize: 0
        };
        this.maxConcurrentDownloads = 3;
    }

    async downloadYouTube(url, format = 'video', quality = 'medium') {
        try {
            const { default: ytdl } = await import('ytdl-core');

            if (!ytdl.validateURL(url)) {
                throw new Error('Invalid YouTube URL');
            }

            const videoId = ytdl.getURLVideoID(url);
            const cacheKey = `yt_${format}_${quality}_${videoId}`;

            const cached = await cache.get(cacheKey);
            if (cached && await fs.pathExists(cached)) {
                logger.info(`Using cached download: ${videoId}`);
                return await fs.readFile(cached);
            }

            const info = await ytdl.getInfo(url);
            const videoInfo = {
                title: info.videoDetails.title,
                duration: parseInt(info.videoDetails.lengthSeconds),
                views: parseInt(info.videoDetails.viewCount),
                channel: info.videoDetails.author.name,
                thumbnail: info.videoDetails.thumbnails.pop()?.url
            };

            if (videoInfo.duration > 600) {
                throw new Error('Video too long (max 10 minutes)');
            }

            const tempDir = path.join(process.cwd(), 'temp', 'downloads');
            await fs.ensureDir(tempDir);

            let outputPath;
            let downloadStream;

            if (format === 'audio') {
                outputPath = path.join(tempDir, `${videoId}.mp3`);
                downloadStream = ytdl(url, {
                    filter: 'audioonly',
                    quality: 'highestaudio'
                });
            } else {
                outputPath = path.join(tempDir, `${videoId}.mp4`);
                const qualityMap = {
                    low: 'lowest',
                    medium: 'highest',
                    high: 'highestvideo'
                };

                downloadStream = ytdl(url, {
                    filter: fmt => fmt.container === 'mp4',
                    quality: qualityMap[quality] || 'highest'
                });
            }

            const writeStream = fs.createWriteStream(outputPath);
            downloadStream.pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
                downloadStream.on('error', reject);
            });

            const buffer = await fs.readFile(outputPath);

            await cache.set(cacheKey, outputPath, 3600);
            this.downloadStats.successful++;
            this.downloadStats.totalSize += buffer.length;

            setTimeout(() => fs.remove(outputPath).catch(() => {}), 3600000);

            return { buffer, info: videoInfo };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('YouTube download failed:', error);
            throw error;
        }
    }

    async getYouTubeInfo(url) {
        try {
            const { default: ytdl } = await import('ytdl-core');

            if (!ytdl.validateURL(url)) {
                throw new Error('Invalid YouTube URL');
            }

            const videoId = ytdl.getURLVideoID(url);
            const cacheKey = `yt_info_${videoId}`;

            const cached = await cache.get(cacheKey);
            if (cached) {
                return cached;
            }

            const info = await ytdl.getInfo(url);
            const videoInfo = {
                id: videoId,
                title: info.videoDetails.title,
                description: info.videoDetails.description?.substring(0, 200),
                duration: parseInt(info.videoDetails.lengthSeconds),
                views: parseInt(info.videoDetails.viewCount),
                likes: parseInt(info.videoDetails.likes) || 0,
                channel: {
                    name: info.videoDetails.author.name,
                    url: info.videoDetails.author.channel_url,
                    verified: info.videoDetails.author.verified || false
                },
                thumbnails: info.videoDetails.thumbnails,
                uploadDate: info.videoDetails.publishDate,
                category: info.videoDetails.category,
                keywords: info.videoDetails.keywords?.slice(0, 10) || [],
                isLiveContent: info.videoDetails.isLiveContent || false
            };

            await cache.set(cacheKey, videoInfo, 1800);
            return videoInfo;
        } catch (error) {
            logger.error('YouTube info fetch failed:', error);
            throw error;
        }
    }

    async downloadInstagram(url) {
        try {
            const response = await axios.get(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`);
            const postData = response.data;

            if (!postData.thumbnail_url) {
                throw new Error('Could not extract media URL');
            }

            const mediaResponse = await axios.get(postData.thumbnail_url, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += mediaResponse.data.length;

            return {
                buffer: Buffer.from(mediaResponse.data),
                info: {
                    title: postData.title,
                    author: postData.author_name,
                    thumbnail: postData.thumbnail_url,
                    type: 'instagram'
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Instagram download failed:', error);
            throw new Error('Failed to download Instagram media');
        }
    }

    async downloadTikTok(url) {
        try {
            const apiUrl = `https://api.tiktokv.com/aweme/v1/feed/?aweme_id=${this.extractTikTokId(url)}`;

            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'TikTok/2021 (iPhone; iOS 14.0; Scale/2.00)'
                },
                timeout: 15000
            });

            const videoData = response.data.aweme_list?.[0];
            if (!videoData) {
                throw new Error('TikTok video not found');
            }

            const videoUrl = videoData.video.play_addr.url_list[0];
            const mediaResponse = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'Referer': 'https://www.tiktok.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += mediaResponse.data.length;

            return {
                buffer: Buffer.from(mediaResponse.data),
                info: {
                    title: videoData.desc,
                    author: videoData.author.nickname,
                    views: videoData.statistics.play_count,
                    likes: videoData.statistics.digg_count,
                    shares: videoData.statistics.share_count,
                    type: 'tiktok'
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('TikTok download failed:', error);
            throw new Error('Failed to download TikTok video');
        }
    }

    extractTikTokId(url) {
        const match = url.match(/(?:tiktok\.com\/)(?:@[\w.-]+\/video\/|v\/|embed\/|watch\?v=)?([\w.-]+)/);
        return match ? match[1] : null;
    }

    async downloadFacebook(url) {
        try {
            const response = await axios.post('https://www.getfvid.com/downloader', {
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 20000
            });

            const videoUrlMatch = response.data.match(/href="([^"]*)".*?download.*?HD/i);
            if (!videoUrlMatch) {
                throw new Error('Could not extract Facebook video URL');
            }

            const videoUrl = videoUrlMatch[1];
            const mediaResponse = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += mediaResponse.data.length;

            return {
                buffer: Buffer.from(mediaResponse.data),
                info: {
                    type: 'facebook',
                    size: mediaResponse.data.length
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Facebook download failed:', error);
            throw new Error('Failed to download Facebook video');
        }
    }

    async downloadTwitter(url) {
        try {
            const tweetId = this.extractTwitterId(url);
            if (!tweetId) {
                throw new Error('Invalid Twitter URL');
            }

            const apiUrl = `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&include_entities=true`;

            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${config.apis?.twitter?.bearerToken}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000
            });

            const tweetData = response.data;
            const media = tweetData.extended_entities?.media?.[0];

            if (!media) {
                throw new Error('No media found in tweet');
            }

            let mediaUrl;
            if (media.type === 'video' || media.type === 'animated_gif') {
                const variants = media.video_info.variants.filter(v => v.content_type === 'video/mp4');
                mediaUrl = variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]?.url;
            } else {
                mediaUrl = media.media_url_https;
            }

            if (!mediaUrl) {
                throw new Error('Could not extract media URL');
            }

            const mediaResponse = await axios.get(mediaUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += mediaResponse.data.length;

            return {
                buffer: Buffer.from(mediaResponse.data),
                info: {
                    title: tweetData.text,
                    author: tweetData.user.screen_name,
                    likes: tweetData.favorite_count,
                    retweets: tweetData.retweet_count,
                    type: 'twitter',
                    mediaType: media.type
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Twitter download failed:', error);
            throw new Error('Failed to download Twitter media');
        }
    }

    extractTwitterId(url) {
        const match = url.match(/status\/(\d+)/);
        return match ? match[1] : null;
    }

    async downloadFromMediafire(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000
            });

            const downloadLinkMatch = response.data.match(/href="([^"]*)" class="input popsok"/);
            if (!downloadLinkMatch) {
                throw new Error('Could not extract MediaFire download link');
            }

            const downloadUrl = downloadLinkMatch[1];
            const fileResponse = await axios.get(downloadUrl, {
                responseType: 'arraybuffer',
                timeout: 120000,
                maxContentLength: config.media?.download?.maxFileSize || 100 * 1024 * 1024,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const filenameMatch = response.data.match(/<div class="filename">([^<]+)<\/div>/);
            const filename = filenameMatch ? filenameMatch[1] : 'download';

            this.downloadStats.successful++;
            this.downloadStats.totalSize += fileResponse.data.length;

            return {
                buffer: Buffer.from(fileResponse.data),
                info: {
                    filename,
                    size: fileResponse.data.length,
                    type: 'mediafire'
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('MediaFire download failed:', error);
            throw new Error('Failed to download from MediaFire');
        }
    }

    async downloadFromGoogleDrive(url) {
        try {
            const fileId = this.extractGoogleDriveId(url);
            if (!fileId) {
                throw new Error('Invalid Google Drive URL');
            }

            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

            const response = await axios.get(downloadUrl, {
                responseType: 'arraybuffer',
                timeout: 120000,
                maxContentLength: config.media?.download?.maxFileSize || 100 * 1024 * 1024,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += response.data.length;

            return {
                buffer: Buffer.from(response.data),
                info: {
                    fileId,
                    size: response.data.length,
                    type: 'googledrive'
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Google Drive download failed:', error);
            throw new Error('Failed to download from Google Drive');
        }
    }

    extractGoogleDriveId(url) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    }

    async downloadPinterestImage(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000
            });

            const imageUrlMatch = response.data.match(/"url": "([^"]*\.(?:jpg|jpeg|png|gif|webp))/i);
            if (!imageUrlMatch) {
                throw new Error('Could not extract Pinterest image URL');
            }

            const imageUrl = imageUrlMatch[1].replace(/\\u002F/g, '/');
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.pinterest.com/'
                }
            });

            this.downloadStats.successful++;
            this.downloadStats.totalSize += imageResponse.data.length;

            return {
                buffer: Buffer.from(imageResponse.data),
                info: {
                    type: 'pinterest',
                    size: imageResponse.data.length
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Pinterest download failed:', error);
            throw new Error('Failed to download Pinterest image');
        }
    }

    async downloadGeneric(url, options = {}) {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: options.timeout || 60000,
                maxContentLength: options.maxSize || config.media?.download?.maxFileSize || 50 * 1024 * 1024,
                headers: {
                    'User-Agent': options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    ...options.headers
                }
            });

            const contentType = response.headers['content-type'] || '';
            const contentLength = parseInt(response.headers['content-length'] || '0');

            if (contentLength > (options.maxSize || 50 * 1024 * 1024)) {
                throw new Error('File too large');
            }

            this.downloadStats.successful++;
            this.downloadStats.totalSize += response.data.length;

            return {
                buffer: Buffer.from(response.data),
                info: {
                    contentType,
                    size: response.data.length,
                    type: 'generic'
                }
            };
        } catch (error) {
            this.downloadStats.failed++;
            logger.error('Generic download failed:', error);
            throw error;
        }
    }

    detectPlatform(url) {
        const platforms = {
            youtube: /(?:youtube\.com|youtu\.be)/i,
            instagram: /instagram\.com/i,
            tiktok: /tiktok\.com/i,
            facebook: /(?:facebook\.com|fb\.watch)/i,
            twitter: /(?:twitter\.com|t\.co)/i,
            mediafire: /mediafire\.com/i,
            googledrive: /drive\.google\.com/i,
            pinterest: /pinterest\.com/i
        };

        for (const [platform, regex] of Object.entries(platforms)) {
            if (regex.test(url)) {
                return platform;
            }
        }

        return 'generic';
    }

    async smartDownload(url, options = {}) {
        try {
            this.downloadStats.total++;

            if (this.activeDownloads.size >= this.maxConcurrentDownloads) {
                throw new Error('Too many concurrent downloads. Please try again later.');
            }

            this.activeDownloads.add(url);

            const platform = this.detectPlatform(url);
            let result;

            switch (platform) {
                case 'youtube':
                    result = await this.downloadYouTube(url, options.format, options.quality);
                    break;
                case 'instagram':
                    result = await this.downloadInstagram(url);
                    break;
                case 'tiktok':
                    result = await this.downloadTikTok(url);
                    break;
                case 'facebook':
                    result = await this.downloadFacebook(url);
                    break;
                case 'twitter':
                    result = await this.downloadTwitter(url);
                    break;
                case 'mediafire':
                    result = await this.downloadFromMediafire(url);
                    break;
                case 'googledrive':
                    result = await this.downloadFromGoogleDrive(url);
                    break;
                case 'pinterest':
                    result = await this.downloadPinterestImage(url);
                    break;
                default:
                    result = await this.downloadGeneric(url, options);
                    break;
            }

            result.platform = platform;
            return result;
        } finally {
            this.activeDownloads.delete(url);
        }
    }

    convertAudio(inputPath, outputFormat = 'mp3') {
        return new Promise((resolve, reject) => {
            const outputPath = inputPath.replace(path.extname(inputPath), `.${outputFormat}`);

            const ffmpeg = spawn('ffmpeg', [
                '-i', inputPath,
                '-acodec', outputFormat === 'mp3' ? 'libmp3lame' : 'aac',
                '-ab', '128k',
                '-y',
                outputPath
            ]);

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve(outputPath);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });

            ffmpeg.on('error', reject);
        });
    }

    convertVideo(inputPath, outputFormat = 'mp4') {
        return new Promise((resolve, reject) => {
            const outputPath = inputPath.replace(path.extname(inputPath), `.${outputFormat}`);

            const ffmpeg = spawn('ffmpeg', [
                '-i', inputPath,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-preset', 'fast',
                '-crf', '23',
                '-y',
                outputPath
            ]);

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve(outputPath);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });

            ffmpeg.on('error', reject);
        });
    }

    getDownloadStats() {
        return {
            ...this.downloadStats,
            activeDownloads: this.activeDownloads.size,
            queuedDownloads: this.downloadQueue.size,
            successRate: this.downloadStats.total > 0
                ? (this.downloadStats.successful / this.downloadStats.total * 100).toFixed(2) + '%'
                : '0%',
            totalSizeMB: (this.downloadStats.totalSize / (1024 * 1024)).toFixed(2)
        };
    }

    clearCache() {
        const tempDir = path.join(process.cwd(), 'temp', 'downloads');
        fs.emptyDir(tempDir).catch(() => {});
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    getSupportedPlatforms() {
        return ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter', 'MediaFire', 'Google Drive', 'Pinterest'];
    }

    generateDownloadReport() {
        const stats = this.getDownloadStats();

        return `📥 *Download Service Report*\n\n📊 *Statistics:*\n├ Total Downloads: ${stats.total}\n├ Successful: ${stats.successful}\n├ Failed: ${stats.failed}\n├ Success Rate: ${stats.successRate}\n├ Active Downloads: ${stats.activeDownloads}\n╰ Total Size: ${stats.totalSizeMB} MB\n\n🌐 *Supported Platforms:*\n${this.getSupportedPlatforms().map(p => `• ${p}`).join('\n')}\n\n⚡ *Performance:*\n├ Queue Length: ${stats.queuedDownloads}\n├ Cache Status: Active\n╰ Auto-cleanup: Enabled`;
    }
}

export const downloadService = new DownloadService();

export const downloadYouTube = (url, format, quality) => downloadService.downloadYouTube(url, format, quality);
export const getYouTubeInfo = (url) => downloadService.getYouTubeInfo(url);
export const downloadInstagram = (url) => downloadService.downloadInstagram(url);
export const downloadTikTok = (url) => downloadService.downloadTikTok(url);
export const downloadFacebook = (url) => downloadService.downloadFacebook(url);
export const downloadTwitter = (url) => downloadService.downloadTwitter(url);
export const downloadFromMediafire = (url) => downloadService.downloadFromMediafire(url);
export const downloadFromGoogleDrive = (url) => downloadService.downloadFromGoogleDrive(url);
export const downloadPinterestImage = (url) => downloadService.downloadPinterestImage(url);
export const smartDownload = (url, options) => downloadService.smartDownload(url, options);
export const convertAudio = (input, format) => downloadService.convertAudio(input, format);
export const convertVideo = (input, format) => downloadService.convertVideo(input, format);
export const detectPlatform = (url) => downloadService.detectPlatform(url);
export const isValidUrl = (url) => downloadService.isValidUrl(url);
export const getDownloadStats = () => downloadService.getDownloadStats();
export const getSupportedPlatforms = () => downloadService.getSupportedPlatforms();
export const generateDownloadReport = () => downloadService.generateDownloadReport();
export const clearCache = () => downloadService.clearCache();

export default downloadService;
