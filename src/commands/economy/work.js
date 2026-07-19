import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, hasEffect, addXp } from '../../utils/economyDB.js';

const COOLDOWN = 30 * 60 * 1000;
const COFFEE_REDUCTION = 10 * 60 * 1000;

const JOBS = [
    { name: 'Software Developer', emoji: '💻', min: 200, max: 500, msgs: ['You shipped a new feature', 'You fixed a critical bug', 'You passed code review'] },
    { name: 'Doctor', emoji: '🏥', min: 300, max: 700, msgs: ['You treated several patients', 'You performed a checkup', 'You saved a life today'] },
    { name: 'Delivery Driver', emoji: '🚗', min: 100, max: 300, msgs: ['You delivered 12 packages', 'You completed an express run', 'You drove cross-town'] },
    { name: 'Fisherman', emoji: '🎣', min: 150, max: 400, msgs: ['You caught a huge fish', 'You sold your catch at market', 'Lucky fishing day'] },
    { name: 'Farmer', emoji: '🌾', min: 100, max: 350, msgs: ['You harvested your crops', 'You sold fresh vegetables', 'Good soil, good profit'] },
    { name: 'Chef', emoji: '👨‍🍳', min: 200, max: 500, msgs: ['Your restaurant was packed', 'Your special dish sold out', 'Great tips tonight'] },
    { name: 'Miner', emoji: '⛏️', min: 250, max: 600, msgs: ['You struck a rich vein', 'You dug up rare minerals', 'Deep mine, big reward'] },
    { name: 'Streamer', emoji: '🎮', min: 50, max: 1000, msgs: ['You hit 2k live viewers', 'Donations flooded in', 'Your clip went viral'] },
    { name: 'Artist', emoji: '🎨', min: 100, max: 600, msgs: ['You sold a commissioned piece', 'A gallery featured your art', 'NFT drop went well'] },
    { name: 'Scientist', emoji: '🔬', min: 350, max: 800, msgs: ['You published a paper', 'Your grant came through', 'Major breakthrough today'] },
    { name: 'Mechanic', emoji: '🔧', min: 150, max: 400, msgs: ['You fixed three cars', 'Engine swap paid off', 'Complex diagnosis solved'] },
    { name: 'Nurse', emoji: '💉', min: 200, max: 500, msgs: ['Long shift, great pay', 'You helped many patients', 'Overtime bonus hit'] }
];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'work',
    aliases: ['earn', 'job', 'grind'],
    category: 'economy',
    description: 'Work a random job to earn coins. Use tools for boosted pay.',
    usage: 'work',
    example: 'work',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, from, sender }) {
        const eco = getEco(sender);

        let effectiveCooldown = COOLDOWN;
        const hasCoffee = hasEffect(eco, 'coffee_active');
        if (hasCoffee) {
            effectiveCooldown = Math.max(0, COOLDOWN - COFFEE_REDUCTION);
        }

        const left = cooldownLeft(eco.lastWork, effectiveCooldown);
        if (left > 0) {
            return sock.sendMessage(from, {
                text: `⏰ You need to rest before working again.\n⌛ Next work in: *${fmtTime(left)}*`
            }, { quoted: message });
        }

        const job = JOBS[Math.floor(Math.random() * JOBS.length)];
        const msg = job.msgs[Math.floor(Math.random() * job.msgs.length)];
        let earned = rand(job.min, job.max);

        let boostText = '';
        const hasPickaxe = hasEffect(eco, 'pickaxe');
        const hasLaptop = hasEffect(eco, 'laptop');

        if (hasLaptop) {
            earned = Math.floor(earned * 2);
            boostText = '\n💻 Laptop boost: +100% earnings applied';
        } else if (hasPickaxe) {
            earned = Math.floor(earned * 1.5);
            boostText = '\n⛏️ Pickaxe boost: +50% earnings applied';
        }

        const { xp, level } = addXp(eco, 10);
        const leveledUp = level > (eco.level || 1);

        let updatedEffects = eco.activeEffects || [];
        if (hasCoffee) {
            updatedEffects = updatedEffects.filter(e => e.id !== 'coffee_active');
        }

        saveEco(sender, {
            wallet: (eco.wallet || 0) + earned,
            totalEarned: (eco.totalEarned || 0) + earned,
            lastWork: Date.now(),
            xp,
            level,
            activeEffects: updatedEffects
        });

        let text = `${job.emoji} *${job.name}*\n\n`;
        text += `${msg} and earned *${fmtCoins(earned)} coins*!${boostText}\n\n`;
        text += `👛 Wallet: ${fmtCoins((eco.wallet || 0) + earned)} coins\n`;
        text += `⏰ Next work: 30 minutes`;
        if (leveledUp) text += `\n🎉 Level up! You are now *Level ${level}*!`;

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
