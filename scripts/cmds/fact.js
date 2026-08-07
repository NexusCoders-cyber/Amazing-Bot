export default {
    config: {
        name: 'fact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random fact',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}fact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { const r = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random'); const d = await r.json(); reply(`🧠 *Fact:*
        ${d.text}`); } catch { reply('🧠 Cats have over 20 vocalizations.'); }
    },
};
