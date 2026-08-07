export default {
    config: { name: 'spacefact', aliases: ['sf'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random space fact', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}spacefact' } },
    async onStart({ reply, React }) {
        React('🚀');
        const facts = ['A day on Venus is longer than a year on Venus','Neutron stars can spin 600 times per second','Saturn could float in water (it\'s less dense)','The Sun makes up 99.86% of the solar system\'s mass','Light from the Sun takes 8 minutes to reach Earth','There are more stars in the universe than grains of sand on Earth','The Moon is drifting away from Earth at 3.8 cm per year','Jupiter has the shortest day of all planets at 9.9 hours','A teaspoon of neutron star weighs 6 billion tons','The footprints on the Moon will last 100 million years'];
        reply(`🚀 *Space Fact:*\n${facts[Math.floor(Math.random() * facts.length)]}`);
    },
};
