export default {
    config: {
        name: 'calorieinfo',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .calorieinfo <food>nExample: .calorieinfo bananannKnown foods: ${Objec',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}calorieinfo <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const food = (args.join(' ') || '').toLowerCase();
            const db = {
                'rice': 130, 'white rice': 130, 'brown rice': 111, 'chicken breast': 165, 'egg': 78,
                'banana': 89, 'apple': 52, 'bread': 265, 'pasta': 131, 'potato': 77, 'avocado': 160,
                'salmon': 208, 'beef': 250, 'milk': 42, 'yogurt': 59, 'almonds': 579, 'oats': 389,
                'broccoli': 34, 'sweet potato': 86, 'pizza': 266
            };
            if (!food) return reply(`Usage: .calorieinfo <food>\nExample: .calorieinfo banana\n\nKnown foods: ${Object.keys(db).join(', ')}`);
            const match = Object.keys(db).find(k => k === food || k.includes(food));
            if (!match) return reply(`Don't have data for "${food}" yet. Try: ${Object.keys(db).slice(0, 8).join(', ')}...`);
            reply(`🍽️ *${match}*: approximately ${db[match]} kcal per 100g\n(General reference only — actual values vary by preparation.)`);
        
    },
};
