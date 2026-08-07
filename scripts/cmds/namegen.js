export default {
    config: {
        name: 'namegen',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate random name',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}namegen <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const f = ['Aria','Luna','Nova','Zara','Leo','Max','Kai','Nyx','Ember','Frost','Storm','Blaze','Sage','Raven','Phoenix','Atlas','Orion','Iris','Vega','Astra']; const l = ['Stormborn','Nightwalker','Fireheart','Shadowveil','Starlight','Moonwhisper','Duskweaver','Thornblade','Frostwind','Sunhunter']; reply(`✨ *${f[Math.floor(Math.random()*f.length)]} ${l[Math.floor(Math.random()*l.length)]}*`);
    },
};
