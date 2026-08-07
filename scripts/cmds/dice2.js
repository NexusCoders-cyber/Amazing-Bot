export default {
    config: {
        name: 'dice2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Roll multiple dice',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dice2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = Math.min(parseInt(args[0])||2, 10); const dice = ['⚀','⚁','⚂','⚃','⚄','⚅']; const rolls = Array.from({length:n}, ()=>Math.floor(Math.random()*6)); const total = rolls.reduce((a,b)=>a+b+1,0); reply(`${rolls.map(r=>dice[r]).join(' ')}\n\n📊 Total: *${total}*`);
    },
};
