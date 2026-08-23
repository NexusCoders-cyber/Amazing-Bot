import axios from 'axios';

const JOKES = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "What do you call a fake noodle? An Impasta!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
];

async function fetchJoke() {
    try {
        const { data } = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 5000 });
        return `${data.setup}\n\n${data.punchline}`;
    } catch {}
    try {
        const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart', { timeout: 5000 });
        if (data.setup) return `${data.setup}\n\n${data.delivery}`;
    } catch {}
    return JOKES[Math.floor(Math.random() * JOKES.length)];
}

export default {
    config: {
        name: 'joke',
        aliases: ['jokes', 'funny'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Get a random joke',
        category: 'fun',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}joke' },
    },
    async onStart({ reply }) {
        const joke = await fetchJoke();
        reply(joke);
    },
};
