export default {
    config: {
        name: 'duel2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Duel someone for coins',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}duel2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const bet = parseInt(args[0])||100; const eco = getEco(sender); if((eco.wallet||0)<bet) return reply('Not enough coins!'); const win = Math.random()>0.5; if(win){saveEco(sender,{wallet:(eco.wallet||0)+bet});reply(`⚔️ You WON ${fmtCoins(bet)}!`);}else{saveEco(sender,{wallet:(eco.wallet||0)-bet});reply(`💀 You lost ${fmtCoins(bet)}`);}
    },
};
