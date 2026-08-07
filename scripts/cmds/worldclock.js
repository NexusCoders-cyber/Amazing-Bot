export default {
    config: {
        name: 'worldclock',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🌍 *World Clock:*n${out}',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}worldclock <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const zones = [
                ['New York', 'America/New_York'],
                ['London', 'Europe/London'],
                ['Lagos', 'Africa/Lagos'],
                ['Dubai', 'Asia/Dubai'],
                ['Tokyo', 'Asia/Tokyo'],
                ['Sydney', 'Australia/Sydney']
            ];
            const out = zones.map(([label, tz]) => {
                const time = new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
                return `${label}: ${time}`;
            }).join('\n');
            reply(`🌍 *World Clock:*\n${out}`);
        
    },
};
