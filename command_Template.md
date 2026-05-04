# Command Template Guide

This guide provides standardized templates for creating commands in the Amazing Bot. Follow these patterns to ensure consistency and proper functionality.

> **How commands are loaded:** Every `.js` file inside `src/commands/<category>/` that exports a default object with a `name` string and an `execute` function is automatically discovered by `commandManager.js` and registered. Aliases are registered in the alias map. External aliases (e.g. `fb → autolink`) are declared in `src/utils/axisAliasMap.js`.

---

## 📋 Table of Contents

1. [Basic Command Structure](#basic-command-structure)
2. [Command Categories](#command-categories)
3. [Permission Levels](#permission-levels)
4. [Execute Context Object](#execute-context-object)
5. [Template Examples](#template-examples)
   - [General Command](#general-command-template)
   - [Admin Command](#admin-command-template)
   - [Owner Command](#owner-command-template)
   - [Economy Command](#economy-command-template)
   - [Game Command](#game-command-template)
   - [AI Command](#ai-command-template)
   - [Media Command](#media-command-template)
   - [Downloader Command](#downloader-command-template)
   - [Canvas Command](#canvas-command-template)
   - [No-Prefix Command](#no-prefix-command-template)
6. [Font System Integration](#font-system-integration)
7. [Reply & Chat Handlers](#reply--chat-handlers)
8. [Best Practices](#-best-practices)
9. [Reference Tables](#reference-tables)

---

## Basic Command Structure

Every command file must export a default object with the following structure:

```javascript
export default {
    name: 'commandname',
    aliases: ['alias1', 'alias2'],
    category: 'category',
    description: 'Brief description of what the command does',
    usage: 'commandname [arg1] [arg2]',
    example: 'commandname value1 value2',
    cooldown: 3,
    permissions: ['user'],
    ownerOnly: false,
    adminOnly: false,
    groupOnly: false,
    privateOnly: false,
    botAdminRequired: false,
    minArgs: 0,
    maxArgs: 0,
    args: false,
    typing: true,
    noPrefix: false,

    async execute({ sock, message, args, from, sender, isGroup, isGroupAdmin, isBotAdmin, isOwner, isSudo, user, group, command, prefix, pushName, quoted }) {
        
    }
};
```

---

## Command Categories

Available categories for organizing commands (each maps to a subfolder in `src/commands/`):

- **admin** — Group administration and moderation
- **ai** — Artificial intelligence and chatbot features
- **downloader** — Media downloading from various platforms
- **economy** — Virtual economy, currency, and shop
- **fun** — Entertainment and miscellaneous fun commands
- **games** — Interactive games and puzzles
- **general** — General utility and information commands
- **media** — Media processing and manipulation
- **owner** — Bot owner exclusive commands
- **utility** — Useful tools and utilities

---

## Permission Levels

### How Permissions Are Resolved

Permission checks run in this order inside `commandHandler.js`:

```
1. ownerOnly  → isOwner must be true
2. sudoOnly   → isSudo must be true (sudo implies owner for all checks)
3. groupOnly  → message must be from a group
4. privateOnly→ message must be from a private chat
5. adminOnly  → isGroupAdmin || isOwner || isSudo must be true
6. botAdminRequired → isBotAdmin must be true
```

### Owner / Sudo Resolution

`isOwner` is `true` when the sender's phone number matches any of:
- Numbers in `OWNER_NUMBERS` env var
- Numbers in `SUDO_NUMBERS` env var (via `isSudoForSession`)
- Numbers added at runtime via `.addsudo`
- Bot's own number (when `fromMe` is true in groups)

`isSudo` is `true` when `isOwner` is true OR the sender is in the session's sudo list.

> **LID accounts:** The bot resolves WhatsApp LID JIDs to phone numbers using `lidPhoneCache` populated from group participant metadata, so permissions work correctly even for accounts using the newer LID format.

### Sudo System

Sudo users (added via `.addsudo`) receive:
- Access to all `owner` category commands
- No-prefix command access (when `OWNER_NO_PREFIX=true`)
- Exempt from cooldowns
- Exempt from ban/mute checks
- `isGroupAdmin` is forced to `true` for permission checks

---

## Execute Context Object

The `execute` function receives a single destructured object:

| Parameter | Type | Description |
|-----------|------|-------------|
| `sock` | object | WhatsApp socket — wrapped in `fontSock` proxy that applies the user's font to all `sendMessage` calls automatically |
| `message` | object | Full Baileys message object |
| `args` | array | Command arguments (text after command name, split by whitespace) |
| `from` | string | Chat JID (group or private) |
| `sender` | string | Resolved sender JID (`<phone>@s.whatsapp.net`) |
| `isGroup` | boolean | `true` if message is from a group |
| `isGroupAdmin` | boolean | `true` if sender is a group admin (or owner/sudo) |
| `isBotAdmin` | boolean | `true` if bot has admin rights in the group |
| `isOwner` | boolean | `true` if sender is a registered owner |
| `isSudo` | boolean | `true` if sender is owner or has sudo rights |
| `prefix` | string | Active prefix for this session (may differ from config default) |
| `pushName` | string | Sender's WhatsApp display name |
| `quoted` | object | Quoted message content (if the user replied to a message) |
| `command` | string | The command name that was invoked |
| `user` | object | User database object (if DB is connected; may be null) |
| `group` | object | Group database object (if DB is connected; may be null) |

> **Font Sock:** `sock` is actually a Proxy created by `createFontSock`. Any call to `sock.sendMessage(jid, content, options)` automatically transforms text content using the sender's chosen font style. You do not need to call `applyFont` manually.

---

## Template Examples

### General Command Template

For basic commands without special permissions:

```javascript
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'example',
    aliases: ['ex', 'sample'],
    category: 'general',
    description: 'Example command description',
    usage: 'example <text>',
    example: 'example hello world',
    cooldown: 3,
    permissions: ['user'],
    minArgs: 1,

    async execute({ sock, message, args, from, sender, pushName }) {
        try {
            const text = args.join(' ');

            if (!text) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('NO INPUT',
                        'Please provide some text',
                        'Usage: example <your text here>')
                }, { quoted: message });
            }

            const response = `╭──⦿【 ✨ EXAMPLE RESULT 】
│
│ 📝 𝗜𝗻𝗽𝘂𝘁: ${text}
│ 👤 𝗨𝘀𝗲𝗿: @${sender.split('@')[0]}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│ ⏰ 𝗧𝗶𝗺𝗲: ${new Date().toLocaleTimeString()}
│
╰────────────⦿`;

            await sock.sendMessage(from, {
                text: response,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('EXECUTION FAILED',
                    'An error occurred while executing the command',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### Admin Command Template

For group administration commands with mention/reply support:

```javascript
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'admincommand',
    aliases: ['admincmd'],
    category: 'admin',
    description: 'Description of admin command',
    usage: 'admincommand @user OR reply to message',
    example: 'admincommand @user',
    cooldown: 3,
    permissions: ['admin'],
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,

    async execute({ sock, message, args, from, sender, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) {
            return sock.sendMessage(from, {
                text: formatResponse.error('GROUP ONLY',
                    'This command can only be used in groups')
            }, { quoted: message });
        }

        if (!isGroupAdmin) {
            return sock.sendMessage(from, {
                text: formatResponse.error('ADMIN ONLY',
                    'You need to be a group admin to use this command')
            }, { quoted: message });
        }

        if (!isBotAdmin) {
            return sock.sendMessage(from, {
                text: formatResponse.error('BOT NOT ADMIN',
                    'I need admin privileges to execute this command',
                    'Make me an admin first')
            }, { quoted: message });
        }

        try {
            const quotedUser = message.message?.extendedTextMessage?.contextInfo?.participant;
            const mentionedUsers = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

            let targetJid;
            if (quotedUser) {
                targetJid = quotedUser;
            } else if (mentionedUsers.length > 0) {
                targetJid = mentionedUsers[0];
            } else {
                return sock.sendMessage(from, {
                    text: formatResponse.error('NO TARGET',
                        'Reply to a message or mention a user',
                        'Usage: admincommand @user OR reply to message')
                }, { quoted: message });
            }

            if (targetJid === sender) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID TARGET',
                        'You cannot target yourself')
                }, { quoted: message });
            }

            const targetNumber = targetJid.split('@')[0];

            await sock.sendMessage(from, {
                text: `╭──⦿【 ✅ ACTION COMPLETED 】
│
│ 👤 𝗧𝗮𝗿𝗴𝗲𝘁: @${targetNumber}
│ 👮 𝗕𝘆: @${sender.split('@')[0]}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│ ⏰ 𝗧𝗶𝗺𝗲: ${new Date().toLocaleTimeString()}
│
╰────────────⦿`,
                mentions: [targetJid, sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('ACTION FAILED',
                    'Failed to execute admin action',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### Owner Command Template

For bot owner exclusive commands (also accessible by sudo users):

```javascript
import config from '../../config.js';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'ownercommand',
    aliases: ['ownercmd'],
    category: 'owner',
    description: 'Description of owner command',
    usage: 'ownercommand <action> [args]',
    example: 'ownercommand action value',
    cooldown: 0,
    permissions: ['owner'],
    ownerOnly: true,

    async execute({ sock, message, args, from, sender, isOwner, isSudo, prefix }) {
        try {
            const action = args[0]?.toLowerCase();
            const value = args.slice(1).join(' ');

            if (!action) {
                return sock.sendMessage(from, {
                    text: `❌ *Invalid Action*

Available actions:
• action1 - Description of action1
• action2 - Description of action2

*Usage:*
• ${prefix}ownercommand action1
• ${prefix}ownercommand action2 value

*Your Status:* ${isOwner ? 'Owner' : isSudo ? 'Sudo Admin' : 'User'}`
                }, { quoted: message });
            }

            switch (action) {
                case 'action1':
                    break;
                case 'action2':
                    if (!value) {
                        return sock.sendMessage(from, {
                            text: formatResponse.error('MISSING VALUE',
                                'Please provide a value for this action',
                                `Usage: ${prefix}ownercommand action2 <value>`)
                        }, { quoted: message });
                    }
                    break;
                default:
                    return sock.sendMessage(from, {
                        text: formatResponse.error('UNKNOWN ACTION',
                            `Action "${action}" not recognized`,
                            'Use the command without arguments to see available actions')
                    }, { quoted: message });
            }

            await sock.sendMessage(from, {
                text: `✅ *Action Completed*\n\n*Action:* ${action}\n*Value:* ${value || 'None'}\n*Executed by:* @${sender.split('@')[0]} (${isOwner ? 'Owner' : 'Sudo Admin'})\n*Date:* ${new Date().toLocaleString()}`,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('EXECUTION ERROR',
                    'Failed to execute owner command',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### Economy Command Template

For economy system commands with database interaction:

```javascript
import { getUser, updateUser } from '../../models/User.js';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'economycommand',
    aliases: ['ecocmd'],
    category: 'economy',
    description: 'Description of economy command',
    usage: 'economycommand [amount]',
    example: 'economycommand 100',
    cooldown: 5,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, user }) {
        try {
            const amount = parseInt(args[0]) || 0;

            if (isNaN(amount) || amount < 1) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID AMOUNT',
                        'Please specify a valid amount greater than 0',
                        'Usage: economycommand <amount>')
                }, { quoted: message });
            }

            if (amount > 1000000) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('AMOUNT TOO LARGE',
                        'Maximum amount is $1,000,000',
                        'Please use a smaller amount')
                }, { quoted: message });
            }

            const currentBalance = user?.economy?.balance || 0;
            if (currentBalance < amount) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INSUFFICIENT FUNDS',
                        `You need $${amount.toLocaleString()} but only have $${currentBalance.toLocaleString()}`,
                        'Earn more money with daily, work, or gamble commands')
                }, { quoted: message });
            }

            await updateUser(sender, {
                $inc: {
                    'economy.balance': -amount,
                    'statistics.commandsUsed': 1
                }
            });

            const newBalance = currentBalance - amount;

            await sock.sendMessage(from, {
                text: `╭──⦿【 💰 TRANSACTION 】
│
│ 👤 𝗨𝘀𝗲𝗿: @${sender.split('@')[0]}
│ 💵 𝗔𝗺𝗼𝘂𝗻𝘁: $${amount.toLocaleString()}
│ 💳 𝗣𝗿𝗲𝘃𝗶𝗼𝘂𝘀: $${currentBalance.toLocaleString()}
│ 💰 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${newBalance.toLocaleString()}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│
╰────────────⦿`,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('TRANSACTION FAILED',
                    'An error occurred during the transaction',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### Game Command Template

For interactive game commands that use reply handlers:

```javascript
import { getUser, updateUser } from '../../models/User.js';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'gamecommand',
    aliases: ['game'],
    category: 'games',
    description: 'Description of game command',
    usage: 'gamecommand [difficulty]',
    example: 'gamecommand easy',
    cooldown: 10,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, user }) {
        try {
            const difficulty = args[0]?.toLowerCase() || 'normal';
            const validDifficulties = ['easy', 'normal', 'hard'];

            if (!validDifficulties.includes(difficulty)) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID DIFFICULTY',
                        'Choose a valid difficulty level',
                        'Available: easy, normal, hard')
                }, { quoted: message });
            }

            const rewards = {
                easy: { xp: 50, money: 25 },
                normal: { xp: 100, money: 50 },
                hard: { xp: 200, money: 100 }
            };

            const reward = rewards[difficulty];
            const answer = Math.floor(Math.random() * 100) + 1;

            const sent = await sock.sendMessage(from, {
                text: `╭──⦿【 🎮 GAME STARTED 】
│
│ 🎯 𝗚𝗮𝗺𝗲: Number Guessing Game
│ 👤 𝗣𝗹𝗮𝘆𝗲𝗿: @${sender.split('@')[0]}
│ ⚡ 𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆: ${difficulty.toUpperCase()}
│ 🏆 𝗥𝗲𝘄𝗮𝗿𝗱: ${reward.xp} XP + $${reward.money}
│
│ 📝 Guess a number between 1 and 100!
│ Reply to this message with your guess.
│
╰────────────⦿`,
                mentions: [sender]
            }, { quoted: message });

            if (!global.replyHandlers) global.replyHandlers = {};

            global.replyHandlers[sent.key.id] = {
                command: 'gamecommand',
                handler: async (replyText, replyMessage) => {
                    const guess = parseInt(replyText.trim());
                    if (isNaN(guess)) return;

                    delete global.replyHandlers[sent.key.id];

                    const correct = guess === answer;
                    const resultText = correct
                        ? `✅ Correct! The answer was ${answer}. You earned ${reward.xp} XP and $${reward.money}!`
                        : `❌ Wrong! The answer was ${answer}. Better luck next time!`;

                    if (correct) {
                        await updateUser(sender, {
                            $inc: {
                                'economy.balance': reward.money,
                                'economy.xp': reward.xp,
                                'gameStats.gamesWon': 1
                            }
                        });
                    }

                    await sock.sendMessage(from, {
                        text: resultText,
                        mentions: [sender]
                    }, { quoted: replyMessage });
                }
            };

            await updateUser(sender, {
                $inc: {
                    'gameStats.gamesPlayed': 1,
                    'statistics.commandsUsed': 1
                }
            });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('GAME ERROR',
                    'Failed to start the game',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### AI Command Template

For AI-powered commands:

```javascript
import axios from 'axios';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'aicommand',
    aliases: ['ask'],
    category: 'ai',
    description: 'Chat with AI assistant',
    usage: 'aicommand <your question>',
    example: 'aicommand What is the capital of France?',
    cooldown: 5,
    permissions: ['user'],
    minArgs: 1,
    args: true,

    async execute({ sock, message, args, from, sender }) {
        try {
            const question = args.join(' ');

            if (question.length > 500) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('QUESTION TOO LONG',
                        'Please keep your question under 500 characters',
                        `Current length: ${question.length}`)
                }, { quoted: message });
            }

            await sock.sendMessage(from, {
                text: '🤖 *Processing your request...*\n\nPlease wait while I think about this.'
            }, { quoted: message });

            const response = await axios.post('API_ENDPOINT', {
                prompt: question,
                user: sender
            }, { timeout: 30000 });

            const aiReply = response.data?.answer || 'No response generated';

            await sock.sendMessage(from, {
                text: `╭──⦿【 🤖 AI RESPONSE 】
│
│ 💭 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${question.substring(0, 100)}${question.length > 100 ? '...' : ''}
│
│ 🎯 𝗔𝗻𝘀𝘄𝗲𝗿:
│ ${aiReply}
│
│ 👤 𝗨𝘀𝗲𝗿: @${sender.split('@')[0]}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│
╰────────────⦿`,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('AI ERROR',
                    'Failed to get AI response',
                    error.message || 'API might be unavailable')
            }, { quoted: message });
        }
    }
};
```

---

### Media Command Template

For commands that process images, videos, or audio:

```javascript
import fs from 'fs-extra';
import path from 'path';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'mediacommand',
    aliases: ['media'],
    category: 'media',
    description: 'Process media files',
    usage: 'mediacommand (reply to image/video)',
    example: 'Reply to image and type: mediacommand',
    cooldown: 10,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender }) {
        try {
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quotedMessage) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('NO MEDIA',
                        'Please reply to an image or video',
                        'Usage: Reply to media and type: mediacommand')
                }, { quoted: message });
            }

            const messageType = Object.keys(quotedMessage)[0];
            const validTypes = ['imageMessage', 'videoMessage', 'audioMessage'];

            if (!validTypes.includes(messageType)) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID MEDIA',
                        'Please reply to an image, video, or audio file',
                        `Detected type: ${messageType}`)
                }, { quoted: message });
            }

            await sock.sendMessage(from, {
                text: '⏳ *Processing media...*\n\nPlease wait while I process your file.'
            }, { quoted: message });

            const buffer = await downloadMediaMessage(
                { message: quotedMessage },
                'buffer',
                {}
            );

            if (!buffer) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('DOWNLOAD FAILED',
                        'Failed to download media file')
                }, { quoted: message });
            }

            const tempDir = path.join(process.cwd(), 'temp');
            await fs.ensureDir(tempDir);
            const ext = messageType === 'imageMessage' ? 'jpg' : messageType === 'audioMessage' ? 'mp3' : 'mp4';
            const tempFile = path.join(tempDir, `media_${Date.now()}.${ext}`);
            await fs.writeFile(tempFile, buffer);

            await sock.sendMessage(from, {
                text: `╭──⦿【 ✅ MEDIA PROCESSED 】
│
│ 📁 𝗧𝘆𝗽𝗲: ${messageType.replace('Message', '')}
│ 📊 𝗦𝗶𝘇𝗲: ${(buffer.length / 1024).toFixed(2)} KB
│ 👤 𝗨𝘀𝗲𝗿: @${sender.split('@')[0]}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│
╰────────────⦿`,
                mentions: [sender]
            }, { quoted: message });

            await fs.remove(tempFile);

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('PROCESSING FAILED',
                    'Failed to process media file',
                    error.message)
            }, { quoted: message });
        }
    }
};
```

---

### Downloader Command Template

For commands that download content from external sources:

```javascript
import axios from 'axios';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'downloadcommand',
    aliases: ['dl', 'download'],
    category: 'downloader',
    description: 'Download content from URL',
    usage: 'downloadcommand <url> [quality]',
    example: 'downloadcommand https://example.com/video hd',
    cooldown: 15,
    permissions: ['user'],
    minArgs: 1,

    async execute({ sock, message, args, from, sender }) {
        try {
            const url = args[0];
            const quality = args[1]?.toLowerCase() || 'sd';

            if (!url) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('NO URL',
                        'Please provide a URL to download',
                        'Usage: downloadcommand <url> [quality]')
                }, { quoted: message });
            }

            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(url)) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID URL',
                        'Please provide a valid URL starting with http:// or https://',
                        'Example: https://example.com/video')
                }, { quoted: message });
            }

            const validQualities = ['sd', 'hd', '4k'];
            if (!validQualities.includes(quality)) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('INVALID QUALITY',
                        'Choose a valid quality option',
                        'Available: sd, hd, 4k')
                }, { quoted: message });
            }

            await sock.sendMessage(from, {
                text: `⏳ *Downloading...*\n\n📥 URL: ${url}\n📺 Quality: ${quality.toUpperCase()}\n\nPlease wait, this may take a few moments.`
            }, { quoted: message });

            const response = await axios.get('DOWNLOAD_API_ENDPOINT', {
                params: { url, quality },
                timeout: 60000
            });

            if (!response.data?.downloadUrl) {
                return sock.sendMessage(from, {
                    text: formatResponse.error('DOWNLOAD FAILED',
                        'Could not download content from this URL',
                        'The URL might be invalid or unsupported')
                }, { quoted: message });
            }

            const caption = `╭──⦿【 ✅ DOWNLOAD COMPLETE 】
│
│ 📥 𝗨𝗥𝗟: ${url.substring(0, 50)}...
│ 📺 𝗤𝘂𝗮𝗹𝗶𝘁𝘆: ${quality.toUpperCase()}
│ 👤 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: @${sender.split('@')[0]}
│ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleDateString()}
│
╰────────────⦿`;

            await sock.sendMessage(from, {
                video: { url: response.data.downloadUrl },
                caption,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('DOWNLOAD ERROR',
                    'Failed to download content',
                    error.message || 'Service might be unavailable')
            }, { quoted: message });
        }
    }
};
```

---

### Canvas Command Template

For commands that generate images using `@napi-rs/canvas`:

```javascript
import { createCanvas, loadImage } from '@napi-rs/canvas';
import formatResponse from '../../utils/formatUtils.js';

export default {
    name: 'canvascommand',
    aliases: ['card'],
    category: 'general',
    description: 'Generate a visual card',
    usage: 'canvascommand [text]',
    example: 'canvascommand Hello World',
    cooldown: 5,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender }) {
        try {
            const text = args.join(' ') || 'Hello World';
            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.roundRect(ctx, 40, 40, canvas.width - 80, canvas.height - 80, 20);
            ctx.fill();

            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText(text.substring(0, 30), canvas.width / 2, canvas.height / 2);
            ctx.shadowBlur = 0;

            ctx.font = '24px Arial';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(`@${sender.split('@')[0]}`, canvas.width / 2, canvas.height / 2 + 60);

            const buffer = canvas.toBuffer('image/png');

            await sock.sendMessage(from, {
                image: buffer,
                caption: `🎨 Card generated for @${sender.split('@')[0]}`,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: formatResponse.error('CANVAS ERROR',
                    'Failed to generate image',
                    error.message)
            }, { quoted: message });
        }
    },

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
};
```

---

### No-Prefix Command Template

For commands that work without the bot prefix (useful for AI chatbots or triggers):

```javascript
export default {
    name: 'mynoprefix',
    aliases: [],
    category: 'general',
    description: 'A command that works without a prefix',
    usage: 'mynoprefix <text>',
    cooldown: 3,
    permissions: ['user'],
    noPrefix: true,

    async execute({ sock, message, args, from, sender }) {
        try {
            const text = args.join(' ');

            await sock.sendMessage(from, {
                text: `You said: ${text}`,
                mentions: [sender]
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}`
            }, { quoted: message });
        }
    }
};
```

> **How no-prefix commands work:** `messageHandler.js` checks for no-prefix commands in a separate pass before the prefix check. If the message doesn't start with the active prefix, all commands with `noPrefix: true` are checked by name. When `OWNER_NO_PREFIX=true` and the sender is owner/sudo, any unknown word in a non-prefixed message falls through to the `ilom` AI command.

---

## Font System Integration

The `sock` object passed to your command's `execute` function is a **proxy** (`fontSock`) that transparently applies the user's chosen font to all text sent via `sock.sendMessage`. You don't need to call `applyFont` yourself.

**Supported text keys transformed automatically:** `text`, `caption`, `contextInfo.externalAdReply.title`, `contextInfo.externalAdReply.body`

**Keys NOT transformed** (binary/action payloads): `image`, `video`, `audio`, `sticker`, `document`, `react`, `delete`, `forward`, `poll`, `location`, `contact`

**To manually apply font in other contexts:**

```javascript
import { applyFont, resolveFont } from '../../utils/fontManager.js';
import { getUserFont, getGlobalFont } from '../../utils/fontStorage.js';

const globalFont = await getGlobalFont();
const userFont = globalFont !== 'normal' ? globalFont : await getUserFont(sender);
const styledText = applyFont('Hello World', userFont);
```

**To invalidate the font cache for a sender** (e.g., right after `.setfont` changes the setting):

```javascript
sock._invalidateFontCache?.();
```

---

## Reply & Chat Handlers

### Reply Handlers

Reply handlers are triggered when a user replies to a specific bot message:

```javascript
const sent = await sock.sendMessage(from, { text: 'Enter your answer:' }, { quoted: message });

if (!global.replyHandlers) global.replyHandlers = {};

global.replyHandlers[sent.key.id] = {
    command: 'mycommand',
    handler: async (replyText, replyMessage) => {
        delete global.replyHandlers[sent.key.id];
        await sock.sendMessage(from, { text: `You answered: ${replyText}` }, { quoted: replyMessage });
    }
};
```

> **How it works:** `messageHandler.js` calls `resolveStanzaId(message)` to extract the `stanzaId` of the quoted message, then looks up `global.replyHandlers[stanzaId]`. The handler is only called when the original sender replies.

### Chat Handlers

Chat handlers capture all subsequent non-prefixed messages in a specific chat:

```javascript
import { registerChatHandler, clearChatHandler } from '../../handlers/messageHandler.js';

await sock.sendMessage(from, { text: 'Type anything to continue:' }, { quoted: message });

registerChatHandler(from, {
    command: 'mycommand',
    handler: async (text, incomingMessage) => {
        clearChatHandler(from);
        await sock.sendMessage(from, { text: `You said: ${text}` }, { quoted: incomingMessage });
    }
}, 5 * 60 * 1000);
```

---

## 🎯 Best Practices

### 1. Error Handling
Always wrap command logic in try-catch blocks and provide meaningful error messages using `formatResponse.error()`.

### 2. Input Validation
Validate all user inputs before processing:
- Check if required arguments are provided (`minArgs`)
- Validate data types (numbers, URLs, etc.)
- Sanitize user input
- Set reasonable limits on input length and amount values

### 3. User Mentions
When mentioning users in responses, always include them in the `mentions` array:
```javascript
mentions: [sender, targetJid]
```

### 4. Quoted Messages
Always quote the original message for context:
```javascript
{ quoted: message }
```

### 5. Reply and Mention Handling
Support both reply-to-message and mention methods for admin commands:
```javascript
const quotedUser = message.message?.extendedTextMessage?.contextInfo?.participant;
const mentionedUsers = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

let targetJid;
if (quotedUser) {
    targetJid = quotedUser;
} else if (mentionedUsers.length > 0) {
    targetJid = mentionedUsers[0];
}
```

### 6. Consistent Formatting
Use the standardized box format for all responses:
```
╭──⦿【 TITLE 】
│
│ Field: Value
│ Field: Value
│
╰────────────⦿
```

### 7. Database Fallback Awareness
`user` and `group` context objects may be `null` when the database is unavailable (development mode or no MongoDB URL). Always use optional chaining:
```javascript
const balance = user?.economy?.balance || 0;
```

### 8. Number Formatting
Format large numbers for readability:
```javascript
amount.toLocaleString()
```

### 9. Permission Checks Order
For admin commands, verify all required permissions in order:
1. `isGroup` — Command is used in a group
2. `isGroupAdmin` — User is a group admin (or owner/sudo)
3. `isBotAdmin` — Bot has admin privileges

### 10. Canvas Error Fallback
Always provide a text fallback when canvas image generation fails:
```javascript
try {
    const buffer = canvas.toBuffer('image/png');
    await sock.sendMessage(from, { image: buffer, caption: text }, { quoted: message });
} catch (canvasError) {
    await sock.sendMessage(from, { text: fallbackText }, { quoted: message });
}
```

### 11. Self-Targeting Prevention
Prevent users from targeting themselves in admin actions:
```javascript
if (targetJid === sender) {
    return sock.sendMessage(from, {
        text: formatResponse.error('INVALID TARGET', 'You cannot target yourself')
    }, { quoted: message });
}
```

### 12. Reply Handler Cleanup
Always delete reply handlers after they fire to prevent memory leaks:
```javascript
delete global.replyHandlers[sent.key.id];
```

### 13. Temp File Cleanup
Always clean up temporary files after processing:
```javascript
await fs.remove(tempFile);
```

### 14. No Code Comments
Do not add comments to command code. The code should be self-explanatory with clear variable names and structure.

### 15. External Aliases
If your command should respond to many common aliases (e.g. `.fb` → your downloader), add them to `src/utils/axisAliasMap.js` rather than the command's `aliases` array. This keeps the command file clean and centralizes alias management.

---

## 📦 Required Imports

### Common Imports
```javascript
import formatResponse from '../../utils/formatUtils.js';
```

### For Database Commands
```javascript
import { getUser, updateUser, createUser, getAllUsers } from '../../models/User.js';
import { getGroup, updateGroup } from '../../models/Group.js';
```

### For Owner Commands
```javascript
import config from '../../config.js';
```

### For Canvas Commands
```javascript
import { createCanvas, loadImage } from '@napi-rs/canvas';
```

### For Media Commands
```javascript
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';
```

### For API/Download Commands
```javascript
import axios from 'axios';
```

### For Font Utilities (rarely needed — sock proxy handles it)
```javascript
import { applyFont, resolveFont } from '../../utils/fontManager.js';
import { getUserFont, getGlobalFont, setUserFont } from '../../utils/fontStorage.js';
```

### For Session Control (owner commands that change prefix/mode)
```javascript
import { getSessionControl, updateSessionControl } from '../../utils/sessionControl.js';
```

### For Reply/Chat Handlers
```javascript
import { registerChatHandler, clearChatHandler } from '../../handlers/messageHandler.js';
```

---

## Reference Tables

### ✅ Command Properties Reference

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | string | ✅ | — | Command name (lowercase, no spaces) |
| `aliases` | array | ❌ | `[]` | Alternative names for the command |
| `category` | string | ✅ | — | Category subfolder name |
| `description` | string | ✅ | — | Brief description |
| `usage` | string | ✅ | — | Usage with parameters |
| `example` | string | ❌ | — | Example usage with real values |
| `cooldown` | number | ❌ | `0` | Cooldown in seconds (bypassed for owner/sudo) |
| `permissions` | array | ❌ | `['user']` | Required permissions |
| `ownerOnly` | boolean | ❌ | `false` | Owner/sudo only |
| `sudoOnly` | boolean | ❌ | `false` | Sudo only (owner also qualifies) |
| `adminOnly` | boolean | ❌ | `false` | Group admin only |
| `groupOnly` | boolean | ❌ | `false` | Group only |
| `privateOnly` | boolean | ❌ | `false` | Private chat only |
| `botAdminRequired` | boolean | ❌ | `false` | Bot needs admin rights |
| `minArgs` | number | ❌ | `0` | Minimum arguments required |
| `maxArgs` | number | ❌ | `0` | Maximum arguments allowed |
| `args` | boolean | ❌ | `false` | If `true`, enforces `minArgs` check |
| `typing` | boolean | ❌ | `false` | Show typing indicator |
| `noPrefix` | boolean | ❌ | `false` | Command works without prefix |
| `execute` | function | ✅ | — | Main command execution function |

---

### 🔧 Execute Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sock` | object | Font-proxied WhatsApp socket |
| `message` | object | Full Baileys message object |
| `args` | array | Space-split arguments after command name |
| `from` | string | Chat/Group JID |
| `sender` | string | Resolved sender JID (`phone@s.whatsapp.net`) |
| `isGroup` | boolean | True if message is from a group |
| `isGroupAdmin` | boolean | True if sender is group admin or owner/sudo |
| `isBotAdmin` | boolean | True if bot has admin privileges in group |
| `isOwner` | boolean | True if sender is a registered owner |
| `isSudo` | boolean | True if sender is owner or sudo user |
| `prefix` | string | Active prefix for this session |
| `pushName` | string | Sender's WhatsApp display name |
| `quoted` | object | Quoted message object (may be undefined) |
| `user` | object | User DB object (may be null without DB) |
| `group` | object | Group DB object (may be null without DB) |
| `command` | string | Command name that was invoked |

---

### 🎨 formatResponse Utility Reference

```javascript
import formatResponse from '../../utils/formatUtils.js';

formatResponse.error(
    'ERROR TITLE',
    'Main error description',
    'Additional helpful information or suggestion'
);

formatResponse.info(
    'INFO TITLE',
    ['Info line 1', 'Info line 2', 'Info line 3']
);

formatResponse.success(
    'SUCCESS TITLE',
    'Success message description'
);

formatResponse.list(
    'LIST TITLE',
    ['item 1', 'item 2', 'item 3'],
    '✧'
);

await formatResponse.getRandomImage();
```

---

### 📝 Message Type Detection

Common message types to check in quoted messages:
```javascript
const messageType = Object.keys(quotedMessage)[0];

const validTypes = {
    text: ['conversation', 'extendedTextMessage'],
    image: 'imageMessage',
    video: 'videoMessage',
    audio: 'audioMessage',
    document: 'documentMessage',
    sticker: 'stickerMessage',
    viewOnce: ['viewOnceMessage', 'viewOnceMessageV2'],
    ephemeral: 'ephemeralMessage'
};
```

---

### 🖋️ Available Font Names

| Font Name | Alias | Preview |
|-----------|-------|---------|
| `normal` | `n`, `off`, `reset` | Normal text |
| `bold` | `b` | 𝗕𝗼𝗹𝗱 𝘁𝗲𝘅𝘁 |
| `italic` | `i` | 𝘐𝘵𝘢𝘭𝘪𝘤 𝘵𝘦𝘹𝘵 |
| `bolditalic` | `bi` | 𝙱𝚘𝚕𝚍 𝙸𝚝𝚊𝚕𝚒𝚌 |
| `script` | `s` | 𝒮𝒸𝓇𝒾𝓅𝓉 |
| `boldscript` | `bs` | 𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽 |
| `fraktur` | `f` | 𝔉𝔯𝔞𝔨𝔱𝔲𝔯 |
| `boldfraktur` | `bf` | 𝖇𝖔𝖑𝖉𝖋𝖗𝖆𝖐𝖙𝖚𝖗 |
| `doublestruck` | `ds` | 𝕕𝕠𝕦𝕓𝕝𝕖𝕤𝕥𝕣𝕦𝕔𝕜 |
| `sans` | `ss` | 𝗌𝖺𝗇𝗌 |
| `sansbold` | `sb` | 𝘀𝗮𝗻𝘀𝗯𝗼𝗹𝗱 |
| `sansitalic` | `si` | 𝘴𝘢𝘯𝘴𝘪𝘵𝘢𝘭𝘪𝘤 |
| `sansbolditalic` | `sbi` | 𝙨𝙖𝙣𝙨𝙗𝙤𝙡𝙙𝙞𝙩𝙖𝙡𝙞𝙘 |
| `monospace` | `m`, `mono` | 𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 |
| `smallcaps` | `sc`, `caps` | ꜱᴍᴀʟʟᴄᴀᴘꜱ |
| `circled` | `c` | ⓒⓘⓡⓒⓛⓔⓓ |
| `fullwidth` | `fw`, `wide` | ｆｕｌｌｗｉｄｔｈ |

---

## 🚀 Testing Your Command

### Pre-Deployment Checklist

1. ✅ Place command file in the appropriate category folder under `src/commands/`
2. ✅ Restart the bot — commands are loaded automatically on startup
3. ✅ Test success scenario with valid inputs
4. ✅ Test all error scenarios (invalid input, missing args, etc.)
5. ✅ Verify permission checks work correctly
6. ✅ Test cooldown functionality
7. ✅ Verify database operations handle `null` user/group gracefully
8. ✅ Check response formatting and mentions
9. ✅ Test with both mentions and reply-to-message (for admin commands)
10. ✅ Verify resource cleanup (temp files, reply handlers)
11. ✅ Test in both group and private chat (if applicable)
12. ✅ Verify bot admin requirements (if applicable)
13. ✅ Test with a user who has a custom font set (text should auto-transform)
14. ✅ Verify the command appears in `.help` and `.menu`

---

## 📂 File Structure

```
src/commands/
├── admin/
│   ├── ban.js          (ban/unban/banlist)
│   ├── antilink.js     (antilink on/off)
│   ├── antispam.js     (antispam/antibot)
│   ├── antiword.js     (antiword/antibadword)
│   ├── kick.js
│   ├── mute.js / unmute.js
│   ├── promote.js / demote.js
│   ├── warn.js / unwarn.js / resetwarn.js
│   ├── tagall.js / hidetag.js
│   ├── setdesc.js / setname.js
│   └── groupinfo.js
├── owner/
│   ├── sudo.js         (addsudo/removesudo/listsudo)
│   ├── eval.js
│   ├── broadcast.js
│   ├── whitelist.js
│   └── selfmode.js
├── general/
│   ├── help.js / help2.js / menu.js
│   ├── ping.js / status.js / uptime.js / up2.js
│   ├── about.js / info.js / owner.js
│   ├── rank.js / levelup.js / stats.js
│   ├── calc.js / search.js / news.js
│   ├── setfont.js      (16 Unicode font styles)
│   ├── prefix.js       (view/change active prefix)
│   ├── callad.js       (contact owner)
│   └── getbot.js       (Telegram pairing bot info)
├── economy/
│   ├── daily.js / weekly.js / work.js
│   ├── balance.js / bank.js / transfer.js
│   ├── gamble.js / rob.js
│   └── shop.js / buy.js / inventory.js
├── games/
│   ├── trivia.js / hangman.js / blackjack.js
│   ├── dice.js / coinflip.js / 8ball.js
│   └── math.js / word.js / memory.js
├── ai/
│   ├── ai.js           (unified AI command — all model aliases route here)
│   ├── imagine.js
│   ├── stt.js / tts.js / ocr.js
│   └── translate.js
├── media/
│   ├── sticker.js      (alias: s, wm, tosticker)
│   ├── autolink.js     (universal URL downloader — alias: fb, ig, tiktok, etc.)
│   ├── toaudio.js / toimg.js / tovideo.js
│   └── filter.js / compress.js / watermark.js
└── downloader/
    ├── ytdl.js         (alias: ytmp3, ytmp4 → play/ytb)
    ├── play.js         (alias: ytmp3, sp → song)
    ├── song.js         (alias: spotify, spotifydl)
    └── ytb.js          (alias: ytmp4, ytsearch, yts)
```

---

*Template Guide for Amazing Bot v1.0.0*
*Last Updated: May 2026*
*Follow these templates to maintain code quality and consistency across all commands*
