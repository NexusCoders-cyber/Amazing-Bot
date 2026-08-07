import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
const SYM = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export default {
    config: { name: 'slot', aliases: ['slots', 'spin'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Spin the slot machine', category: 'economy', coolDown: 5, role: 0,
        guide: { en: '{prefix}slot <amount>' } },
    async onStart({ args, sender, reply }) {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: slot <amount>');
        const eco = getEco(sender);
        if ((eco.wallet || 0) < amount) return reply(`You only have ${fmtCoins(eco.wallet || 0)}.`);
        const r = [SYM[rand(0, 5)], SYM[rand(0, 5)], SYM[rand(0, 5)]];
        const line = r.join(' | ');
        let multi = 0, msg = '';
        if (r[0] === r[1] && r[1] === r[2]) {
            if (r[0] === '💎') { multi = 20; msg = 'JACKPOT! Diamond triple!'; }
            else if (r[0] === '7️⃣') { multi = 10; msg = 'Lucky 7s! Big win!'; }
            else { multi = 3; msg = 'Three of a kind!'; }
        } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) { multi = 1.5; msg = 'Two of a kind!'; }
        const net = multi > 0 ? Math.floor(amount * multi) - amount : -amount;
        saveEco(sender, { wallet: (eco.wallet || 0) + net });
        reply(`${line}\n\n${multi > 0 ? msg + ` +${fmtCoins(Math.floor(amount * multi))}` : 'No match. Better luck!'}\nWallet: ${fmtCoins((eco.wallet || 0) + net)}`);
    },
};
