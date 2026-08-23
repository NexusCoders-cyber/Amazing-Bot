import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, displayPhone } from '../../src/utils/economyDB.js';

const CD = 4 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default {
    config: {
        name: 'rob',
        aliases: ['steal', 'mug'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Rob someone (risky!)',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rob @user' },
    },

    async onStart({ message, sender, reply }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];

        if (!target) return reply('Mention or reply to someone to rob.');
        if (displayPhone(target) === displayPhone(sender)) return reply('❌ You cannot rob yourself.');

        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastRob, CD);
        if (left > 0) return reply(`⏳ You need to lay low for a bit.\nCooldown: ${fmtTime(left)}`);

        const teco = getEco(target);
        const tvault = teco.wallet || 0;
        if (tvault < 100) return reply(`❌ +${displayPhone(target)} is too broke to rob.`);

        const success = Math.random() < 0.5;

        if (success) {
            const stolen = rand(Math.floor(tvault * 0.1), Math.floor(tvault * 0.4));
            const newSenderWallet = (eco.wallet || 0) + stolen;
            const newTargetWallet = tvault - stolen;
            saveEco(sender, { lastRob: Date.now(), wallet: newSenderWallet });
            saveEco(target, { wallet: newTargetWallet });
            reply(`💰 Rob successful!\n\nStole  : ${fmtCoins(stolen)} from +${displayPhone(target)}\nWallet : ${fmtCoins(newSenderWallet)}`);
        } else {
            const fine = rand(50, 300);
            const newSenderWallet = Math.max(0, (eco.wallet || 0) - fine);
            saveEco(sender, { lastRob: Date.now(), wallet: newSenderWallet });
            reply(`🚨 You got caught robbing +${displayPhone(target)}!\n\nFine   : ${fmtCoins(fine)}\nWallet : ${fmtCoins(newSenderWallet)}`);
        }
    },
};
