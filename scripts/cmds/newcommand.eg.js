import { registerOnReply, registerOnReaction } from '../../src/utils/amazingbot.js';

export default {
    config: {
        name: 'commandname',
        aliases: ['alias1', 'alias2'],
        author: 'YourName',
        version: '1.0',
        shortDescription: 'Short one-line description',
        longDescription: 'Longer, detailed description of the command and what it does.',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: {
            en: '{prefix}commandname <arg1> [optional_arg]',
        },
        noPrefix: false,
    },

    async onStart({ api, sock, message, args, from, sender, isGroup, isGroupAdmin, isBotAdmin, isOwner, prefix, pushName, quoted, usersData, threadsData, AmazingBot, send, reply, React }) {
        if (!args[0]) {
            return reply(`Usage: ${prefix}commandname <argument>`);
        }

        const user = await usersData.get(sender.split('@')[0]);

        const sent = await sock.sendMessage(from, {
            text: `Hello ${pushName}. You said: ${args.join(' ')}`
        }, { quoted: message });

        registerOnReply(sent.key.id, {
            commandName: 'commandname',
            author: sender,
            data: { someValue: args[0] },
        });
    },

    async onChat({ api, message, from, sender, chatText, isGroup, isGroupAdmin, send, reply }) {
        if (!chatText.toLowerCase().includes('hello bot')) return;
        await reply('Hello there.');
    },

    async onReply({ api, message, from, sender, reply, Reply }) {
        const { data } = Reply;
        if (sender !== Reply.author) return;

        await reply(`You replied. Original value was: ${data.someValue}`);
        Reply.delete();
    },

    async onReaction({ api, message, from, sender, Reaction }) {
        const { emoji, commandName } = Reaction;
    },
};
