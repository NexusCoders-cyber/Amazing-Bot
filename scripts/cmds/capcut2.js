import axios from 'axios';

export default {
    config: {
        name: 'capcut2',
        aliases: ['cc2', 'capcutdl'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download CapCut templates',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}capcut2 <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('✂️');
        if (!args.length) return reply(`Usage: ${prefix}capcut2 <CapCut URL>`);

        const url = args[0];
        try {
            const api = `https://api.konalube.my.id/capcut?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(api, { timeout: 30000 });

            if (!data?.url) return reply(`❌ Could not fetch template.`);

            await reply({
                video: { url: data.url },
                caption: `✂️ *CapCut Template*\n━━━━━━━━━━━━━━━━━━━━\n📝 ${data.title || 'Template'}\n━━━━━━━━━━━━━━━━━━━━`,
            });
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
