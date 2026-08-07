export default {
    config: {
        name: 'jwtdecode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .jwtdecode <jwt token>n(Decodes only — does not verify signature.)',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jwtdecode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .jwtdecode <jwt token>\n(Decodes only — does not verify signature.)');
            try {
                const parts = text.trim().split('.');
                if (parts.length < 2) return reply('That doesn\'t look like a valid JWT.');
                const decode = p => JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
                const header = decode(parts[0]);
                const payload = decode(parts[1]);
                reply(`🔑 *JWT Decoded*\n\nHeader:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\n⚠️ Signature not verified.`);
            } catch (e) {
                reply('Could not decode that as a JWT.');
            }
        
    },
};
