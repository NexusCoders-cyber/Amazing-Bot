export default {
    config: {
        name: 'coinflip3',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Coin flip with bet',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}coinflip3 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const [amt,guess] = [parseInt(args[0])||100, args[1]?.toLowerCase()]; if(!['heads','tails'].includes(guess)) return reply('Usage: .coinflip3 <amount> <heads|tails>'); const eco = getEco(sender); if((eco.wallet||0)<amt) return reply('Not enough coins!'); const result = Math.random()>0.5?'heads':'tails'; if(result===guess) { saveEco(sender,{wallet:(eco.wallet||0)+amt}); reply(`🪙 *${result.toUpperCase()}*! Won ${fmtCoins(amt)}!`); } else { saveEco(sender,{wallet:(eco.wallet||0)-amt}); reply(`🪙 *${result.toUpperCase()}*! Lost ${fmtCoins(amt)}`); }
    },
};
