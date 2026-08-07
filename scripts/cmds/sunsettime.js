export default {
    config: {
        name: 'sunsettime',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .sunsettime <latitude> <longitude>nExample: .sunsettime 6.5244 3.3792',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}sunsettime <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .sunsettime <latitude> <longitude>\nExample: .sunsettime 6.5244 3.3792');
            const [lat, lng] = args;
            try {
                const { data } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
                const t = new Date(data.results.sunset);
                reply(`🌇 Sunset: ${t.toUTCString()}`);
            } catch (e) {
                reply('Could not fetch sunset time. Check your coordinates.');
            }
        
    },
};
