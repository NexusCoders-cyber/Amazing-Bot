import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft } from '../../utils/economyDB.js';

const COOLDOWN = 5 * 60 * 1000;
const WIN_CHANCE = 0.55;
const MIN = 50;
const MAX = 250;

const WIN_MSGS = [
    'A stranger felt generous and gave you some coins.',
    'You found coins on the floor.',
    'Someone tossed coins at you.',
    'A rich person pitied you.',
    'You sang on the street and people donated.',
    'Lucky! Someone dropped their wallet and you kept it.'
];

const FAIL_MSGS = [
    'Everyone ignored you.',
    'Someone told you to get a job.',
    'You got laughed at.',
    'Nobody was interested.',
    'A dog chased you away.',
    'You tripped and got nothing.'
];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'beg',
    aliases: ['panhandle', 'spare'],
    category: 'economy',
    description: 'Beg for coins with a 55% chance of success.',
    usage: 'beg',
    example: 'beg',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, from, sender }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastBeg, COOLDOWN);

        if (left > 0) {
            return sock.sendMessage(from, {
                text: `😅 You just begged recently. Wait *${fmtTime(left)}* before trying again.`
            }, { quoted: message });
        }

        saveEco(sender, { lastBeg: Date.now() });

        if (Math.random() > WIN_CHANCE) {
            const failMsg = FAIL_MSGS[Math.floor(Math.random() * FAIL_MSGS.length)];
            return sock.sendMessage(from, {
                text: `😔 *Begging Failed*\n\n${failMsg}\n\n⏰ Try again in 5 minutes.`
            }, { quoted: message });
        }

        const amount = rand(MIN, MAX);
        saveEco(sender, {
            wallet: (eco.wallet || 0) + amount,
            totalEarned: (eco.totalEarned || 0) + amount,
            lastBeg: Date.now()
        });

        const winMsg = WIN_MSGS[Math.floor(Math.random() * WIN_MSGS.length)];
        await sock.sendMessage(from, {
            text: `🙏 *Begging Success!*\n\n${winMsg}\n\n💰 You received *${fmtCoins(amount)} coins*\n👛 Wallet: ${fmtCoins((eco.wallet || 0) + amount)} coins\n⏰ Next beg: 5 minutes`
        }, { quoted: message });
    }
};
