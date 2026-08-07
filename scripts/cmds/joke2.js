export default {
    config: {
        name: 'joke2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random programming joke',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}joke2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const j = [['Why do programmers prefer dark mode?','Because light attracts bugs! 🐛'],['Why was the JavaScript developer sad?','Because he didn't Node how to Express himself!'],['What's a programmer's favorite hangout place?','Foo Bar!'],['Why do Java developers wear glasses?','Because they can't C#!'],['A SQL query walks into a bar, sees two tables...','and asks: Can I join you?']]; const [q,a] = j[Math.floor(Math.random()*j.length)]; reply(`😄 *Joke:*
        
        ${q}
        
        ||${a}||`);
    },
};
