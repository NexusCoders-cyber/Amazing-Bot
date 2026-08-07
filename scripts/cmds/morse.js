export default {
    config: {
        name: 'morse',
        aliases: ['morsecode'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Encode/decode morse code',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}morse <encode|decode> <text>' },
    },
    async onStart({ args, reply, prefix, React }) {
        React('📡');
        if (args.length < 2) return reply(`Usage: ${prefix}morse <encode|decode> <text>`);
        const mode = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        const CHAR_MAP = { a:'.-', b:'-...', c:'-.-.', d:'-..', e:'.', f:'..-.', g:'--.', h:'....', i:'..', j:'.---', k:'-.-', l:'.-..', m:'--', n:'-.', o:'---', p:'.--.', q:'--.-', r:'.-.', s:'...', t:'-', u:'..-', v:'...-', w:'.--', x:'-..-', y:'-.--', z:'--..', '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.' };
        const REV_MAP = Object.fromEntries(Object.entries(CHAR_MAP).map(([k,v]) => [v,k]));

        if (mode === 'encode') {
            const result = text.toLowerCase().split('').map(c => c === ' ' ? '/' : CHAR_MAP[c] || c).join(' ');
            reply(`📡 *Morse:*\n\`${result}\``);
        } else if (mode === 'decode') {
            const result = text.split(' ').map(c => c === '/' ? ' ' : REV_MAP[c] || c).join('');
            reply(`📝 *Decoded:*\n${result}`);
        } else {
            reply(`Use *encode* or *decode*`);
        }
    },
};
