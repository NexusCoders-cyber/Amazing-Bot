# EVAL Command Guide

## What is eval?

The `.eval` command lets the bot owner execute live JavaScript with access to the bot's internals:

- `sock` — the WhatsApp socket (send messages, get group info, etc.)
- `message` — the raw message object
- `from` — the current chat JID
- `sender` — your JID
- `args` — the arguments you typed after `eval`
- `usersData` — user data API (get, set, addMoney, etc.)
- `threadsData` — group data API (get, set, getSetting, etc.)
- `AmazingBot` — the global namespace (onReply, onReaction, onChat maps)
- `api` — the AmazingBot api wrapper (sendMessage, sendImage, groupMetadata, etc.)
- `reply` — quote-reply helper

Anything else you need (like `config` or another module) can be pulled in with a dynamic import inside your code, since eval runs inside an async function:

```
eval const { default: config } = await import('../../src/config.js'); return config.prefix;
```

## Basic Usage

```
.eval <code>
```

Aliases: `.ev` or `.>`

## Examples

### Simple expressions
```
.eval 1 + 1
.eval sock.user
.eval process.version
```

### Async / await
```
.eval await usersData.get(sender)
.eval await usersData.getAll()
.eval await sock.groupMetadata(from)
```

### Bot internals
```
.eval AmazingBot.onReply.size
.eval AmazingBot.onChat.length
```

### Sending things directly
```
.eval await sock.sendMessage(from, { text: 'hi' })
.eval await api.sendReaction(from, message.key, '🔥')
```

### Multi-line / statements
If your code isn't a single expression, eval falls back to statement mode automatically:
```
.eval const user = await usersData.get(sender); user.money = 5000; return user;
```

## Notes

- Only the bot owner can run this command (checked via the `role: 2` permission on the command).
- Output over 4000 characters is truncated.
- If the code throws, you'll get the error name and message back instead of a crash.
