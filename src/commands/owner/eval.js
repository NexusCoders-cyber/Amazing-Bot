import config from '../../config.js';
import fs from 'fs-extra';
import path from 'path';

const evalHistory = [];
const MAX_HISTORY = 30;

const BLOCKED_PATTERNS = [
    /process\.env\.(.*SECRET|.*KEY|.*PASSWORD|.*TOKEN|SESSION_ID|MONGODB|DATABASE)/i,
    /require\s*\(\s*['"]child_process['"]\s*\)/i,
    /import\s+.*from\s+['"]child_process['"]/i,
];

const REDACT_PATTERNS = [
    /sk-[a-zA-Z0-9\-]{20,}/g,
    /ghp_[A-Za-z0-9]{36}/g,
    /AIza[0-9A-Za-z\-_]{35}/g,
    /mongodb(\+srv)?:\/\/[^\s"']+/gi,
    /postgres(ql)?:\/\/[^\s"']+/gi,
];

function sanitize(str) {
    let out = String(str ?? '');
    for (const r of REDACT_PATTERNS) out = out.replace(r, '[REDACTED]');
    return out;
}

function serialize(val, depth = 0) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
    if (typeof val === 'bigint') return val.toString() + 'n';
    if (typeof val === 'symbol') return val.toString();
    if (typeof val === 'string') return depth === 0 ? val : JSON.stringify(val);
    if (val instanceof Error) {
        return `[${val.constructor.name}: ${val.message}]\n${(val.stack || '').split('\n').slice(1, 4).join('\n')}`;
    }
    if (val instanceof Map) {
        if (depth > 2) return `Map(${val.size}) { ... }`;
        const entries = [...val.entries()].slice(0, 20).map(([k, v]) => `  ${serialize(k, depth + 1)} => ${serialize(v, depth + 1)}`).join(',\n');
        return `Map(${val.size}) {\n${entries}\n}`;
    }
    if (val instanceof Set) {
        if (depth > 2) return `Set(${val.size}) { ... }`;
        const items = [...val].slice(0, 20).map(v => `  ${serialize(v, depth + 1)}`).join(',\n');
        return `Set(${val.size}) {\n${items}\n}`;
    }
    if (Buffer.isBuffer(val)) {
        return `<Buffer ${val.slice(0, 16).toString('hex')}${val.length > 16 ? '...' : ''} (${val.length} bytes)>`;
    }
    if (Array.isArray(val)) {
        if (depth > 3) return `[ Array(${val.length}) ]`;
        const items = val.slice(0, 30).map(v => '  ' + serialize(v, depth + 1));
        if (val.length > 30) items.push(`  ... ${val.length - 30} more`);
        return `[\n${items.join(',\n')}\n]`;
    }
    if (typeof val === 'object') {
        if (depth > 3) return '{ Object }';
        try {
            const keys = Object.keys(val).slice(0, 25);
            const entries = keys.map(k => `  ${k}: ${serialize(val[k], depth + 1)}`);
            if (Object.keys(val).length > 25) entries.push(`  ... ${Object.keys(val).length - 25} more keys`);
            return `{\n${entries.join(',\n')}\n}`;
        } catch { return '[Circular]'; }
    }
    return String(val);
}

export default {
    name: 'eval',
    aliases: ['e', 'evaluate', 'run', '>'],
    category: 'owner',
    description: 'Execute JavaScript code - Owner only',
    usage: 'eval <code>\neval --history\neval --clear\neval --quoted',
    example: 'eval 2+2\neval sock.user.id\neval await sock.groupMetadata(from)\neval Object.keys(config)\neval Object.keys(global)\neval --history',
    cooldown: 0,
    permissions: ['owner'],
    ownerOnly: true,
    args: true,
    minArgs: 1,

    async execute({ sock, message, args, from, sender, prefix }) {
        if (process.env.DISABLE_EVAL === 'true') {
            return await sock.sendMessage(from, {
                text: 'Eval command is disabled. Set DISABLE_EVAL=false to enable.'
            }, { quoted: message });
        }

        let code = args.join(' ');

        if (code === '--history' || code === '-h') {
            if (!evalHistory.length) {
                return sock.sendMessage(from, { text: '📭 No eval history yet.' }, { quoted: message });
            }
            const lines = evalHistory.slice(-15).map((h, i) =>
                `${i + 1}. ${h.code.slice(0, 55)}${h.code.length > 55 ? '…' : ''}\n   ${h.ok ? '✅' : '❌'} ${h.time}ms — ${h.ts}`
            ).join('\n\n');
            return sock.sendMessage(from, { text: `📋 Eval History (last 15)\n\n${lines}` }, { quoted: message });
        }

        if (code === '--clear') {
            evalHistory.length = 0;
            return sock.sendMessage(from, { text: '🗑️ Eval history cleared.' }, { quoted: message });
        }

        if (code === '--quoted') {
            const q = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            code = q?.conversation || q?.extendedTextMessage?.text || '';
            if (!code.trim()) {
                return sock.sendMessage(from, { text: '❌ No text found in the quoted message.' }, { quoted: message });
            }
        }

        if (BLOCKED_PATTERNS.some(p => p.test(code))) {
            return await sock.sendMessage(from, {
                text: 'Blocked: Code contains restricted operations (environment secrets, process manipulation)'
            }, { quoted: message });
        }

        const startTime = Date.now();
        let result;
        let isError = false;

        try {
            const isMultiLine = code.includes('\n') || code.includes(';') || /\breturn\b/.test(code);
            const asyncCode = isMultiLine
                ? `(async () => { ${code} })()`
                : `(async () => { return (${code}) })()`;
            result = await eval(asyncCode);
            result = sanitize(serialize(result));
        } catch (err) {
            isError = true;
            result = sanitize(`${err.constructor?.name || 'Error'}: ${err.message}\n${(err.stack || '').split('\n').slice(1, 4).join('\n')}`);
        }

        const executionTime = Date.now() - startTime;

        evalHistory.push({
            code: code.slice(0, 100),
            ok: !isError,
            time: executionTime,
            ts: new Date().toLocaleTimeString()
        });
        if (evalHistory.length > MAX_HISTORY) evalHistory.shift();

        const truncated = result.length > 3500;
        const displayResult = truncated
            ? result.substring(0, 3500) + '…[truncated]'
            : result;

        let response = `${isError ? '❌ Error' : '✅ Success'}\n\n`;
        response += `Code:\n${code}\n\n`;
        response += `Result:\n${displayResult}\n\n`;
        response += `Time: ${executionTime}ms`;

        await sock.sendMessage(from, { text: response }, { quoted: message });

        if (!isError && truncated) {
            try {
                const tmpPath = path.join(process.cwd(), 'temp', `eval_${Date.now()}.txt`);
                await fs.ensureDir(path.dirname(tmpPath));
                await fs.writeFile(tmpPath, result, 'utf8');
                await sock.sendMessage(from, {
                    document: await fs.readFile(tmpPath),
                    mimetype: 'text/plain',
                    fileName: `eval_output_${Date.now()}.txt`,
                    caption: `📄 Full output (${result.length} chars)`
                }, { quoted: message });
                fs.remove(tmpPath).catch(() => {});
            } catch {}
        }
    }
};
