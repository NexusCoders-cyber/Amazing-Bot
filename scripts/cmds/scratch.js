export default {
    config: {
        name: 'scratch',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Scratch card',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}scratch' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const eco = getEco(sender); const symbols = ['🍒','🍋','🍊','⭐','💎','7️⃣']; const cards = Array.from({length:9},()=>symbols[Math.floor(Math.random()*6)]); const matches = cards.filter(c=>c===cards[0]).length; let reward = 0; if(matches>=5) reward=500; else if(matches>=3) reward=200; else if(matches>=2) reward=50; if(reward>0){saveEco(sender,{wallet:(eco.wallet||0)+reward});reply(`🎰 *Scratch Card:*\n${cards.join(' ')}\n\n🎉 Won ${fmtCoins(reward)}! (${matches} matches)`);}else{reply(`🎰 *Scratch Card:*\n${cards.join(' ')}\n\nNo matches. Try again!`);}
    },
};
