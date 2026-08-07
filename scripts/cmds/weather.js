import axios from 'axios';
import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'weather',
        aliases: ['forecast'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get weather info',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}weather <city>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🌤️');
        if (!args.length) return reply(`Usage: ${prefix}weather <city>`);

        const city = args.join(' ');
        try {
            const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const cur = data.current_condition?.[0];
            if (!cur) return reply(`❌ Could not find weather for "${city}"`);

            reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  🌤️ *WEATHER*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  📍 ${city}`,
                ``,
                `  🌡️ Temperature: *${cur.temp_C}°C* / *${cur.temp_F}°F*`,
                `  🤔 Feels like: *${cur.FeelsLikeC}°C*`,
                `  💧 Humidity: *${cur.humidity}%*`,
                `  💨 Wind: *${cur.windspeedKmph} km/h* ${cur.winddir16Point}`,
                `  ☁️ Condition: *${cur.weatherDesc?.[0]?.value || 'N/A'}*`,
                `  👁️ Visibility: *${cur.visibility} km*`,
                `  🌡️ Pressure: *${cur.pressure} mb*`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        } catch {
            reply(`❌ Could not find weather for "${city}"`);
        }
    },
};
