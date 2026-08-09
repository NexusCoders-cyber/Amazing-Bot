import axios from 'axios';
export default {
    config: {
        name: 'weather2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .weather2 <city>nExample: .weather2 Lagos',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}weather2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const city = args.join(' ');
            if (!city) return reply('Usage: .weather2 <city>\nExample: .weather2 Lagos');
            try {
                const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/tools/weather`, { params: { city: args[0] || '' }, timeout: 60000 });
                reply(`🌦️ ${data}`);
            } catch (e) {
                reply('Could not fetch weather for that location.');
            }
        
    },
};
