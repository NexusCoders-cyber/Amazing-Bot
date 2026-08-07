export default {
    config: {
        name: 'randomuseragent',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'randomuseragent',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randomuseragent <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1'
            ];
            reply(agents[Math.floor(Math.random() * agents.length)]);
        
    },
};
