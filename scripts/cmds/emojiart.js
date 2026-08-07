export default {
    config: { name: 'emojiart', aliases: ['ea'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Generate emoji art patterns', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}emojiart' } },
    async onStart({ reply, React }) {
        React('🎨');
        const patterns = [
            '❤️❤️❤️🤍🤍❤️❤️❤️\n❤️🤍🤍❤️🤍❤️🤍🤍\n🤍🤍🤍❤️🤍❤️🤍🤍\n🤍🤍🤍🤍🤍🤍🤍🤍\n🤍🤍🤍🤍🤍🤍🤍🤍',
            '☀️🌤️⛅🌥️☁️🌧️⛈️🌤️☀️\n🌅🌇🌆🏙️🌃🌉🌌✨',
            '🌸🌺🌻🌹🌷🌼💐🌺🌸\n🌿🍃🍂🍁🌾🌱☘️🍀🌿',
            '🔥🔥🔥🔥🔥\n🔥💎💎💎🔥\n🔥💎⭐💎🔥\n🔥💎💎💎🔥\n🔥🔥🔥🔥🔥',
            '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️▶️⏸️',
        ];
        reply(patterns[Math.floor(Math.random() * patterns.length)]);
    },
};
