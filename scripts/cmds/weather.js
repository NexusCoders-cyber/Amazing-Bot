import axios from 'axios';

export default {
    config: {
        name: 'weather',
        aliases: ['w'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Get current weather for any city',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}weather <city>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('Usage: weather <city>');
        const city = args.join(' ');

        try {
            const key = process.env.WEATHER_API_KEY;
            let text;

            if (key) {
                const { data } = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`,
                    { timeout: 10000 }
                );
                const { main, weather, wind, name, sys } = data;
                text = [
                    `Weather - ${name}, ${sys.country}`,
                    ``,
                    `Temp      : ${main.temp}C (feels ${main.feels_like}C)`,
                    `Condition : ${weather[0].description}`,
                    `Humidity  : ${main.humidity}%`,
                    `Wind      : ${wind.speed} m/s`,
                    `Min / Max : ${main.temp_min}C / ${main.temp_max}C`,
                ].join('\n');
            } else {
                const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
                const cur = data.current_condition?.[0];
                const area = data.nearest_area?.[0]?.areaName?.[0]?.value || city;
                const country = data.nearest_area?.[0]?.country?.[0]?.value || '';
                text = [
                    `Weather - ${area}, ${country}`,
                    ``,
                    `Temp      : ${cur.temp_C}C (feels ${cur.FeelsLikeC}C)`,
                    `Condition : ${cur.weatherDesc?.[0]?.value}`,
                    `Humidity  : ${cur.humidity}%`,
                    `Wind      : ${cur.windspeedKmph} km/h ${cur.winddir16Point}`,
                    `Visibility: ${cur.visibility} km`,
                ].join('\n');
            }
            reply(text);
        } catch {
            reply(`Could not get weather for "${city}". Check the spelling and try again.`);
        }
    },
};
