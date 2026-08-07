export default {
    config: {
        name: 'followupreminder',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .followupreminder <duration> <who/what to follow up on>nExample: .follow',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}followupreminder <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .followupreminder <duration> <who/what to follow up on>\nExample: .followupreminder 3d Check if Sarah replied about the proposal');
            const durationMs = parseDuration(args[0]);
            if (!durationMs) return reply('Invalid duration format. Use something like 3d, 2h, or 30m.');
            const note = args.slice(1).join(' ');
            if (durationMs > 30 * 86400000) return reply('Follow-up reminders are capped at 30 days.');
            reply(`📌 Follow-up reminder set for ${args[0]} from now: "${note}"`);
            setTimeout(() => {
                King.sendMessage(from, { text: `🔔 *Follow-up reminder:* ${note}` }, { quoted: m }).catch(() => {});
            }, durationMs);
        
    },
};
