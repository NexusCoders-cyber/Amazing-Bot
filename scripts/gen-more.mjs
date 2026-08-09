// Generator for GROUP ADMIN + OWNER + SETTINGS commands using the bot's state system.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE = path.join(__dirname, '..', 'src', 'commands');

const ADMIN_TMPL = (name, aliases, desc, guide, guard, body) => `export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: 'admin', coolDown: 3, role: 1, guide: { en: '${guide}' } },
  async onStart({ args, from, reply, isGroup, isGroupAdmin, sock, message }) {
    if (!isGroup) return reply('👥 Group only.');
    if (!isGroupAdmin) return reply('🛡️ Group admin only.');
${body}
  },
};
`;

// Group management actions available via baileys sock
const groupAdmin = {
  'tagall': { aliases: ['mentionall', 'all'], desc: 'Tag all group members', guide: '{prefix}tagall <message>', body: `try { const meta = await sock.groupMetadata(from); const txt = (args.join(' ')||'📢 @everyone'); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: txt, mentions }); } catch (e) { reply('❌ ' + e.message); }` },
  'tagadmin': { aliases: ['admin'], desc: 'Tag all group admins', guide: '{prefix}tagadmin <msg>', body: `try { const meta = await sock.groupMetadata(from); const admins = (meta.participants||[]).filter(p => p.admin).map(p => p.id); if (!admins.length) return reply('No admins found.'); const txt = (args.join(' ')||'📢 Admins'); await sock.sendMessage(from, { text: txt, mentions: admins }); } catch (e) { reply('❌ ' + e.message); }` },
  'hidetag': { aliases: ['htag'], desc: 'Tag all silently', guide: '{prefix}hidetag <msg>', body: `try { const meta = await sock.groupMetadata(from); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: args.join(' ')||'', mentions }); } catch (e) { reply('❌ ' + e.message); }` },
  'kick': { aliases: ['remove', 'rm'], desc: 'Remove a member', guide: '{prefix}kick @mention or reply', body: `const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention or reply to the person to kick.'); try { await sock.groupParticipantsUpdate(from, [target], 'remove'); reply('👢 Kicked'); } catch (e) { reply('❌ ' + e.message); }` },
  'promote': { aliases: ['adminadd'], desc: 'Make a member admin', guide: '{prefix}promote @mention', body: `const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention the person to promote.'); try { await sock.groupParticipantsUpdate(from, [target], 'promote'); reply('⬆️ Promoted'); } catch (e) { reply('❌ ' + e.message); }` },
  'demote': { aliases: ['adminremove'], desc: 'Remove admin from a member', guide: '{prefix}demote @mention', body: `const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!target) return reply('Mention the person to demote.'); try { await sock.groupParticipantsUpdate(from, [target], 'demote'); reply('⬇️ Demoted'); } catch (e) { reply('❌ ' + e.message); }` },
  'link': { aliases: ['grouplink', 'invite'], desc: 'Get group invite link', guide: '{prefix}link', body: `try { const code = await sock.groupInviteCode(from); reply('🔗 https://chat.whatsapp.com/' + code); } catch (e) { reply('❌ ' + e.message); }` },
  'setdesc': { aliases: ['setdesc'], desc: 'Set group description', guide: '{prefix}setdesc <text>', body: `if (!args[0]) return reply('Usage: setdesc <text>'); try { await sock.groupUpdateDescription(from, args.join(' ')); reply('✅ Description updated'); } catch (e) { reply('❌ ' + e.message); }` },
  'setppgroup': { aliases: ['setgrouppp', 'setgpic'], desc: 'Set group profile pic', guide: '{prefix}setppgroup (reply to image)', body: `const img = message?.message?.imageMessage; if (!img) return reply('Reply to an image.'); try { const buffer = await sock.downloadMediaMessage(message); await sock.updateProfilePicture(from, buffer); reply('✅ Profile pic updated'); } catch (e) { reply('❌ ' + e.message); }` },
  'groupid': { aliases: ['gid'], desc: 'Get group ID', guide: '{prefix}groupid', body: `reply('🆔 ' + from);` },
  'totalmembers': { aliases: ['members'], desc: 'Total group members', guide: '{prefix}totalmembers', body: `try { const meta = await sock.groupMetadata(from); reply('👥 ' + meta.participants.length + ' members'); } catch (e) { reply('❌ ' + e.message); }` },
  'close': { aliases: ['lockgroup'], desc: 'Close group (admin only can send)', guide: '{prefix}close', body: `try { await sock.groupSettingUpdate(from, 'announcement'); reply('🔒 Group closed'); } catch (e) { reply('❌ ' + e.message); }` },
  'open': { aliases: ['unlockgroup'], desc: 'Open group (all can send)', guide: '{prefix}open', body: `try { await sock.groupSettingUpdate(from, 'not_announcement'); reply('🔓 Group opened'); } catch (e) { reply('❌ ' + e.message); }` },
  'delete': { aliases: ['del', 'removemsg'], desc: 'Delete a bot message', guide: '{prefix}delete (reply to message)', body: `const key = message?.message?.extendedTextMessage?.contextInfo?.stanzaId; if (!key) return reply('Reply to a message to delete.'); try { await sock.sendMessage(from, { delete: { remoteJid: from, id: key, participant: message?.message?.extendedTextMessage?.contextInfo?.participant } }); } catch (e) { reply('❌ ' + e.message); }` },
  'poll': { aliases: ['createpoll'], desc: 'Create a group poll', guide: '{prefix}poll question | opt1 | opt2', body: `const parts = args.join(' ').split('|').map(s => s.trim()); if (parts.length < 3) return reply('Usage: poll question | option1 | option2'); const options = parts.slice(1); if (options.length > 10) return reply('Max 10 options.'); try { await sock.sendMessage(from, { poll: { name: parts[0], values: options, selectableCount: 1 } }); } catch (e) { reply('❌ ' + e.message); }` },
};

const OWNER_TMPL = (name, aliases, desc, guide, role, body) => `export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: 'owner', coolDown: 2, role: ${role}, guide: { en: '${guide}' } },
  async onStart({ args, reply, sock, message }) {
${body}
  },
};
`;

const owner = {
  'broadcast': { aliases: ['bc', 'bcast'], desc: 'Broadcast a message to all chats', guide: '{prefix}broadcast <text>', role: 2, body: `if (!args[0]) return reply('Usage: broadcast <text>');\n    const txt = args.join(' ');\n    const chats = sock.chats || [];\n    let sent = 0;\n    for (const c of chats.all?.() || []) { try { if (c.id?.endsWith('@g.us') || c.id?.endsWith('@s.whatsapp.net')) { await sock.sendMessage(c.id, { text: '📢 ' + txt }); sent++; } } catch {} }\n    reply('📢 Sent to ' + sent + ' chats');` },
  'join': { aliases: ['joingroup'], desc: 'Join a group via invite code', guide: '{prefix}join <invite code or link>', role: 2, body: `const link = args[0] || ''; const code = link.match(/chat\\.whatsapp\\.com\\/([A-Za-z0-9_-]+)/)?.[1] || link;\n    if (!code) return reply('Send an invite link or code.');\n    try { await sock.groupAcceptInvite(code); reply('✅ Joined group'); } catch (e) { reply('❌ ' + e.message); }` },
  'leave': { aliases: ['leavegroup'], desc: 'Leave the group', guide: '{prefix}leave', role: 2, body: `const from = message?.key?.remoteJid;\n    try { await sock.groupLeave(from); } catch (e) { reply('❌ ' + e.message); }` },
  'restart': { aliases: ['reboot'], desc: 'Restart the bot', guide: '{prefix}restart', role: 2, body: `reply('🔄 Restarting...');\n    process.exit(0);` },
  'block': { aliases: ['blk'], desc: 'Block a user', guide: '{prefix}block @mention', role: 2, body: `const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];\n    if (!target) return reply('Mention the user to block.');\n    try { await sock.updateBlockStatus(target, 'block'); reply('🚫 Blocked'); } catch (e) { reply('❌ ' + e.message); }` },
  'unblock': { aliases: [], desc: 'Unblock a user', guide: '{prefix}unblock @mention', role: 2, body: `const target = message?.message?.extendedTextMessage?.contextInfo?.participant || message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];\n    if (!target) return reply('Mention the user to unblock.');\n    try { await sock.updateBlockStatus(target, 'unblock'); reply('✅ Unblocked'); } catch (e) { reply('❌ ' + e.message); }` },
  'setprefix': { aliases: ['prefix'], desc: 'Change the command prefix', guide: '{prefix}setprefix <symbol>', role: 2, body: `if (!args[0]) return reply('Usage: setprefix <symbol>');\n    try { await import('../../config.js'); process.env.PREFIX = args[0]; reply('✅ Prefix set to: ' + args[0]); } catch (e) { reply('❌ ' + e.message); }` },
  'setbio': { aliases: [], desc: 'Set bot profile bio', guide: '{prefix}setbio <text>', role: 2, body: `if (!args[0]) return reply('Usage: setbio <text>');\n    try { await sock.updateProfileStatus(args.join(' ')); reply('✅ Bio updated'); } catch (e) { reply('❌ ' + e.message); }` },
  'setbotname': { aliases: ['setname'], desc: 'Set bot profile name', guide: '{prefix}setbotname <name>', role: 2, body: `if (!args[0]) return reply('Usage: setbotname <name>');\n    try { await sock.updateProfileName(args.join(' ')); reply('✅ Name updated'); } catch (e) { reply('❌ ' + e.message); }` },
  'getvar': { aliases: ['getenv'], desc: 'Get an env variable', guide: '{prefix}getvar <KEY>', role: 2, body: `if (!args[0]) return reply('Usage: getvar KEY');\n    reply('🔑 ' + args[0] + ' = ' + (process.env[args[0]] || '(not set)'));` },
  'setvar': { aliases: ['setenv'], desc: 'Set an env variable', guide: '{prefix}setvar KEY=value', role: 2, body: `const eq = args.join(' ').indexOf('='); if (eq < 0) return reply('Usage: setvar KEY=value');\n    const k = args.join(' ').slice(0, eq).trim(), v = args.join(' ').slice(eq + 1).trim();\n    process.env[k] = v; reply('✅ ' + k + ' = ' + v);` },
  'update': { aliases: ['up'], desc: 'Pull latest updates', guide: '{prefix}update', role: 2, body: `reply('🔄 Run git pull manually on the host to update.');` },
};

const SETTINGS_TMPL = (name, aliases, desc, guide, key, defaultVal) => `import { setSetting, getSetting } from '../../utils/threadsData.js';
export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: 'settings', coolDown: 2, role: 0, guide: { en: '${guide}' } },
  async onStart({ args, from, reply }) {
    const state = args[0] ? !['off','false','0','disable'].includes(args[0].toLowerCase()) : !((await getSetting(from, '${key}')) ?? ${JSON.stringify(defaultVal)});
    await setSetting(from, '${key}', state);
    reply('✅ ' + (state ? 'Enabled' : 'Disabled') + ': ${desc}');
  },
};
`;

const settings = [
  ['welcome', ['setwelcome'], 'Group welcome message', '{prefix}welcome on/off', 'welcome', true],
  ['goodbye', ['setgoodbye'], 'Group goodbye message', '{prefix}goodbye on/off', 'goodbye', true],
  ['antilink', [], 'Anti-link protection', '{prefix}antilink on/off', 'antilink', true],
  ['antiforeign', [], 'Block foreign numbers', '{prefix}antiforeign on/off', 'antiforeign', false],
  ['antidelete', [], 'Detect deleted messages', '{prefix}antidelete on/off', 'antidelete', true],
  ['antiviewonce', [], 'Detect view-once messages', '{prefix}antiviewonce on/off', 'antiviewonce', false],
  ['alwaysonline', [], 'Always show online', '{prefix}alwaysonline on/off', 'alwaysonline', true],
  ['autoread', [], 'Auto-read messages', '{prefix}autoread on/off', 'autoread', true],
  ['mute', ['mutegroup'], 'Mute the group', '{prefix}mute on/off', 'mute', false],
];

function write(dir, file, code) {
  const d = path.join(BASE, dir);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, file), code);
}

let n = 0;
for (const [name, c] of Object.entries(groupAdmin)) write('admin', name + '.js', ADMIN_TMPL(name, c.aliases, c.desc, c.guide, '', c.body)), n++;
for (const [name, c] of Object.entries(owner)) write('owner', name + '.js', OWNER_TMPL(name, c.aliases, c.desc, c.guide, c.role, c.body)), n++;
for (const [name, aliases, desc, guide, key, def] of settings) write('settings', name + '.js', SETTINGS_TMPL(name, aliases, desc, guide, key, def)), n++;
console.log('Created', n, 'commands');
