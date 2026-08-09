import axios from 'axios';

const QUOTES = [
    { q: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", a: 'Naruto Uzumaki', anime: 'Naruto' },
    { q: "The world isn't perfect, but it's there for us, doing the best it can. That's what makes it so damn beautiful.", a: 'Roy Mustang', anime: 'Fullmetal Alchemist' },
    { q: "No matter how deep the night, it always turns to day, eventually.", a: 'Brook', anime: 'One Piece' },
    { q: "To know sorrow is not scary. What is scary is to know you can't go back to happiness you could have had.", a: 'Mitsuhide Akechi', anime: 'The Vision of Escaflowne' },
    { q: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well.", a: 'Gildarts Clive', anime: 'Fairy Tail' },
    { q: "People who are stronger than anyone can also be the gentlest.", a: 'Sakata Gintoki', anime: 'Gintama' },
    { q: "There's no shame in falling down. True shame is to not stand up again.", a: 'Shintarou Midorima', anime: 'Kuroko no Basket' },
    { q: "If you can't do something, then don't. Focus on what you can do.", a: 'Izuku Midoriya', anime: 'My Hero Academia' },
    { q: "When you give up, that's when the game ends.", a: 'Yugi Mutou', anime: 'Yu-Gi-Oh!' },
    { q: "The ticket to the future is always open.", a: 'Koro-sensei', anime: 'Assassination Classroom' },
];

export default {
    config: {
        name: 'animequote',
        aliases: ['aqoute', 'animeq'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random anime quote',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}animequote' },
    },

    async onStart({ reply, React }) {
        React('📜');
        // Try API first, fall back to local
        try {
            const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/quotes/random`, { timeout: 30000 });
            if (data?.quote) {
                return reply(`📜 *"${data.quote}"*\n\n— ${data.character || 'Unknown'} (${data.anime || 'Anime'})`);
            }
        } catch {}
        const pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        reply(`📜 *"${pick.q}"*\n\n— ${pick.a} (${pick.anime})`);
    },
};
