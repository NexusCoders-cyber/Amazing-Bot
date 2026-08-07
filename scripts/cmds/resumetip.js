export default {
    config: {
        name: 'resumetip',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '📄 ${tips[Math.floor(Math.random() * tips.length)]}',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}resumetip <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const tips = [
                "Lead each bullet point with a strong action verb (Led, Built, Reduced, Launched).",
                "Quantify achievements wherever possible — 'increased sales by 20%' beats 'improved sales'.",
                "Keep it to 1 page for under 10 years of experience, 2 pages max otherwise.",
                "Tailor your resume's keywords to match the specific job description.",
                "Remove an 'Objective' section — use a short professional summary instead.",
                "List your most relevant and recent experience first.",
                "Proofread twice, then have someone else check it — typos are an easy disqualifier."
            ];
            reply(`📄 ${tips[Math.floor(Math.random() * tips.length)]}`);
        
    },
};
