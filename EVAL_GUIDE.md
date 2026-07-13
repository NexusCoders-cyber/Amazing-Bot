# 🧠 EVAL Command — Complete Guide

## What is eval?

The `.eval` command lets the **bot owner** execute live JavaScript code with **full access to the bot's internals**:
- `sock` — the WhatsApp socket (send messages, get group info, etc.)
- `from` — the current chat JID
- `sender` — your JID
- `config` — the bot config
- `global` — the Node.js global object
- `process` — Node.js process
- Any module the bot imports

---

## Basic Usage

```
.eval <code>
```

**Short aliases:** `.e` or `.>`

---

## Examples

### Simple expressions
```
.eval 2 + 2
.eval "hello".toUpperCase()
.eval Date.now()
.eval Math.random()
```

### Access bot info
```
.eval sock.user
.eval sock.user.id
.eval config.botName
.eval config.prefix
.eval config.ownerNumbers
.eval process.version
.eval process.uptime()
```

### Group operations
```
.eval await sock.groupMetadata(from)
.eval (await sock.groupMetadata(from)).participants.length
.eval (await sock.groupMetadata(from)).subject
.eval Object.keys(await sock.groupFetchAllParticipating())
```

### Send messages
```
.eval await sock.sendMessage(from, { text: 'Hello from eval!' })
.eval await sock.sendMessage(from, { react: { text: '🔥', key: message.key } })
```

### Multi-line code (use semicolons)
```
.eval const x = 5; const y = 10; return x + y
.eval let groups = await sock.groupFetchAllParticipating(); return Object.keys(groups).length
```

### Inspect global state
```
.eval Object.keys(global)
.eval global.replyHandlers
.eval global.botVars
```

### Check memory & performance
```
.eval process.memoryUsage()
.eval process.cpuUsage()
.eval process.env.NODE_ENV
```

### Bot variable system (use with .setvar)
```
.eval global.botVars
.eval global.botVars.myKey
```

---

## Special Flags

| Flag | What it does |
|------|-------------|
| `.eval --history` | Show last 15 eval executions |
| `.eval --clear` | Clear eval history |
| `.eval --quoted` | Execute code from a quoted message |

---

## Advanced Tips

### Return objects
```
.eval ({ name: sock.user?.name, jid: sock.user?.id })
```

### Await promises
```
.eval await new Promise(r => setTimeout(() => r('done!'), 1000))
```

### Filter data
```
.eval (await sock.groupFetchAllParticipating())
  |> Object.values(%)
  |> %.filter(g => g.participants.length > 100)
  |> %.map(g => g.subject)
```

### Check command list
```
.eval global._config
.eval (await import('./src/utils/commandManager.js')).getAllCommands().length
```

---

## Safety Notes

- Eval is **owner-only**
- Some env vars (SESSION, TOKEN, SECRET, KEY, PASSWORD) are **blocked and redacted**
- Outputs longer than 3,500 chars are **sent as a text file automatically**
- All eval runs are **logged to history** (`.eval --history`)
- Set `DISABLE_EVAL=true` in `.env` to turn off eval completely

---

## Thread Manager — `.thread`

Manage all WhatsApp groups the bot is in:

| Command | What it does |
|---------|-------------|
| `.thread list` | List all groups with member counts |
| `.thread count` | Show total groups and member stats |
| `.thread info` | Detailed info about the current group |
| `.thread send <msg>` | Send a message to ALL groups |
| `.thread kick @user` | Kick user from current group |
| `.thread leave <jid>` | Make bot leave a specific group |
| `.thread mute` | Lock current group (admins only) |
| `.thread unmute` | Unlock current group |
| `.thread save` | Save group list to disk |

---

## Bot Variables — `.setvar / .getvar / .delvar`

Store persistent key-value data accessible in eval:

```
.setvar greeting Hello there!
.getvar greeting
.eval global.botVars.greeting
.delvar greeting
.delvar --all
```

---

## Global Ban — `.gban`

Ban a user from using the bot across ALL groups:

```
.gban @user Reason here
.gban list
.gban remove @user
```

