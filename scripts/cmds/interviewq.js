export default {
    config: {
        name: 'interviewq',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💼 *${cat} interview question:*nn${pool[Math.floor(Math.random() * pool.length',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}interviewq <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const categories = {
                behavioral: [
                    "Tell me about a time you handled a conflict with a coworker.",
                    "Describe a situation where you failed and what you learned.",
                    "Tell me about a time you had to meet a tight deadline."
                ],
                technical: [
                    "Walk me through how you'd debug a production issue you've never seen before.",
                    "Explain a technical concept you know well to someone non-technical.",
                    "What's a project you're proud of and what was your specific contribution?"
                ],
                general: [
                    "Why do you want to work here?",
                    "Where do you see yourself in 5 years?",
                    "What's your biggest weakness, and how are you addressing it?"
                ]
            };
            const cat = (args[0] || 'general').toLowerCase();
            const pool = categories[cat] || categories.general;
            reply(`💼 *${cat} interview question:*\n\n${pool[Math.floor(Math.random() * pool.length)]}\n\nCategories: behavioral, technical, general`);
        
    },
};
