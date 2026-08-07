import axios from 'axios';

export default {
    config: {
        name: 'wiki',
        aliases: ['wikipedia'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Search Wikipedia',
        category: 'fun',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}wiki <search query>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('Usage: wiki <search query>');

        const query = args.join(' ');
        try {
            const { data } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query), { timeout: 10000 });

            if (data.type === 'disambiguation') {
                return reply(`"${query}" is a disambiguation page. Try a more specific term.`);
            }

            reply([
                `📚 *${data.title}*`,
                '',
                data.extract || 'No summary available.',
                '',
                data.content_urls?.desktop?.page || '',
            ].join('\n'));
        } catch {
            reply(`No Wikipedia article found for "${query}".`);
        }
    },
};
