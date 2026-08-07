import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
import axios from 'axios';

const TRIVIA_CATEGORIES = [
    { id: 9, name: 'General Knowledge' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 14, name: 'Television' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Computers' },
    { id: 19, name: 'Mathematics' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
];

const activeGames = new Map();

export default {
    config: {
        name: 'trivia',
        aliases: ['quiz'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Play a trivia quiz for coins',
        category: 'games',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}trivia [category]\n{prefix}trivia list' },
    },

    async onStart({ args, reply, sender, prefix, React }) {
        React('🧠');

        if (args[0]?.toLowerCase() === 'list') {
            let text = `━━━━━━━━━━━━━━━━━━━━\n  🧠 *TRIVIA CATEGORIES*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
            for (const cat of TRIVIA_CATEGORIES) {
                text += `  *${cat.id}.* ${cat.name}\n`;
            }
            text += `\n  Usage: ${prefix}trivia <id>\n━━━━━━━━━━━━━━━━━━━━`;
            return reply(text);
        }

        if (activeGames.has(sender)) {
            return reply(`⏳ You already have an active trivia! Answer first or wait.`);
        }

        const categoryId = parseInt(args[0]) || undefined;
        const url = `https://opentdb.com/api.php?amount=1${categoryId ? `&category=${categoryId}` : ''}&type=multiple`;

        try {
            const { data } = await axios.get(url, { timeout: 10000 });
            if (!data.results?.length) return reply(`❌ Failed to fetch question. Try again.`);

            const q = data.results[0];
            const answers = [...q.incorrect_answers, q.correct_answer]
                .sort(() => Math.random() - 0.5);

            const answerMap = {};
            const letters = ['A', 'B', 'C', 'D'];
            let text = `━━━━━━━━━━━━━━━━━━━━\n  🧠 *TRIVIA*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
            text += `📂 Category: *${q.category}*\n`;
            text += `📊 Difficulty: *${q.difficulty}*\n`;
            text += `💰 Reward: *${q.difficulty === 'hard' ? '200' : q.difficulty === 'medium' ? '100' : '50'} coins*\n\n`;
            text += `❓ *${q.question.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"')}*\n\n`;

            for (let i = 0; i < answers.length; i++) {
                const decoded = answers[i].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
                text += `  ${letters[i]}. ${decoded}\n`;
                answerMap[letters[i]] = decoded;
            }

            text += `\n⏱️ You have 30s to answer!\n`;
            text += `Reply with the letter (A/B/C/D)\n━━━━━━━━━━━━━━━━━━━━`;

            const sent = await reply(text);

            activeGames.set(sender, {
                correct: q.correct_answer.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"'),
                difficulty: q.difficulty,
                answerMap,
                expires: Date.now() + 30000,
            });

            setTimeout(() => {
                if (activeGames.has(sender)) {
                    const game = activeGames.get(sender);
                    if (Date.now() >= game.expires) {
                        activeGames.delete(sender);
                        reply(`⏰ Time's up! The answer was: *${game.correct}*`);
                    }
                }
            }, 31000);

        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },

    onReply({ reply, sender, message, React }) {
        const game = activeGames.get(sender);
        if (!game || Date.now() >= game.expires) return;

        const userAnswer = (message?.message?.conversation || message?.message?.extendedTextMessage?.text || '').trim().toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(userAnswer)) return;

        activeGames.delete(sender);
        React(userAnswer === 'A' ? '🎉' : '❌');

        const isCorrect = game.answerMap[userAnswer] === game.correct;
        const rewards = { hard: 200, medium: 100, easy: 50 };

        if (isCorrect) {
            const amount = rewards[game.difficulty] || 50;
            const eco = getEco(sender);
            saveEco(sender, {
                wallet: (eco.wallet || 0) + amount,
                xp: (eco.xp || 0) + 25,
                totalEarned: (eco.totalEarned || 0) + amount,
            });

            return reply([
                `🎉 *CORRECT!*`,
                ``,
                `The answer was: *${game.correct}*`,
                `💰 You earned *${fmtCoins(amount)}*!`,
                `⭐ +25 XP`,
            ].join('\n'));
        } else {
            return reply([
                `❌ *WRONG!*`,
                ``,
                `The correct answer was: *${game.correct}*`,
                `Better luck next time!`,
            ].join('\n'));
        }
    },
};
