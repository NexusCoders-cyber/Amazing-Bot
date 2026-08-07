export default {
    config: {
        name: 'slots2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Slot machine with coins',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}slots2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js'; const bet = parseInt(args[0])||100; const eco = getEco(sender); if((eco.wallet||0)<bet) return reply('Not enough coins!'); const s = ['🍒','🍋','🍊','⭐','💎','7️⃣']; const r = [s[Math.floor(Math.random()*6)],s[Math.floor(Math.random()*6)],s[Math.floor(Math.random()*6)]]; const win = r[0]===r[1]&&r[1]===r[2]; const partial = r[0]===r[1]||r[1]===r[2]||r[0]===r[2]; let reward = 0; if(win) reward = bet * 5; else if(partial) reward = bet * 2; if(reward>0) { saveEco(sender, {wallet:(eco.wallet||0)+reward}); reply(`🎰 [ ${r.join(' | ')} ]\n🎉 Won ${fmtCoins(reward)}!`); } else { saveEco(sender, {wallet:(eco.wallet||0)-bet}); reply(`🎰 [ ${r.join(' | ')} ]\n💀 Lost ${fmtCoins(bet)}`); }
    },
};
