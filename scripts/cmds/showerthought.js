export default {
    config: { name: 'showerthought', aliases: ['shower'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random shower thought', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}showerthought' } },
    async onStart({ reply, React }) {
        React('🚿');
        const t = ['When you say "forward" or "back", your lips move in those directions','Everyone you have ever known is somewhere on Google Maps','The person who would proof read Hitler\'s speeches was a grammar Nazi','Your stomach thinks all potatoes are mashed','If you lift a kangaroo\'s tail off the ground, it can\'t hop','You can\'t hum while holding your nose','The first product to have a barcode was Wrigley\'s gum','A jiffy is an actual unit of time: 1/100th of a second','Octopuses have three hearts and blue blood','The inventor of the Pringles can is buried in one'];
        reply(`🚿 *Shower Thought:*\n\n${t[Math.floor(Math.random() * t.length)]}`);
    },
};
