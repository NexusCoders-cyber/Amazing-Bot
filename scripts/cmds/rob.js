import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft } from '../../src/utils/economyDB.js';
const CD = 4 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export default {
    config: { name: 'rob', aliases: ['steal', 'mug'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Rob someone (risky!)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}rob @user' } },
    async onStart({ message, from, sender, reply }) {
        const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target || target === sender) return reply('Mention someone to rob.');
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastRob, CD);
        if (left > 0) return reply(`You need to lay low for a bit.\nCooldown: ${fmtTime(left)}`);
        const teco = getEco(target);
        const tvault = teco.wallet || 0;
        if (tvault < 100) return reply(`@${target.split('@')[0]} is too broke to rob.`);
        const success = Math.random() < 0.5;
        saveEco(sender, { lastRob: Date.now() });
        if (success) {
            const stolen = rand(Math.floor(tvault * 0.1), Math.floor(tvault * 0.4));
            saveEco(sender, { wallet: (eco.wallet || 0) + stolen });
            saveEco(target, { wallet: tvault - stolen });
            reply(`Rob successful!\n\nStole  : ${fmtCoins(stolen)} from @${target.split('@')[0]}\nWallet : ${fmtCoins((eco.wallet || 0) + stolen)}`);
        } else {
            const fine = rand(50, 300);
            saveEco(sender, { wallet: Math.max(0, (eco.wallet || 0) - fine) });
            reply(`You got caught robbing @${target.split('@')[0]}!\n\nFine   : ${fmtCoins(fine)}\nWallet : ${fmtCoins(Math.max(0, (eco.wallet || 0) - fine))}`);
        }
    },
};
