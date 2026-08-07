const CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️', lizard: '🦎', spock: '🖖' };

const WINS = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['spock', 'paper'],
    spock: ['scissors', 'rock'],
};

export default {
    config: {
        name: 'rpsls',
        aliases: ['rps', 'rockpaperscissors'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Rock Paper Scissors Lizard Spock',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rpsls <rock|paper|scissors|lizard|spock>' },
    },
    async onStart({ args, reply }) {
        const choice = (args[0] || '').toLowerCase();
        if (!CHOICES.includes(choice)) {
            return reply(`Pick one: ${CHOICES.map(c => `${EMOJI[c]} ${c}`).join(' | ')}`);
        }
        const bot = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        const result = choice === bot ? 'draw' : WINS[choice].includes(bot) ? 'win' : 'lose';

        const lines = {
            win: `You win! ${EMOJI[choice]} beats ${EMOJI[bot]}`,
            lose: `You lose! ${EMOJI[bot]} beats ${EMOJI[choice]}`,
            draw: `It's a draw! Both chose ${EMOJI[choice]}`,
        };

        reply(
            `*RPSLS*\n\nYou: ${EMOJI[choice]} ${choice}\nBot: ${EMOJI[bot]} ${bot}\n\n${lines[result]}`
        );
    },
};
