const games = new Map();

const WORDS = new Set([
    'apple','banana','orange','grape','mango','tiger','eagle','river','ocean','island',
    'bridge','castle','dragon','flame','ghost','hammer','jungle','knight','lemon',
    'mountain','night','paper','queen','snake','umbrella','volcano','water','yellow','zebra',
    'ant','bear','cat','dog','elephant','fox','goat','horse','iguana','jaguar',
    'koala','lion','mouse','newt','owl','penguin','quail','rabbit','sheep','turtle',
    'acorn','breeze','cactus','delta','ember','frost','glow','haze','ivory','jade',
    'knot','lava','moss','opal','pine','quartz','reef','sage','thorn','vivid',
    'wren','azure','blaze','crest','dusk','echo','fable','glyph','haven','jewel',
    'keen','latch','merge','noble','orbit','prime','quest','ridge','spark','tower',
    'arrow','blade','charm','drift','elite','forge','grain','haste','judge',
    'lance','might','pilot','radar','solar','trace','vocal','wheat','badge','climb',
    'dream','equal','force','grace','happy','inner','media','outer','piano','quick',
    'reach','space','train','video','worth','extra','feast','giant','honey','irony',
    'knock','local','ninth','olive','photo','rapid','storm','truck','upper','wound',
    'youth','alarm','brain','crown','dirty','eager','fever','globe','hobby','inbox',
    'joyful','laser','novel','opera','pride','trend','vague','weary','young',
    'agree','basic','carry','dance','enter','faith','grass','heart','image','knife',
    'laugh','music','nurse','raise','share','think','voice','wheel','under','about',
    'above','bring','civil','large','noble','ocean','outer','piano','reach','train',
    'usual','video','worth','flood','honor','inlet','joint','layer','major','nerve',
    'plate','radar','solar','urban','vapor','wagon','yacht','zones','xenon','zinc',
    'badge','climb','error','globe','honor','inlet','joint','knife','layer','major',
    'nerve','officer','plate','radar','solar','trace','unity','vocal','wheat','young'
]);

const LOBBY_TIME = 30000;   // 30s lobby wait before game starts
const TURN_TIME = 30000;    // 30s per turn
const START_LETTERS = 3;    // first round requires 3 letters

export default {
    config: {
        name: 'wcg',
        aliases: ['wordchain', 'chain', 'wordgame'],
        author: 'Broken_vzn',
        version: '3.0',
        shortDescription: 'Word Chain Game — turn-based, letter-count rounds',
        category: 'games',
        coolDown: 5,
        role: 0,
        groupOnly: true,
        guide: { en: '{prefix}wcg start\nType "join" to join\nType your word when tagged' }
    },

    async onStart({ sock, message, args, from, sender, prefix, reply, React }) {
        React('🔗');
        const sub = (args[0] || '').toLowerCase();
        const game = games.get(from);

        switch (sub) {
            case 'start': {
                if (game && game.active) {
                    return reply(`❌ Game already running! Type *join* to join.`);
                }
                const room = {
                    active: true, started: false,
                    mode: 'easy',
                    participants: [],
                    players: {},
                    currentBy: null, currentLetter: null,
                    currentWord: null, playedWords: new Set(),
                    wordsPlayed: 0, round: 1, requiredLetters: START_LETTERS,
                    turnTimer: null, lobbyTimer: null,
                };
                room.participants.push(sender);
                room.players[sender] = { words: 0, letters: 0, longest: '' };
                games.set(from, room);

                let text = `━━━━━━━━━━━━━━━━━━━━\n  🔗 *WORD CHAIN GAME* (${prefix}wcg)\n━━━━━━━━━━━━━━━━━━━━\n\n`;
                text += `  👤 Created by: @${sender.split('@')[0]}\n\n`;
                text += `  👥 Players:\n     • @${sender.split('@')[0]}\n\n`;
                text += `  ⏳ Game starts in *30s*\n\n`;
                text += `  › Type *join* to join\n  › Type *${prefix}wcg start* to start early\n`;
                text += `━━━━━━━━━━━━━━━━━━━━`;
                await reply({ text, mentions: room.participants });

                room.lobbyTimer = setTimeout(() => {
                    if (room.active && !room.started && room.participants.length >= 2) {
                        startGame(from, sock, room);
                    } else if (room.active && !room.started) {
                        games.delete(from);
                        sock.sendMessage(from, { text: `❌ Not enough players. Game cancelled.` });
                    }
                }, LOBBY_TIME);
                break;
            }

            case 'join': {
                if (!game || !game.active) return reply(`❌ No game running. Start one with *${prefix}wcg start*`);
                if (game.started) return reply(`❌ Game already started.`);
                if (game.players[sender]) return reply(`✅ You're already in!`);
                game.players[sender] = { words: 0, letters: 0, longest: '' };
                game.participants.push(sender);
                let text = `✅ @${sender.split('@')[0]} joined!\n\n👥 Players (${game.participants.length}):\n`;
                for (const p of game.participants) text += `  • @${p.split('@')[0]}\n`;
                if (game.participants.length >= 2) text += `\n⏳ Starting in a few seconds...`;
                await reply({ text, mentions: game.participants });
                break;
            }

            case 'stop': case 'end': {
                if (!game || !game.active) return reply(`❌ No game running.`);
                clearTimeout(game.turnTimer); clearTimeout(game.lobbyTimer);
                endGame(from, sock, game);
                games.delete(from);
                break;
            }

            case 'quit': {
                if (!game || !game.active) return reply(`❌ No game running.`);
                if (!game.players[sender]) return reply(`❌ You're not in the game.`);
                delete game.players[sender];
                game.participants = game.participants.filter(p => p !== sender);
                await reply(`👋 @${sender.split('@')[0]} quit.`);
                if (game.participants.length < 2 && game.active) { endGame(from, sock, game); games.delete(from); }
                break;
            }

            default: {
                if (!game || !game.active) return reply(`❌ No active game.\n\nStart: *${prefix}wcg start*\nJoin: type *join*`);
                // allow 'wcg <word>' as a way to submit too
                return processWord(from, sock, game, sender, sub, reply);
            }
        }
    },

    // Catch bare words / "join" typed during the game (no prefix needed)
    async onChat({ sock, message, from, sender, reply }) {
        const game = games.get(from);
        if (!game || !game.active) return false;
        const text = (message?.message?.conversation || message?.message?.extendedTextMessage?.text || '').trim();
        if (!text) return false;
        if (text.startsWith('.') || text.startsWith('#')) return false;

        // "join" to join the lobby
        if (/^(join|me)$/i.test(text)) {
            if (game.started) return false;
            if (game.players[sender]) return false;
            game.players[sender] = { words: 0, letters: 0, longest: '' };
            game.participants.push(sender);
            let t = `✅ @${sender.split('@')[0]} joined!\n\n👥 Players (${game.participants.length}):\n`;
            for (const p of game.participants) t += `  • @${p.split('@')[0]}\n`;
            if (game.participants.length >= 2) t += `\n⏳ Starting in a few seconds...`;
            await reply({ text: t, mentions: game.participants });
            return true;
        }

        // single letter-only word = a turn answer
        if (!/^[a-z]+$/i.test(text)) return false;
        if (!game.started) return false;
        if (!game.players[sender]) return false;
        await processWord(from, sock, game, sender, text.toLowerCase(), reply);
        return true;
    },
};

// Start the actual game (turn-based)
function startGame(chatId, sock, room) {
    if (!room.active || room.started) return;
    room.started = true;
    room.round = 1;
    room.requiredLetters = START_LETTERS;
    room.playedWords = new Set();
    room.wordsPlayed = 0;
    // pick first letter and first player
    room.currentLetter = 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    room.turnIndex = 0;
    room.currentBy = room.participants[0];

    let text = `━━━━━━━━━━━━━━━━━━━━\n  🎮 *GAME STARTED!*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `  🔤 Starting letter: *${room.currentLetter.toUpperCase()}*\n`;
    text += `  🔢 Round *1* — words must have *${room.requiredLetters} letters*\n`;
    text += `  ⏰ ${TURN_TIME / 1000}s per turn\n\n`;
    text += `  👥 Players (${room.participants.length}):\n`;
    for (const p of room.participants) text += `     • @${p.split('@')[0]}\n`;
    text += `\n━━━━━━━━━━━━━━━━━━━━`;
    sock.sendMessage(chatId, { text, mentions: room.participants });

    // tag the first player to answer
    sock.sendMessage(chatId, {
        text: `🎯 @${room.currentBy.split('@')[0]} — type a *${room.requiredLetters}-letter* word starting with *${room.currentLetter.toUpperCase()}*`,
        mentions: [room.currentBy]
    });
    room.turnTimer = setTimeout(() => skipTurn(chatId, sock, room), TURN_TIME);
}

// Next player's turn (tag only that player)
function skipTurn(chatId, sock, room) {
    if (!room.active || !room.started) return;
    // after a full round (everyone answered), increase required letters
    if (room.wordsPlayed > 0 && room.wordsPlayed % room.participants.length === 0) {
        room.round++;
        room.requiredLetters = START_LETTERS + room.round - 1;
        sock.sendMessage(chatId, { text: `🔢 *Round ${room.round}* — words must have *${room.requiredLetters} letters* now!` });
    }
    const idx = (room.participants.indexOf(room.currentBy) + 1) % room.participants.length;
    room.currentBy = room.participants[idx];
    sock.sendMessage(chatId, {
        text: `🎯 @${room.currentBy.split('@')[0]} — type a *${room.requiredLetters}-letter* word starting with *${room.currentLetter.toUpperCase()}*`,
        mentions: [room.currentBy]
    });
    room.turnTimer = setTimeout(() => skipTurn(chatId, sock, room), TURN_TIME);
}

// Process a submitted word (turn answer)
async function processWord(chatId, sock, game, sender, rawWord, reply) {
    if (!game.players[sender]) return reply(`❌ You're not in the game.`);
    if (game.currentBy !== sender) return reply(`⏳ Wait for your turn! @${game.currentBy?.split('@')[0]}`);
    const word = String(rawWord || '').toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) return reply(`❌ Letters only!`);
    if (word.length !== game.requiredLetters) return reply(`❌ This round needs *${game.requiredLetters} letters*!`);
    if (!word.startsWith(game.currentLetter)) return reply(`❌ Must start with *${game.currentLetter.toUpperCase()}*!`);
    if (game.playedWords.has(word)) return reply(`❌ *"${word}"* already used!`);
    if (!WORDS.has(word)) return reply(`❌ *"${word}"* not in dictionary!`);

    if (game.turnTimer) clearTimeout(game.turnTimer);
    game.playedWords.add(word);
    game.wordsPlayed++;
    game.players[sender].words++;
    game.players[sender].letters += word.length;
    if (word.length > game.players[sender].longest.length) game.players[sender].longest = word;
    game.currentLetter = word[word.length - 1];

    await reply(`✅ @${sender.split('@')[0]}: *${word}*\n🔤 Next letter: *${game.currentLetter.toUpperCase()}*`);

    // advance to next player
    const idx = (game.participants.indexOf(sender) + 1) % game.participants.length;
    game.currentBy = game.participants[idx];
    // check round bump
    if (game.wordsPlayed % game.participants.length === 0) {
        game.round++;
        game.requiredLetters = START_LETTERS + game.round - 1;
        sock.sendMessage(chatId, { text: `🔢 *Round ${game.round}* — words must have *${game.requiredLetters} letters* now!` });
    }
    sock.sendMessage(chatId, {
        text: `🎯 @${game.currentBy.split('@')[0]} — type a *${game.requiredLetters}-letter* word starting with *${game.currentLetter.toUpperCase()}*`,
        mentions: [game.currentBy]
    });
    game.turnTimer = setTimeout(() => skipTurn(chatId, sock, game), TURN_TIME);
}

function endGame(chatId, sock, room) {
    const sorted = room.participants
        .map(p => ({ id: p, ...room.players[p] }))
        .sort((a, b) => b.words - a.words || b.letters - a.letters);
    const medals = ['🥇', '🥈', '🥉'];
    let text = `━━━━━━━━━━━━━━━━━━━━\n  🏆 *GAME OVER*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `  📊 Words played: ${room.wordsPlayed}\n\n`;
    for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];
        text += `  ${medals[i] || `🔹 ${i + 1}.`} @${p.id.split('@')[0]}\n`;
        text += `     📝 ${p.words} words | ${p.letters} letters\n`;
        if (p.longest) text += `     📏 Longest: *${p.longest}*\n`;
    }
    if (sorted.length) {
        const winner = sorted[0];
        const prize = 500 + (room.wordsPlayed * 25);
        text += `\n  🎉 @${winner.id.split('@')[0]} wins *${prize} coins*!\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━`;
    sock.sendMessage(chatId, { text, mentions: room.participants });
}
