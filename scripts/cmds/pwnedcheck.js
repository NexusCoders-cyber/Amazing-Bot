export default {
    config: {
        name: 'pwnedcheck',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .pwnedcheck <password>nChecks if a password has appeared in known data b',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}pwnedcheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .pwnedcheck <password>\nChecks if a password has appeared in known data breaches. Only a partial hash prefix is ever sent — your actual password never leaves your device.');
            const sha1 = crypto.createHash('sha1').update(text).digest('hex').toUpperCase();
            const prefix = sha1.slice(0, 5);
            const suffix = sha1.slice(5);
            try {
                const { data } = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
                const lines = data.split('\n');
                const match = lines.find(l => l.startsWith(suffix));
                if (match) {
                    const count = match.split(':')[1]?.trim();
                    reply(`⚠️ This password has been seen in *${count}* known data breaches. Please don't use it — pick something unique.`);
                } else {
                    reply(`✅ Good news — this password wasn't found in any known breach database. (Still, make sure it's unique to this account.)`);
                }
            } catch (e) {
                reply('Could not check that right now.');
            }
        
    },
};
