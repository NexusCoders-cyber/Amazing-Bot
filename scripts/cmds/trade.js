import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

const pendingTrades = new Map(); // key: sender+target, value: trade data

export default {
    config: {
        name: 'trade',
        aliases: ['tradeitem', 'exchange'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Trade items or coins with another user',
        category: 'economy',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}trade @user <amount|item>' },
    },
    async onStart({ message, args, sender, reply, isGroup }) {
        if (!isGroup) return reply('Group only.');

        const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply('Mention someone to trade with.\nUsage: trade @user <amount>');

        const sub = (args[0] || '').toLowerCase();

        // Accept/decline
        if (sub === 'accept' || sub === 'decline') {
            const key = `${target}::${sender}`;
            const pending = pendingTrades.get(key);
            if (!pending) return reply('No pending trade from this user.');
            pendingTrades.delete(key);

            if (sub === 'decline') return reply('Trade declined.');

            // Execute trade
            const senderEco = getEco(sender);
            const targetEco = getEco(target);

            if (pending.senderGive > (senderEco.wallet || 0)) return reply('You don\'t have enough coins now.');
            if (pending.targetGive > (targetEco.wallet || 0)) return reply('They don\'t have enough coins now.');

            // Swap items if any
            const senderInv = [...(senderEco.inventory || [])];
            const targetInv = [...(targetEco.inventory || [])];

            if (pending.senderItem) {
                const idx = senderInv.indexOf(pending.senderItem);
                if (idx === -1) return reply('You no longer have that item.');
                senderInv.splice(idx, 1);
                targetInv.push(pending.senderItem);
            }
            if (pending.targetItem) {
                const idx = targetInv.indexOf(pending.targetItem);
                if (idx === -1) return reply('They no longer have that item.');
                targetInv.splice(idx, 1);
                senderInv.push(pending.targetItem);
            }

            saveEco(sender, {
                wallet: (senderEco.wallet || 0) - (pending.senderGive || 0) + (pending.targetGive || 0),
                inventory: senderInv,
            });
            saveEco(target, {
                wallet: (targetEco.wallet || 0) - (pending.targetGive || 0) + (pending.senderGive || 0),
                inventory: targetInv,
            });

            return reply('✅ Trade completed!');
        }

        // Create trade offer
        const amount = parseInt(args.find(a => /^\d+$/.test(a))) || 0;
        const eco = getEco(sender);
        if (amount > (eco.wallet || 0)) return reply(`You don't have ${fmtCoins(amount)}.`);

        const key = `${sender}::${target}`;
        pendingTrades.set(key, { senderGive: amount, targetGive: amount, time: Date.now() });

        reply([
            '📝 *Trade offer sent!*',
            '',
            `@${target.split('@')[0]}, reply with:`,
            `• ${args[0] || '.'}trade accept`,
            `• ${args[0] || '.'}trade decline`,
            '',
            `Offer: ${fmtCoins(amount)} coins`,
        ].join('\n'));
    },
};
