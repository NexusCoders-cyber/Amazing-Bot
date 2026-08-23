import fs from 'fs-extra';
import path from 'path';

const DATA = path.join(process.cwd(), 'data');
const NOTES_FILE   = path.join(DATA, 'group_notes.json');
const REACT_FILE   = path.join(DATA, 'auto_react.json');

async function load(file) { try { return await fs.readJSON(file); } catch { return {}; } }
async function save(file, d) { await fs.ensureDir(DATA); await fs.writeJSON(file, d, { spaces: 2 }); }

export const wordChainState = new Map();
export const countGameState = new Map();

export async function handleGroupFeatures(sock, from, senderJid, text, message) {
    const t = text.trim();

    // ── Notes #key lookup ──────────────────────────────────────────────────
    if (t.startsWith('#') && t.length > 1 && !t.startsWith('##')) {
        const key = t.slice(1).split(/\s/)[0].toLowerCase();
        const notes = await load(NOTES_FILE);
        const note  = notes[from]?.[key];
        if (note) {
            if (note.type === 'text') {
                await sock.sendMessage(from, { text: note.content }, { quoted: message });
            } else if (note.type === 'image' && note.data) {
                await sock.sendMessage(from, { image: Buffer.from(note.data, 'base64'), caption: note.caption || '' }, { quoted: message });
            }
            return true;
        }
    }

    // ── Word chain game ────────────────────────────────────────────────────
    const wcs = wordChainState.get(from);
    if (wcs?.active) {
        const word = t.toLowerCase().replace(/[^a-z]/g, '');
        if (!word) return false;
        const { lastWord, usedWords } = wcs;
        const needed = lastWord.slice(-1);

        if (!word.startsWith(needed)) {
            await sock.sendMessage(from, {
                text: `❌ Word must start with *${needed.toUpperCase()}*! You said: _${word}_`,
            }, { quoted: message });
            return true;
        }
        if (usedWords.has(word)) {
            await sock.sendMessage(from, {
                text: `⚠️ *${word}* was already used! Game over!\n\nLast valid word: *${lastWord}*`,
            }, { quoted: message });
            wordChainState.delete(from);
            return true;
        }

        wcs.usedWords.add(word);
        wcs.lastWord = word;
        wcs.chain++;
        wordChainState.set(from, wcs);

        await sock.sendMessage(from, {
            text: `✅ *${word}* (+1) — Chain: ${wcs.chain}\nNext must start with: *${word.slice(-1).toUpperCase()}*`,
        }, { quoted: message });
        return true;
    }

    // ── Count game ─────────────────────────────────────────────────────────
    const cgs = countGameState.get(from);
    if (cgs?.active) {
        const num = parseInt(t.trim(), 10);
        if (isNaN(num)) return false;
        const { current, lastSender, highScore } = cgs;
        const expected = current + 1;

        if (senderJid === lastSender) {
            await sock.sendMessage(from, {
                text: `❌ You can't count twice in a row! Game reset to 0.\n\nHigh score: *${highScore}*`,
            }, { quoted: message });
            cgs.current = 0; cgs.lastSender = null;
            countGameState.set(from, cgs);
            return true;
        }
        if (num !== expected) {
            await sock.sendMessage(from, {
                text: `❌ Wrong number! Expected *${expected}*, got *${num}*. Game reset to 0.\n\nHigh score: *${highScore}*`,
            }, { quoted: message });
            cgs.current = 0; cgs.lastSender = null;
            countGameState.set(from, cgs);
            return true;
        }

        cgs.current = num;
        cgs.lastSender = senderJid;
        if (num > (cgs.highScore || 0)) cgs.highScore = num;
        countGameState.set(from, cgs);

        if (num % 50 === 0) {
            await sock.sendMessage(from, {
                text: `🎉 *${num}!* Milestone reached! Keep going! 🔢`,
            }, { quoted: message });
            return true;
        }
        if (num <= 10 || num % 10 === 0) {
            await sock.sendMessage(from, {
                text: `✅ *${num}* — Keep counting! Next: ${num + 1}`,
            }, { quoted: message });
            return true;
        }
        await sock.sendMessage(from, { react: { text: '✅', key: message.key } });
        return true;
    }

    // ── Auto-react ─────────────────────────────────────────────────────────
    const reactCfg = await load(REACT_FILE);
    const cfg = reactCfg[from];
    if (cfg?.enabled && cfg.emojis?.length) {
        const emoji = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
        await sock.sendMessage(from, { react: { text: emoji, key: message.key } }).catch(() => {});
    }

    return false;
}

export async function setGroupNote(groupId, key, note) {
    const notes = await load(NOTES_FILE);
    if (!notes[groupId]) notes[groupId] = {};
    notes[groupId][key] = note;
    await save(NOTES_FILE, notes);
}

export async function delGroupNote(groupId, key) {
    const notes = await load(NOTES_FILE);
    if (notes[groupId]) delete notes[groupId][key];
    await save(NOTES_FILE, notes);
}

export async function listGroupNotes(groupId) {
    const notes = await load(NOTES_FILE);
    return Object.keys(notes[groupId] || {});
}

export async function setAutoReact(groupId, enabled, emojis = []) {
    const cfg = await load(REACT_FILE);
    cfg[groupId] = { enabled, emojis };
    await save(REACT_FILE, cfg);
}
