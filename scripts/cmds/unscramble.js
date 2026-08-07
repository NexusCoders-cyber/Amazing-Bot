export default {
    config: {
        name: 'unscramble',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Unscramble a word',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}unscramble <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const words = ['javascript','python','developer','algorithm','database','function','variable','terminal','keyboard','internet','computer','network','software','hardware','bluetooth','compiler','compiler','frontend','backend','browser']; const w = words[Math.floor(Math.random()*words.length)]; const s = w.split('').sort(()=>Math.random()-0.5).join(''); reply(`🔤 *Unscramble:*
        `${s}`
        
        Use ${prefix}guessword <answer>`); global._uns = global._uns||{}; global._uns[from] = w;
    },
};
