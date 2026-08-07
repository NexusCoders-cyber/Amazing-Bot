export default {
    config: { name: 'whatsmyip', aliases: ['myip'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get your IP address', category: 'utility', coolDown: 5, role: 0, guide: { en: '{prefix}whatsmyip' } },
    async onStart({ reply, React }) {
        React('🌐');
        try { const { data } = await (await import('axios')).default.get('https://api.ipify.org?format=json', { timeout: 5000 }); reply(`🌐 Your IP: *${data.ip}*`); } catch { reply('❌ Could not fetch IP.'); }
    },
};
