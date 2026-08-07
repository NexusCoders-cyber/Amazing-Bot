export default {
    config: {
        name: 'steal',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Steal coins from random',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}steal' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const eco = getEco(sender); if((eco.wallet||0)<50) return reply('Need at least 50 coins!'); const chance = Math.random(); if(chance>0.6){const amt=Math.floor(Math.random()*200)+50;saveEco(sender,{wallet:(eco.wallet||0)+amt});reply(`🦹 You stole ${fmtCoins(amt)}!`);}else{const loss=Math.floor(Math.random()*100)+25;saveEco(sender,{wallet:(eco.wallet||0)-loss});reply(`🚨 You got caught! Lost ${fmtCoins(loss)}`);}
    },
};
