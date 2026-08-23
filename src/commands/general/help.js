import config from '../../config.js';
import moment from 'moment';
import axios from 'axios';

const BOOT = Date.now();

const CAT_EMOJI = {
    admin: '🛡️', ai: '🤖', downloader: '📥', economy: '💰',
    fun: '🎭', games: '🎮', general: '📱', media: '🎨',
    owner: '👑', utility: '🔧', info: '📊', misc: '⭐',
};

const ROLE = { 0: 'Everyone', 1: 'Group Admin', 2: 'Bot Owner' };

function uptime(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60), sc = s % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${sc}s`;
    if (m > 0) return `${m}m ${sc}s`;
    return `${sc}s`;
}

function ramUsage() {
    const mem = process.memoryUsage();
    return (mem.heapUsed / 1024 / 1024).toFixed(1) + ' MB';
}

async function fetchBotImage() {
    const apis = [
        { url: 'https://api.waifu.pics/sfw/waifu', parse: d => d?.url },
        { url: 'https://api.waifu.pics/sfw/neko', parse: d => d?.url },
        { url: 'https://nekos.best/api/v2/neko', parse: d => d?.results?.[0]?.url },
        { url: 'https://waifu.im/api/random/?selected_tags=waifu&is_nsfw=false', parse: d => d?.images?.[0]?.url },
    ];

    for (const api of apis.sort(() => Math.random() - 0.5)) {
        try {
            const { data: meta } = await axios.get(api.url, { timeout: 6000 });
            const imgUrl = api.parse(meta);
            if (!imgUrl) continue;

            const res = await axios.get(imgUrl, {
                responseType: 'arraybuffer',
                timeout: 10000,
                headers: { 'Accept': 'image/jpeg,image/png,image/webp,image/*' },
            });

            const contentType = String(res.headers?.['content-type'] || '');
            if (!contentType.startsWith('image/')) continue;

            const buf = Buffer.from(res.data);
            if (buf.length < 2000) continue;

            return buf;
        } catch {}
    }
    return null;
}

async function sendWithImage(sock, from, message, text, mentions) {
    const img = await fetchBotImage().catch(() => null);
    if (img) {
        try {
            return await sock.sendMessage(from, {
                image: img,
                caption: text,
                mentions: mentions || [],
            }, { quoted: message });
        } catch {}
    }
    return sock.sendMessage(from, { text, mentions: mentions || [] }, { quoted: message });
}

async function showMain(sock, message, from, sender, prefix, getAllCommands, getAllCategories, getCommandsByCategory) {
    const now = moment();
    const name = message.pushName || 'User';
    const uid = sender.split('@')[0];
    const allCmds = getAllCommands();
    const cats = getAllCategories().sort();
    const botName = (config.botName || 'AmazingBot').toUpperCase();

    let text = `╭───「 🤖 ${botName} 」\n`;
    text += `│ 👤 User    : ${name}\n`;
    text += `│ 🆔 UID     : ${uid}\n`;
    text += `│ 👑 Owner   : ${config.ownerName || 'Raphael Ilom'}\n`;
    text += `│ 🔧 Prefix  : [ ${prefix} ]\n`;
    text += `│ ⏰ Uptime  : ${uptime(Date.now() - BOOT)}\n`;
    text += `│ 📦 Version : ${config.botVersion}\n`;
    text += `│ 📊 Commands: ${allCmds.length}\n`;
    text += `│ 💾 RAM     : ${ramUsage()}\n`;
    text += `│ 🗓️ Date    : ${now.format('DD/MM/YYYY HH:mm:ss')}\n`;
    text += `╰────────────────────\n\n`;

    for (const cat of cats) {
        const cmds = getCommandsByCategory(cat);
        if (!cmds?.length) continue;
        const emoji = CAT_EMOJI[cat.toLowerCase()] || '⭐';
        const names = cmds.map(c => c.name).sort();

        text += `╭───「 ${emoji} ${cat.toUpperCase()} 」─── ${cmds.length}\n`;
        for (let i = 0; i < names.length; i += 4) {
            text += `│ ${names.slice(i, i + 4).join(', ')}\n`;
        }
        text += `╰────────────────────\n\n`;
    }

    text += `✦ *${prefix}help <category>* — list commands\n`;
    text += `✦ *${prefix}help <command>* — command details`;

    await sendWithImage(sock, from, message, text, [sender]);
}

async function showCategory(sock, message, from, sender, prefix, query, getCommandsByCategory) {
    const cmds = getCommandsByCategory(query);
    if (!cmds?.length) {
        return sock.sendMessage(from, {
            text: `❌ No commands in *${query}*.\n\nUse *${prefix}help* to see all categories.`
        }, { quoted: message });
    }

    const emoji = CAT_EMOJI[query.toLowerCase()] || '⭐';
    const sorted = [...cmds].sort((a, b) => a.name.localeCompare(b.name));

    let text = `╭───「 ${emoji} ${query.toUpperCase()} 」─── ${sorted.length} command${sorted.length !== 1 ? 's' : ''}\n│\n`;

    for (const cmd of sorted) {
        text += `│ 🔸 ${cmd.name}`;
        if (cmd.aliases?.length) text += ` (${cmd.aliases.slice(0, 2).join(', ')})`;
        text += `\n`;
        if (cmd.description) text += `│    ↳ ${cmd.description}\n`;
    }
    text += `╰────────────────────\n\n✦ *${prefix}help <command>* for more details`;

    await sendWithImage(sock, from, message, text, [sender]);
}

async function showCommand(sock, message, from, sender, prefix, cmd) {
    const role = cmd.role ?? (cmd.ownerOnly ? 2 : cmd.adminOnly ? 1 : 0);

    let text = `╭───「 📋 COMMAND INFO 」\n`;
    text += `│ 🏷️ Name       : ${cmd.name}\n`;
    text += `│ 🔄 Aliases    : ${cmd.aliases?.length ? cmd.aliases.join(', ') : 'none'}\n`;
    text += `│ 📂 Category   : ${cmd.category || 'general'}\n`;
    text += `│ 📖 Usage      : ${prefix}${cmd.usage || cmd.name}\n`;
    text += `│ 📝 Info       : ${cmd.description || cmd.longDescription || 'No description'}\n`;
    text += `│ ⏱️ Cooldown   : ${cmd.cooldown || 0}s\n`;
    text += `│ 👥 Role       : ${ROLE[role] || 'Everyone'}\n`;
    text += `│ 👫 Group Only : ${cmd.groupOnly ? 'Yes' : 'No'}\n`;
    text += `│ 🔓 No Prefix  : ${cmd.noPrefix ? 'Yes' : 'No'}\n`;
    if (typeof cmd.onReply === 'function') text += `│ 💬 onReply    : Yes\n`;
    if (typeof cmd.onReaction === 'function') text += `│ 💫 onReaction : Yes\n`;
    if (typeof cmd.onChat === 'function') text += `│ 🗨️ onChat     : Yes\n`;
    if (cmd.example) text += `│ 💡 Example    : ${prefix}${cmd.example}\n`;
    text += `╰────────────────────`;

    await sock.sendMessage(from, { text, mentions: [sender] }, { quoted: message });
}

export default {
    config: {
        name: 'help',
        aliases: ['h', 'menu', 'cmds', 'commands'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Show all commands, a category, or command details',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}help | {prefix}help <category> | {prefix}help <command>' },
    },

    async onStart({ sock, message, args, from, sender, prefix }) {
        const { getAllCommands, getAllCategories, getCommandsByCategory, getCommand } = await import('../../utils/commandManager.js');
        const query = (args[0] || '').toLowerCase().trim();

        if (!query) {
            return showMain(sock, message, from, sender, prefix, getAllCommands, getAllCategories, getCommandsByCategory);
        }

        const cats = getAllCategories().map(c => c.toLowerCase());
        if (cats.includes(query)) {
            return showCategory(sock, message, from, sender, prefix, query, getCommandsByCategory);
        }

        const found = getCommand(query);
        if (found) return showCommand(sock, message, from, sender, prefix, found);

        await sock.sendMessage(from, {
            text: `❌ *${query}* is not a valid command or category.\n\nUse *${prefix}help* to see everything.`
        }, { quoted: message });
    },
};
