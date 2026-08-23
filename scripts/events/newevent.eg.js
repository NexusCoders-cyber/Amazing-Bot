export default {
    config: {
        name: 'welcomeevent',
        author: 'Ilom',
        version: '1.0',
        shortDescription: 'Auto welcome/goodbye event handler',
        category: 'events',
        role: 0,
    },

    async onStart({ sock, from, participants, action, metadata }) {
        if (!metadata) return;

        if (action === 'add') {
            for (const jid of participants) {
                const phone = jid.split('@')[0];
                let pic = null;
                try { pic = await sock.profilePictureUrl(jid, 'image'); } catch {}

                const text = `👋 Welcome @${phone} to *${metadata.subject}*!\n\nWe're glad to have you here. Please read the group rules.`;

                if (pic) {
                    await sock.sendMessage(from, { image: { url: pic }, caption: text, mentions: [jid] });
                } else {
                    await sock.sendMessage(from, { text, mentions: [jid] });
                }
            }
        }

        if (action === 'remove') {
            for (const jid of participants) {
                const phone = jid.split('@')[0];
                await sock.sendMessage(from, {
                    text: `👋 Goodbye @${phone}! We'll miss you.`,
                    mentions: [jid]
                });
            }
        }
    },
};
