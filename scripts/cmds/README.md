# AmazingBot V2 — Command Folder

Drop your command files here. Each file must be a `.js` file and export a default object with:

```js
export default {
    config: {
        name: 'commandname',       // required
        aliases: ['alias1'],       // optional
        author: 'YourName',
        version: '1.0',
        shortDescription: '...',
        category: 'general',       // general | admin | fun | games | media | downloader | owner | utility | ai
        coolDown: 3,               // seconds
        role: 0,                   // 0 = anyone | 1 = group admin | 2 = bot owner
        guide: { en: '{prefix}commandname <arg>' },
        noPrefix: false,
    },

    async onStart({ api, sock, message, args, from, sender, isGroup, isGroupAdmin,
                    isBotAdmin, isOwner, prefix, pushName, usersData, threadsData,
                    AmazingBot, send, reply, React }) {
        // Main command logic
    },

    // Optional: runs for EVERY message (use sparingly)
    async onChat({ message, from, sender, chatText, send, reply }) {},

    // Optional: runs when user replies to a bot message registered via AmazingBot.onReply
    async onReply({ message, from, sender, Reply, reply, React }) {},

    // Optional: runs when user reacts to a message registered via AmazingBot.onReaction
    async onReaction({ message, from, sender, Reaction, api }) {},
};
```

See `newcommand.eg.js` for a full example with all lifecycle methods.
