import axios from 'axios';
import crypto from 'crypto';
import { registerOnReply } from '../../src/utils/amazingbot.js';

const chatHistories = new Map();
const MAX_HISTORY = 30;

function getHistory(userId) {
    if (!chatHistories.has(userId)) chatHistories.set(userId, []);
    return chatHistories.get(userId);
}

function addHistory(userId, role, content) {
    const h = getHistory(userId);
    h.push({ role, content });
    if (h.length > MAX_HISTORY * 2) chatHistories.set(userId, h.slice(-MAX_HISTORY * 2));
}

// Detect intent from message
function detectIntent(text) {
    const lower = text.toLowerCase();

    // Image generation
    if (/\b(generate|create|make|draw|imagine|design|produce|render)\b.*\b(image|picture|photo|art|illustration|painting|drawing|pic|img|wallpaper|avatar)\b/i.test(lower) ||
        /\b(image|picture|photo|art|illustration)\b.*\b(of|with|showing|featuring|containing)\b/i.test(lower) ||
        /\b(draw|paint|sketch|illustrate)\b/i.test(lower) ||
        /^imagine\b/i.test(lower)) {
        const prompt = text
            .replace(/\b(generate|create|make|draw|imagine|design|produce|render|an?\s+)?\b\s*(image|picture|photo|art|illustration|painting|drawing|pic|img|wallpaper|avatar|of|with|showing|featuring|containing)\b/gi, '')
            .trim();
        return { type: 'image', prompt: prompt || text };
    }

    // Video generation
    if (/\b(generate|create|make|produce)\b.*\b(video|animation|clip|reel|motion)\b/i.test(lower) ||
        /\b(video|animation|clip)\b.*\b(of|with|showing)\b/i.test(lower) ||
        /\b(animate|motion|timelapse)\b/i.test(lower)) {
        const prompt = text
            .replace(/\b(generate|create|make|produce|an?\s+)?\b\s*(video|animation|clip|reel|motion|of|with|showing)\b/gi, '')
            .trim();
        return { type: 'video', prompt: prompt || text };
    }

    // Reset
    if (/^(reset|clear|start\s*over|new\s*chat|forget\s*everything)/i.test(lower)) {
        return { type: 'reset' };
    }

    // Default: chat
    return { type: 'chat', prompt: text };
}

// AI backends with fallback
async function askGemini(prompt, history = []) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('no key');
    const contents = [
        ...history.slice(-10).map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
        })),
        { role: 'user', parts: [{ text: prompt }] },
    ];
    const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.8 } },
        { timeout: 60000 }
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
}

async function askOpenAI(prompt, history = []) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('no key');
    const messages = [
        { role: 'system', content: `You are Ilom AI, a smart, friendly AI assistant built by Broken_vzn. You can chat, generate images, and generate videos. When the user asks you to generate/create/make an image or video, tell them you'll do it (the system handles it automatically). Be helpful, concise, and have personality. Use emojis naturally. Current time: ${new Date().toISOString()}` },
        ...history.slice(-10).map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
        { role: 'user', content: prompt },
    ];
    const { data } = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-4o-mini', messages, max_tokens: 2048, temperature: 0.8 },
        { headers: { Authorization: `Bearer ${key}` }, timeout: 60000 }
    );
    return data.choices?.[0]?.message?.content || 'No response.';
}

async function aiChat(prompt, history) {
    if (process.env.GEMINI_API_KEY) {
        try { return await askGemini(prompt, history); } catch {}
    }
    if (process.env.OPENAI_API_KEY) {
        try { return await askOpenAI(prompt, history); } catch {}
    }
    return '❌ No AI API keys configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env';
}

async function generateImage(prompt) {
    try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
        const buf = Buffer.from(data);
        if (buf.length > 5000) return buf;
    } catch {}
    return null;
}

async function generateVideo(prompt) {
    try {
        const { data } = await axios.post(
            'https://api.pollinations.ai/video/generate',
            { prompt, model: 'fast-svd' },
            { timeout: 120000 }
        );
        return data?.url || null;
    } catch {}
    return null;
}

// Sticker hash for binding
function stickerHash(msg) {
    try {
        const sticker = msg?.message?.stickerMessage || msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
        if (!sticker) return null;
        const id = sticker.fileSha256 || sticker.fileEncSha256;
        if (id) return Buffer.from(id).toString('hex');
        return null;
    } catch { return null; }
}

// Load sticker bindings
async function getStickerBindings() {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'data', 'sticker_bindings.json');
        if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {}
    return {};
}

async function saveStickerBinding(hash, cmd) {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'sticker_bindings.json');
    const bindings = await getStickerBindings();
    bindings[hash] = { command: cmd, createdAt: Date.now() };
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(bindings, null, 2));
}

export default {
    config: {
        name: 'ilom',
        aliases: ['agnes', 'ai', 'ask', 'chat', 'ilomai'],
        author: 'Broken_vzn',
        version: '3.0',
        shortDescription: 'Ilom AI — chat, generate images, videos, all in one',
        category: 'ai',
        coolDown: 3,
        role: 0,
        guide: {
            en: '{prefix}ilom <text> — chat with AI\n\nJust talk naturally:\n• "generate an image of a sunset" → auto-generates image\n• "make a video of waves" → auto-generates video\n• "reset" → clears conversation\n• Reply to keep chatting\n\nSticker binding:\n• Reply to sticker with: {prefix}ilom setcmd <command>\n  (binds that sticker to a command)'
        }
    },

    async onStart({ args, reply, sender, prefix, message, sock, from, React }) {
        React('🤖');

        const text = args.join(' ').trim();

        // Handle sticker-to-command binding
        const quotedSticker = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
        if (quotedSticker && text.startsWith('setcmd ')) {
            const cmd = text.replace('setcmd ', '').trim();
            if (!cmd) return reply(`Usage: Reply to a sticker and type ${prefix}ilom setcmd <command>\nExample: Reply to sticker with "${prefix}ilom setcmd tagall"`);

            const hash = stickerHash(message);
            if (hash) {
                await saveStickerBinding(hash, cmd);
                return reply([
                    `━━━━━━━━━━━━━━━━━━━━`,
                    `  ✅ *STICKER BOUND*`,
                    `━━━━━━━━━━━━━━━━━━━━`,
                    ``,
                    `  🖼️ Sticker → *${prefix}${cmd}*`,
                    `  📌 Anytime this sticker is sent, it runs *${cmd}*`,
                    ``,
                    `━━━━━━━━━━━━━━━━━━━━`,
                ].join('\n'));
            }
            return reply(`❌ Could not read sticker data.`);
        }

        // No text - show help
        if (!text) {
            return reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  🤖 *ILOM AI v3*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  💬 *Chat:* Just talk naturally!`,
                `  🖼️ *Image:* "generate an image of..."`,
                `  🎬 *Video:* "make a video of..."`,
                `  🔄 *Reset:* "reset"`,
                `  🖼️ *Bind sticker:* Reply to sticker with "${prefix}ilom setcmd <cmd>"`,
                ``,
                `_Reply to any message to continue chatting_`,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        }

        // Detect intent
        const intent = detectIntent(text);

        // Handle reset
        if (intent.type === 'reset') {
            chatHistories.delete(sender);
            return reply(`🔄 Conversation reset. Fresh start!`);
        }

        // Handle image generation
        if (intent.type === 'image') {
            const prompt = intent.prompt;
            addHistory(sender, 'user', `[Generating image: ${prompt}]`);

            // Ask AI what it thinks about the request
            const aiResponse = await aiChat(`The user wants to generate an image with this prompt: "${prompt}". Acknowledge this and say you're generating it.`, getHistory(sender).slice(0, -1));

            React('🎨');
            await reply(`🎨 *Generating image...*\n📝 ${prompt}`);

            const img = await generateImage(prompt);
            if (img) {
                addHistory(sender, 'assistant', `[Generated image: ${prompt}]`);
                const sent = await sock.sendMessage(from, {
                    image: img,
                    caption: `🖼️ *${prompt}*\n\n${aiResponse}\n\n_Ilom AI_`,
                }, { quoted: message });
                registerOnReply(sent.key.id, { commandName: 'ilom', author: sender, data: {} });
            } else {
                reply(`❌ Image generation failed. Try a different prompt.`);
            }
            return;
        }

        // Handle video generation
        if (intent.type === 'video') {
            const prompt = intent.prompt;
            addHistory(sender, 'user', `[Generating video: ${prompt}]`);

            React('🎬');
            await reply(`🎬 *Generating video...*\n📝 ${prompt}\n⏳ This may take a minute...`);

            const videoUrl = await generateVideo(prompt);
            if (videoUrl) {
                addHistory(sender, 'assistant', `[Generated video: ${prompt}]`);
                await reply(`🎬 *Video Generated*\n\n${videoUrl}\n\n_Ilom AI_`);
            } else {
                reply(`❌ Video generation failed or not available.`);
            }
            return;
        }

        // Regular chat
        addHistory(sender, 'user', text);
        const history = getHistory(sender);

        React('💭');
        try {
            const response = await aiChat(text, history.slice(0, -1));
            addHistory(sender, 'assistant', response);

            const sent = await sock.sendMessage(from, {
                text: `🤖 *Ilom AI*\n━━━━━━━━━━━━━━━━━━━━\n\n${response}\n\n━━━━━━━━━━━━━━━━━━━━\n_Reply to continue_`,
            }, { quoted: message });
            registerOnReply(sent.key.id, { commandName: 'ilom', author: sender, data: {} });
        } catch (err) {
            reply(`❌ AI Error: ${err.message}`);
        }
    },

    // Continue chat on reply
    onReply({ reply, sender, message, Reply, sock, from, prefix }) {
        if (sender !== Reply.author) return;
        const text = message?.message?.conversation || message?.message?.extendedTextMessage?.text || '';
        if (!text) return;

        // Detect intent in reply too
        const intent = detectIntent(text);

        if (intent.type === 'image') {
            addHistory(sender, 'user', `[Generating image: ${intent.prompt}]`);
            generateImage(intent.prompt).then(async img => {
                if (img) {
                    addHistory(sender, 'assistant', `[Generated image: ${intent.prompt}]`);
                    await reply({
                        image: img,
                        caption: `🖼️ *${intent.prompt}*\n\n_Ilom AI_`,
                    });
                } else {
                    reply(`❌ Image generation failed.`);
                }
            });
            return;
        }

        if (intent.type === 'video') {
            reply(`🎬 Generating video...`);
            generateVideo(intent.prompt).then(async url => {
                if (url) {
                    addHistory(sender, 'assistant', `[Generated video: ${intent.prompt}]`);
                    await reply(`🎬 *Video:* ${url}`);
                } else {
                    reply(`❌ Video generation failed.`);
                }
            });
            return;
        }

        addHistory(sender, 'user', text);
        const history = getHistory(sender);

        aiChat(text, history.slice(0, -1)).then(async response => {
            addHistory(sender, 'assistant', response);
            const sent = await reply({
                text: `🤖 *Ilom AI*\n━━━━━━━━━━━━━━━━━━━━\n\n${response}\n\n━━━━━━━━━━━━━━━━━━━━\n_Reply to continue_`,
            });
            registerOnReply(sent.key.id, { commandName: 'ilom', author: sender, data: {} });
        }).catch(() => {
            reply(`❌ AI Error. Try again.`);
        });
    },
};
