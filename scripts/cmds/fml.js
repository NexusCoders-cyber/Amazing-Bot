export default {
    config: {
        name: 'fml',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'F**k my life random story',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}fml <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const f = ['Today I realized I have been waving at a stranger for 5 minutes','I sent a love text to my boss instead of my girlfriend','I walked into a glass door in front of my crush','I accidentally liked my ex's 3 year old photo','I said you too when the waiter said enjoy your meal']; reply(`😔 *FML:*
        ${f[Math.floor(Math.random()*f.length)]}`);
    },
};
