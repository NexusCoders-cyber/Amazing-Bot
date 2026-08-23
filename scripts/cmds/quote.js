import axios from 'axios';

const QUOTES = [
    { q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs' },
    { q: 'In the middle of every difficulty lies opportunity.', a: 'Albert Einstein' },
    { q: 'It does not matter how slowly you go as long as you do not stop.', a: 'Confucius' },
    { q: 'Life is what happens when you are busy making other plans.', a: 'John Lennon' },
    { q: 'Success is not final; failure is not fatal: it is the courage to continue that counts.', a: 'Winston Churchill' },
    { q: 'Education is the most powerful weapon which you can use to change the world.', a: 'Nelson Mandela' },
];

async function fetchQuote() {
    try {
        const { data } = await axios.get('https://zenquotes.io/api/random', { timeout: 6000 });
        if (data?.[0]?.q) return { q: data[0].q, a: data[0].a };
    } catch {}
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export default {
    config: {
        name: 'quote',
        aliases: ['motivation', 'inspire'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Get a motivational quote',
        category: 'fun',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}quote' },
    },
    async onStart({ reply }) {
        const { q, a } = await fetchQuote();
        reply(`"${q}"\n\n- ${a}`);
    },
};
