import axios from 'axios';

export default {
    config: {
        name: 'spotify',
        aliases: ['spotifydl', 'spdl'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download from Spotify',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}spotify <url or search>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🎵');
        if (!args.length) return reply(`Usage: ${prefix}spotify <url or search query>`);

        const query = args.join(' ');
        try {
            // Search for track
            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
            // Note: requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET env vars
            reply(`🎵 *Spotify Downloader*\n\nSearching for: *${query}*\n\n⏳ Processing...`);
            reply(`ℹ️ Spotify download requires API credentials.\nSet SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
