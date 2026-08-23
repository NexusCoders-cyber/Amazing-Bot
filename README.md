<div align="center">

# ✨ 🧠 ILOM Bot v2 🧠 ✨

<img src="./attached_assets/stock_images/modern_technology_bo_69a427db.jpg" alt="ILOM Bot v2 Banner" width="100%" style="border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); margin: 30px 0;">

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=32&pause=1000&color=667EEA&center=true&vCenter=true&width=1000&height=80&lines=Welcome+to+ILOM+Bot+v2!+%F0%9F%8E%89;GoatBot-V2-Inspired+Architecture+%F0%9F%A4%96;62%2B+Working+Commands+%E2%9A%A1;Economy%2C+Games%2C+AI+%26+Admin+Tools+%F0%9F%9A%80;Built+with+%E2%9D%A4%EF%B8%8F+by+Raphael+Ilom" alt="Typing SVG" />
</p>

### 💫 *A WhatsApp Bot Built on Baileys, Structured Like GoatBot V2* 💫

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20+-339933.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-4285F4.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Version-2.0.0-FF6B6B.svg?style=for-the-badge&logo=v&logoColor=white" alt="Version"></a>
  <a href="https://github.com/NexusCoders-cyber/Amazing-Bot"><img src="https://img.shields.io/github/stars/NexusCoders-cyber/Amazing-Bot?style=for-the-badge&logo=github&color=yellow" alt="Stars"></a>
</p>

<h3>🎯 Built with ❤️ by <a href="https://ilom.tech">Raphael Ilom</a></h3>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=ILOM%20Bot%20v2&fontSize=42&fontAlignY=30&animation=twinkling&fontColor=fff" width="100%"/>
</p>

> 🧠 **A multi-device WhatsApp bot** built on [Baileys](https://github.com/WhiskeySockets/Baileys), with a command system, lifecycle, and folder structure inspired by [GoatBot V2](https://github.com/ntkhang03/Goat-Bot-V2) by NTKhang03. Includes an economy system, admin/moderation tools, games, AI chat, media downloaders, and a hot-reloadable command manager.

<p align="center">
  <a href="#-getting-started">🚀 Getting Started</a> •
  <a href="#-pairing-your-whatsapp-account">📱 Pairing</a> •
  <a href="#-configuration">⚙️ Configuration</a> •
  <a href="#-commands">📖 Commands</a> •
  <a href="#-adding-your-own-commands">🛠️ Add Commands</a> •
  <a href="#-troubleshooting">🔧 Troubleshooting</a>
</p>

</div>

---

## 🌟 What This Project Is

<img src="./attached_assets/stock_images/whatsapp_messaging_c_4b3b734a.jpg" alt="WhatsApp Bot Features" width="100%" style="border-radius: 15px; margin: 20px 0;">

This is a rewrite of the original ILOM Bot, restructured to follow the **GoatBot V2** command lifecycle:

- Every command is a single file with a `config` object (`name`, `aliases`, `category`, `role`, `coolDown`, `guide`) and lifecycle hooks: `onStart`, `onChat`, `onReply`, `onReaction`.
- Commands live in `scripts/cmds/` (add your own here — no registration step needed, just drop the file in).
- Event scripts (auto-welcome, etc.) live in `scripts/events/`.
- A global `AmazingBot` namespace tracks `onReply`/`onReaction`/`onChat` handlers across commands, the same way GoatBot V2's `global.GoatBot` does.
- `usersData` / `threadsData` give every command simple, promise-based access to persisted user and group data.

### Key characteristics

- 🔧 **62 commands** across 10 categories (admin, economy, general, owner, downloader, ai, fun, games, media, utility) — see the [full command list](#-commands) below.
- 💰 **Full economy system** — wallet/bank, daily/weekly rewards, work, fishing, hunting, mining, gambling (coinflip/dice/slot), a shop, and a leaderboard.
- 🛡️ **Moderation tools** — antilink, antispam, antiword, antisticker, warnings with auto-kick, welcome/goodbye messages, whitelist mode.
- 🤖 **AI chat** — OpenAI if you provide a key, with a free fallback provider if you don't.
- 📥 **Media** — YouTube audio (`play`) and video (`video`) downloads, sticker creation from images/video.
- 👑 **Owner tools** — `eval` and `shell` for live debugging, `cmd` for creating/editing/reloading commands from inside WhatsApp itself, `broadcast`, `mode` (public/private), `prefix`.
- 🔐 **Three ways to pair** — scan a QR code, use the bundled Telegram pairing bot, or request a pairing code directly from a web endpoint. See [Pairing](#-pairing-your-whatsapp-account).

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20+**
- npm (comes with Node)
- A WhatsApp account to link (a second number is recommended, not your primary one)

### Install

```bash
git clone https://github.com/NexusCoders-cyber/Amazing-Bot.git
cd Amazing-Bot
npm install
cp .env.example .env
```

Open `.env` and fill in at least `OWNER_NUMBER` (your own WhatsApp number, digits only, with country code — e.g. `2348012345678`). Everything else has a sensible default.

### Run

```bash
npm start
```

On first run, no `SESSION_ID` means the bot starts in **QR/pairing mode**. See the next section for how to actually link your number.

---

## 📱 Pairing Your WhatsApp Account

<img src="./attached_assets/stock_images/digital_features_das_94b4fbc4.jpg" alt="Bot Features Dashboard" width="100%" style="border-radius: 15px; margin: 20px 0;">

You have three options. Pick whichever is easiest for you — you only need one.

### Option 1 — QR Code (simplest, no extra setup)

1. Run `npm start`.
2. Open `http://localhost:5000/qr` in a browser (or your deployed URL).
3. On your phone: **WhatsApp → Settings → Linked Devices → Link a Device**, then scan the code shown.
4. Once connected, the bot prints and saves your session automatically so you don't need to re-scan on restart.

### Option 2 — Telegram Pairing Bot

If you'd rather manage pairing (and get AI chat, image gen, song downloads, etc.) from Telegram:

1. Create a bot via [@BotFather](https://t.me/BotFather) on Telegram and copy the token, formatted like `123456789:AAHxxxxxxx`.
2. In `.env`:
   ```env
   TELEGRAM_BOT_ID=123456789
   TELEGRAM_BOT_TOKEN=AAHxxxxxxx
   TELEGRAM_ADMIN_IDS=your_telegram_user_id
   ```
   (Get your Telegram user ID from [@userinfobot](https://t.me/userinfobot).)
3. Restart the bot, open your Telegram bot, send `/start`, then `/pair 2348012345678`.
4. It replies with a pairing code — enter it the same way as in Option 1, step 3.

### Option 3 — Direct Web Pairing Code (with automatic session backup)

```
GET http://localhost:5000/pair?number=2348012345678
```

This requests a pairing code directly and, once linked, zips your session and uploads it to Mega.nz, then sends you a `SESSION_ID` you can drop into `.env` to skip pairing entirely on future restarts. This option requires a Mega.nz account:

```env
MEGA_EMAIL=your@email.com
MEGA_PASSWORD=your-mega-password
```

If you don't set these, options 1 and 2 still work fine without them.

---

## ⚙️ Configuration

All configuration lives in a single `.env` file (see `.env.example`). The essentials:

| Variable | Description | Default |
|---|---|---|
| `OWNER_NUMBER` | Your WhatsApp number, digits only | — (required) |
| `OWNER_NAME` | Display name for the owner | `Raphael Ilom` |
| `SUDO_NUMBERS` | Comma-separated numbers with elevated (non-owner) permissions | empty |
| `PREFIX` | Command prefix | `.` |
| `PUBLIC_MODE` | `true` = anyone can use the bot, `false` = owner-only | `false` |
| `SESSION_ID` | Paste a saved session here to skip pairing on restart | empty |
| `TELEGRAM_BOT_ID` / `TELEGRAM_BOT_TOKEN` | Enables the Telegram pairing bot | empty |
| `OPENAI_API_KEY` | Enables OpenAI for the `ai` command (optional — has a free fallback) | empty |
| `WEATHER_API_KEY` | Enables OpenWeatherMap for `weather` (optional — falls back to wttr.in) | empty |
| `DATABASE_URL` | MongoDB connection string (optional — the bot runs fine on local JSON files without it) | empty |
| `MEGA_EMAIL` / `MEGA_PASSWORD` | Needed only for Option 3 pairing above | empty |
| `PORT` | Web server port (serves `/qr`, `/pair`, `/health`, `/stats`) | `5000` |

> ⚠️ **`BOT_NAME` is locked to `AmazingBot`** internally as a credit-protection measure — the bot refuses to start if this is changed, to keep Raphael Ilom's authorship attached to the project. This doesn't affect the console banner or any of the bot's visible branding, which stays "ILOM Bot".

---

## 📖 Commands

Type `.help` in any chat the bot can see for the full, always-up-to-date list with categories. Type `.help <category>` or `.help <command>` for details on any one of them.

<details>
<summary><b>Admin (18)</b> — click to expand</summary>

`add` `antigay` `antigm` `antileave` `antilink` `antispam` `antisticker` `antiword` `ban` `demote` `groupinfo` `kick` `mute` `promote` `tagall` `unmute` `warn` `welcome`
</details>

<details>
<summary><b>Economy (19)</b></summary>

`balance` `beg` `coinflip` `crime` `daily` `deposit` `dice` `fish` `hunt` `inventory` `leaderboard` `mine` `rob` `shop` `slot` `transfer` `weekly` `withdraw` `work`
</details>

<details>
<summary><b>Owner (9)</b></summary>

`autostatus` `broadcast` `cmd` `eval` `leave` `mode` `prefix` `setcmd` `shell` `whitelist`
</details>

<details>
<summary><b>General (6)</b></summary>

`botinfo` `help` `owner` `ping` `profile` `uptime`
</details>

<details>
<summary><b>Downloader (2)</b></summary>

`play` (audio) · `video` (video, by URL or search term)
</details>

<details>
<summary><b>Games (1)</b>, <b>Fun (2)</b>, <b>Media (1)</b>, <b>Utility (2)</b>, <b>AI (1)</b></summary>

`tictactoe` · `joke`, `quote` · `sticker` · `weather`, `translate` · `ai`
</details>

---

## 🛠️ Adding Your Own Commands

Drop a new file in `scripts/cmds/`. No registration step — it's picked up automatically. See `scripts/cmds/newcommand.eg.js` for a full example with every lifecycle hook. Minimal shape:

```js
export default {
    config: {
        name: 'mycommand',
        aliases: ['mc'],
        category: 'general',
        coolDown: 3,
        role: 0, // 0 = everyone, 1 = group admin, 2 = bot owner
        guide: { en: '{prefix}mycommand <arg>' },
    },

    async onStart({ reply, args }) {
        return reply(`You said: ${args.join(' ')}`);
    },
};
```

You can also do this **from inside WhatsApp** using the built-in `cmd` command (owner only):

```
.cmd create mycommand      → creates a blank template
.cmd source mycommand      → view a command's source
.cmd reload mycommand      → reload after editing
.cmd reloadall             → reload everything
```

Available in every command's `onStart`: `sock`, `message`, `args`, `from`, `sender`, `isGroup`, `isGroupAdmin`, `isBotAdmin`, `isOwner`, `prefix`, `pushName`, `usersData`, `threadsData`, `AmazingBot`, plus the shortcuts `send`, `reply`, and `React`.

---

## 🔧 Troubleshooting

**Bot won't start / exits immediately with "STARTUP BLOCKED"**
`BOT_NAME` in your `.env` was changed. Remove that line (or set it back to `AmazingBot`) — this is an intentional lock, not a bug.

**QR code page shows "No QR Code Available"**
The bot hasn't reached WhatsApp's servers yet, or already has an active session. Wait a few seconds after starting, or delete the `cache/auth_info_baileys` folder to force a fresh pairing.

**Commands not responding**
Check `PUBLIC_MODE` in `.env` — if it's `false` (the default), only the owner number(s) in `OWNER_NUMBER`/`SUDO_NUMBERS` can use the bot elsewhere.

**"Cannot find module" errors after pulling updates**
Run `npm install` again — dependencies may have changed.

---

## 💬 Credit

Built by **Raphael Ilom**. This credit is enforced in code (`src/config.js`) — the bot will not run if `BOT_NAME` is changed away from its locked value.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>
</p>
