export default {
    config: {
        name: 'rps2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Rock paper scissors',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rps2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const c = ['rock','paper','scissors']; const e = {rock:'🪨',paper:'📄',scissors:'✂️'}; const p = args[0]?.toLowerCase(); if (!c.includes(p)) return reply('Usage: .rps2 <rock|paper|scissors>'); const b = c[Math.floor(Math.random()*3)]; const w = (p===b)?'tie':(p==='rock'&&b==='scissors')||(p==='paper'&&b==='rock')||(p==='scissors'&&b==='paper')?'win':'lose'; reply(`${e[p]} vs ${e[b]}
        ${w==='tie'?'🤝 Tie!':w==='win'?'🏆 You win!':'💀 You lose!'}`);
    },
};
