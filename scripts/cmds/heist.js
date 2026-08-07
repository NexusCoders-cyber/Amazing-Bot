export default {
    config: {
        name: 'heist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Rob a bank',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}heist' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const eco = getEco(sender); const amt = Math.floor(Math.random()*500)+100; const chance = Math.random(); if(chance>0.5){saveEco(sender,{wallet:(eco.wallet||0)+amt});reply(`🏦 *HEIST SUCCESS!*\nYou got away with ${fmtCoins(amt)}!`);}else{const fine=Math.floor(Math.random()*300)+50;saveEco(sender,{wallet:(eco.wallet||0)-fine});reply(`🚨 *HEIST FAILED!*\nYou were caught. Fine: ${fmtCoins(fine)}`);}
    },
};
