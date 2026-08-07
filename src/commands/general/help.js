import config from '../../config.js';
import axios from 'axios';
import moment from 'moment';

const BOOT = Date.now();

const CAT_EMOJI = {
    admin: '🛡️', ai: '🤖', downloader: '📥', economy: '💰',
    fun: '🎭', games: '🎮', general: '📱', media: '🎨',
    owner: '👑', utility: '🔧', info: '📊', misc: '⭐',
    scraper: '🔍', edit: '✨',
};

const CAT_DESC = {
    admin: 'Group management & protection',
    ai: 'AI-powered features',
    downloader: 'Download from platforms',
    economy: 'Virtual currency system',
    fun: 'Entertainment & memes',
    games: 'Interactive games',
    general: 'Core bot commands',
    media: 'Media processing',
    owner: 'Bot owner controls',
    utility: 'Productivity tools',
    scraper: 'Web scraping tools',
    edit: 'Image editing',
};

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
    ];
    for (const api of apis.sort(() => Math.random() - 0.5)) {
        try {
            const { data: meta } = await axios.get(api.url, { timeout: 6000 });
            const imgUrl = api.parse(meta);
            if (!imgUrl) continue;
            const res = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 10000 });
            const buf = Buffer.from(res.data);
            if (buf.length > 2000) return buf;
        } catch {}
    }
    return null;
}

export default {
    config: {
        name: 'help',
        aliases: ['menu', 'cmd', 'commands', 'menuhelp'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Show beautiful help menu',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}help [category]' }
    },

    async onStart({ args, reply, sender, prefix, pushName, message, sock, from, getAllCommands, getCommandsByCategory, getAllCategories, React }) {
        React('📋');

        const allCmds = getAllCommands();
        const cats = getAllCategories().sort();
        const cat = args[0]?.toLowerCase();

        // If user specified a category
        if (cat && cats.includes(cat)) {
            const cmds = getCommandsByCategory(cat);
            const emoji = CAT_EMOJI[cat] || '⭐';
            const desc = CAT_DESC[cat] || '';

            let text = `╭──────────────────╮\n`;
            text += `│  ${emoji} *${cat.toUpperCase()}* Commands\n`;
            text += `│  ${desc}\n`;
            text += `╰──────────────────╯\n\n`;

            for (const cmd of (cmds || []).sort((a, b) => a.name.localeCompare(b.name))) {
                text += `  ◆ ${prefix}${cmd.name}`;
                if (cmd.aliases?.length) text += ` _(${cmd.aliases[0]})_`;
                text += `\n`;
                if (cmd.description) text += `    ${cmd.description}\n`;
            }

            text += `\n╭──────────────────╮\n`;
            text += `│  📊 ${cmds?.length || 0} commands\n`;
            text += `│  ${prefix}help — back to menu\n`;
            text += `╰──────────────────╯`;

            return reply(text);
        }

        // Main help menu with image
        const name = pushName || 'User';
        const uid = sender.split('@')[0];
        const now = moment();
        const botName = 'AMAZING BOT';

        let text = `╭──────────────────────────────╮\n`;
        text += `│\n`;
        text += `│  🤖 *${botName}*\n`;
        text += `│  ━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `│\n`;
        text += `│  👤 ${name}\n`;
        text += `│  🆔 ${uid}\n`;
        text += `│  ⏱️ ${uptime(Date.now() - BOOT)}\n`;
        text += `│  📊 ${allCmds.length} commands\n`;
        text += `│  💾 ${ramUsage()}\n`;
        text += `│  📅 ${now.format('DD MMM YYYY · HH:mm')}\n`;
        text += `│\n`;
        text += `╰──────────────────────────────╯\n\n`;

        for (const c of cats) {
            const cmds = getCommandsByCategory(c);
            if (!cmds?.length) continue;
            const emoji = CAT_EMOJI[c.toLowerCase()] || '⭐';
            const count = cmds.length;

            text += `  ${emoji} *${c.toUpperCase()}* ─ ${count}\n`;
            // Show first 5 commands
            const names = cmds.map(cmd => cmd.name).sort();
            text += `    ${names.slice(0, 5).join(', ')}`;
            if (count > 5) text += ` +${count - 5} more`;
            text += `\n\n`;
        }

        text += `╭──────────────────────────────╮\n`;
        text += `│  📌 *Quick Links*\n`;
        text += `│\n`;
        text += `│  ${prefix}help <category>\n`;
        text += `│  ${prefix}ping\n`;
        text += `│  ${prefix}uptime\n`;
        text += `│\n`;
        text += `│  _Tap a category to see all commands_`;
        text += `╰──────────────────────────────╯`;

        // Try to send with image
        const img = await fetchBotImage().catch(() => null);
        if (img) {
            try {
                return await sock.sendMessage(from, {
                    image: img,
                    caption: text,
                }, { quoted: message });
            } catch {}
        }

        reply(text);
    }
};
