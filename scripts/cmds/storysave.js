import axios from 'axios';

export default {
    config: {
        name: 'storysave',
        aliases: ['story', 'igstory', 'wastory'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download WhatsApp/Instagram stories',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}storysave <ig username> | {prefix}storysave <ig story url>' },
    },
    async onStart({ args, reply, sock, from, message }) {
        if (!args.length) return reply('Usage:\n• storysave <instagram username>\n• storysave <story URL>');

        const input = args[0];

        // Direct story URL
        if (input.includes('instagram.com/stories/')) {
            try {
                const { data } = await axios.post('https://api.cobalt.tools/', {
                    url: input,
                    filenameStyle: 'basic',
                }, {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    timeout: 30000,
                });

                if (!data.url) return reply('Could not fetch the story.');

                const { data: buffer } = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 60000 });
                const isVideo = (data.contentType || '').includes('video');

                if (isVideo) {
                    await sock.sendMessage(from, { video: Buffer.from(buffer), caption: '📱 Story video' }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { image: Buffer.from(buffer), caption: '📱 Story image' }, { quoted: message });
                }
            } catch {
                reply('Failed to download story. It might have expired.');
            }
            return;
        }

        // Username - try story saver API
        const username = input.replace('@', '');
        try {
            const { data } = await axios.get(`https://ig-story-download.p.rapidapi.com/v1/story/${username}`, {
                headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '' },
                timeout: 15000,
            });

            if (!data.stories?.length) return reply(`No stories found for @${username}`);

            for (const story of data.stories.slice(0, 5)) {
                const { data: buffer } = await axios.get(story.url, { responseType: 'arraybuffer', timeout: 30000 });
                if (story.type === 'video') {
                    await sock.sendMessage(from, { video: Buffer.from(buffer), caption: `📱 @${username}'s story` }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { image: Buffer.from(buffer), caption: `📱 @${username}'s story` }, { quoted: message });
                }
            }
        } catch {
            reply('Story download not available. You can provide a direct story URL instead.');
        }
    },
};
