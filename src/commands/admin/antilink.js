import { getGroupAntilink, setGroupAntilink } from '../../utils/antilinkStore.js';

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+)/i;

export async function checkAntilink(sock, message) {
    const from = message?.key?.remoteJid;
    if (!from?.endsWith('@g.us')) return false;
    const cfg = await getGroupAntilink(from);
    if (!cfg?.enabled) return false;

    const sender = message?.key?.participant;
    if (!sender) return false;

    const msg = message?.message;
    const text = msg?.conversation || msg?.extendedTextMessage?.text || msg?.imageMessage?.caption || msg?.videoMessage?.caption || '';
    if (!text || !URL_REGEX.test(text)) return false;

    try {
        await sock.sendMessage(from, { delete: message.key });
        if (cfg.mode === 'kick' || cfg.mode === 'deletekick') {
            await sock.sendMessage(from, { text: `@${sender.split('@')[0]} was kicked for sending a link.`, mentions: [sender] });
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
        } else {
            await sock.sendMessage(from, { text: `Links are not allowed here, @${sender.split('@')[0]}`, mentions: [sender] });
        }
    } catch {}
    return true;
}

export default {
    config: {
        name: 'antilink',
        aliases: ['nolink', 'al'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Manage anti-link protection',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antilink on|off|delete|kick|deletekick' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const sub = (args[0] || '').toLowerCase();
        const cfg = await getGroupAntilink(from);

        if (sub === 'on') { await setGroupAntilink(from, true, cfg.mode); return reply('Antilink enabled.'); }
        if (sub === 'off') { await setGroupAntilink(from, false, cfg.mode); return reply('Antilink disabled.'); }
        if (['delete', 'kick', 'deletekick'].includes(sub)) {
            await setGroupAntilink(from, cfg.enabled, sub);
            return reply(`Antilink mode set to ${sub}`);
        }
        reply(`Antilink: ${cfg.enabled ? 'ON' : 'OFF'} | Mode: ${cfg.mode}\nModes: on | off | delete | kick | deletekick`);
    },
};
