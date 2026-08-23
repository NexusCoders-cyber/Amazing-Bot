import fs from 'fs-extra';
import path from 'path';

const WORD_FILE = path.join(process.cwd(), 'data', 'badwords.json');
let _words = null;
function loadWords() { if (_words) return _words; try { _words = fs.readJsonSync(WORD_FILE); } catch { _words = {}; } return _words; }
function saveWords() { fs.ensureDirSync(path.dirname(WORD_FILE)); fs.writeJsonSync(WORD_FILE, _words, { spaces: 2 }); }
function getWords(jid) { return loadWords()[jid] || { enabled: false, words: [] }; }

export async function checkBadWord(sock, message) {
    const from = message?.key?.remoteJid;
    if (!from?.endsWith('@g.us')) return false;
    const cfg = getWords(from);
    if (!cfg.enabled || !cfg.words?.length) return false;

    const text = message?.message?.conversation || message?.message?.extendedTextMessage?.text || '';
    if (!text) return false;
    const lower = text.toLowerCase();
    const found = cfg.words.find(w => lower.includes(w.toLowerCase()));
    if (!found) return false;

    const sender = message?.key?.participant;
    try {
        await sock.sendMessage(from, { delete: message.key });
        await sock.sendMessage(from, { text: `Watch your language, @${sender?.split('@')[0]}`, mentions: sender ? [sender] : [] });
    } catch {}
    return true;
}

export default {
    config: {
        name: 'antiword',
        aliases: ['badword', 'filter'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Bad word filter',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antiword on|off|add <word>|remove <word>|list' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const words = loadWords();
        if (!words[from]) words[from] = { enabled: false, words: [] };
        const sub = (args[0] || '').toLowerCase();

        if (sub === 'on') { words[from].enabled = true; saveWords(); return reply('Word filter enabled.'); }
        if (sub === 'off') { words[from].enabled = false; saveWords(); return reply('Word filter disabled.'); }
        if (sub === 'add' && args[1]) {
            const w = args[1].toLowerCase();
            if (!words[from].words.includes(w)) { words[from].words.push(w); saveWords(); }
            return reply(`Added "${w}" to filter.`);
        }
        if (sub === 'remove' && args[1]) {
            words[from].words = words[from].words.filter(w => w !== args[1].toLowerCase());
            saveWords();
            return reply(`Removed "${args[1]}" from filter.`);
        }
        if (sub === 'list') {
            const list = words[from].words;
            return reply(list.length ? `Banned words:\n${list.join(', ')}` : 'No banned words set.');
        }
        reply(`Filter: ${words[from].enabled ? 'ON' : 'OFF'}\nWords: ${words[from].words.length}`);
    },
};
