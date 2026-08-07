import axios from 'axios';

export default {
    config: {
        name: 'igstory',
        aliases: ['stories', 'storysave2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download Instagram stories',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}igstory <username>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📸');
        if (!args.length) return reply(`Usage: ${prefix}igstory <Instagram username>`);

        const username = args[0].replace('@', '');
        try {
            reply(`📸 Fetching stories for @${username}...\n\nℹ️ Instagram story download requires API access.`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
