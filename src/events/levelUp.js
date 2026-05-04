import logger from '../utils/logger.js';
import config from '../config.js';
import { getUser, updateUser } from '../models/User.js';
import { createLevelUpImage } from '../utils/canvasUtils.js';

const XP_PER_MESSAGE = 10;
const XP_PER_COMMAND = 25;
const BASE_XP_REQUIREMENT = 100;
const XP_MULTIPLIER = 1.5;

function calculateXpForLevel(level) {
    return Math.floor(BASE_XP_REQUIREMENT * Math.pow(XP_MULTIPLIER, level - 1));
}

function calculateLevel(xp) {
    let level = 1;
    let totalXpRequired = 0;

    while (totalXpRequired + calculateXpForLevel(level) <= xp) {
        totalXpRequired += calculateXpForLevel(level);
        level++;
    }

    return {
        level,
        currentXp: xp - totalXpRequired,
        requiredXp: calculateXpForLevel(level)
    };
}

function calculateLevelRewards(level) {
    const rewards = [];

    const coinReward = level * 100;
    rewards.push({
        type: 'coins',
        name: 'Coins',
        icon: '🪙',
        value: coinReward,
        amount: coinReward
    });

    if (level % 5 === 0) {
        rewards.push({
            type: 'title',
            name: 'Special Title',
            icon: '🏆',
            value: `Level ${level} Master`,
            title: `Level ${level} Master`
        });
    }

    if (level === 10) rewards.push({ type: 'title', name: 'Achievement', icon: '⭐', value: 'Rising Star', title: 'Rising Star' });
    if (level === 25) rewards.push({ type: 'title', name: 'Achievement', icon: '💫', value: 'Veteran', title: 'Veteran' });
    if (level === 50) rewards.push({ type: 'title', name: 'Achievement', icon: '👑', value: 'Legend', title: 'Legend' });
    if (level === 100) rewards.push({ type: 'title', name: 'Achievement', icon: '🌟', value: 'God Tier', title: 'God Tier' });

    return rewards;
}

export default async function handleLevelUp(sock, message, isCommand = false) {
    try {
        if (!config.features?.leveling?.enabled) return;

        const from = message.key.remoteJid;
        if (!from || from === 'status@broadcast') return;

        const sender = message.key.participant || from;
        if (!sender) return;

        let user = await getUser(sender);
        if (!user) return;

        const xpGain = isCommand ? XP_PER_COMMAND : XP_PER_MESSAGE;
        const newXp = (user.xp || 0) + xpGain;

        const oldLevel = calculateLevel(user.xp || 0);
        const newLevel = calculateLevel(newXp);

        const didLevelUp = newLevel.level > oldLevel.level;

        await updateUser(sender, {
            xp: newXp,
            level: newLevel.level
        });

        if (didLevelUp) {
            try {
                const userName = user.name || sender.split('@')[0];
                const levelUpImage = await createLevelUpImage(
                    userName,
                    newLevel.level,
                    newLevel.currentXp,
                    newLevel.requiredXp
                );

                const rewards = calculateLevelRewards(newLevel.level);

                let levelUpMessage = `╭──⦿【 🎉 LEVEL UP! 】\n│\n│ 👤 Player: @${sender.split('@')[0]}\n│ ⬆️ Level: ${oldLevel.level} → ${newLevel.level}\n│ ⚡ XP Gained: +${xpGain}\n│ 📊 Progress: ${newLevel.currentXp}/${newLevel.requiredXp} XP\n│`;

                if (rewards.length > 0) {
                    levelUpMessage += `\n│ 🎁 Rewards:\n${rewards.map(r => `│ ${r.icon} ${r.name}: ${r.value}`).join('\n')}\n│`;
                }

                levelUpMessage += `\n╰────────────⦿`;

                if (levelUpImage) {
                    await sock.sendMessage(from, {
                        image: levelUpImage,
                        caption: levelUpMessage,
                        mentions: [sender]
                    });
                } else {
                    await sock.sendMessage(from, {
                        text: levelUpMessage,
                        mentions: [sender]
                    });
                }

                if (rewards.length > 0) {
                    const rewardUpdates = {};
                    for (const reward of rewards) {
                        if (reward.type === 'coins') {
                            rewardUpdates['economy.balance'] = (user.economy?.balance || 0) + reward.amount;
                        }
                    }
                    if (Object.keys(rewardUpdates).length > 0) {
                        await updateUser(sender, rewardUpdates);
                    }
                }

                logger.info(`${userName} leveled up to level ${newLevel.level}`);
            } catch (error) {
                logger.error('Error sending level up notification:', error);
            }
        }
    } catch (error) {
        logger.error('Error in levelUp event:', error);
    }
}
