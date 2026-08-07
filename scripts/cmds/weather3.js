export default {
    config: { name: 'weather2', aliases: ['w2'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get weather info (v2)', category: 'utility', coolDown: 5, role: 0, guide: { en: '{prefix}weather2 <city>' } },
    async onStart({ args, reply, prefix, React }) {
        React('🌤️');
        if (!args.length) return reply(`Usage: ${prefix}weather2 <city>`);
        const city = args.join(' ');
        try { const { default: axios } = await import('axios'); const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 }); const c = data.current_condition?.[0]; if (!c) return reply('❌ City not found'); reply(`🌤️ *${city}*\n🌡️ ${c.temp_C}°C / ${c.temp_F}°F\n💧 ${c.humidity}%\n💨 ${c.windspeedKmph} km/h\n☁️ ${c.weatherDesc?.[0]?.value || 'N/A'}`); } catch { reply('❌ Weather fetch failed.'); }
    },
};
