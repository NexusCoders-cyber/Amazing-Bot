import axios from 'axios';

export default {
    config: {
        name: 'ytmp4',
        aliases: ['ytv', 'ytvideo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download YouTube as MP4',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}ytmp4 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🎬');
        if (!args.length) return reply(`Usage: ${prefix}ytmp4 <YouTube URL>`);

        const url = args[0];
        if (!url.includes('youtu')) return reply(`❌ Provide a valid YouTube URL.`);

        try {
            reply(`🎬 YouTube video download requires a backend API.\nUse the *play* command or *video* command for YouTube downloads.`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
