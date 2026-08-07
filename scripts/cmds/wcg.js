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
    'joyful','laser','novel','opera','pride','snake','trend','vague','weary','young',
    'agree','basic','carry','dance','enter','faith','grass','heart','image','knife',
    'laugh','music','nurse','paper','raise','share','think','voice','wheel',
    'brave','civil','large','noble','ocean','outer','piano','reach','train','usual',
    'video','worth','flood','honor','inlet','joint','layer','major','nerve','plate',
    'radar','solar','urban','vapor','wagon','yacht','zones','about','above',
    'bring','carry','dance','faith','heart','judge','knife','laugh','music','nurse',
    'paper','queen','raise','share','think','under','voice','wheel','young','brave',
    'equal','force','grace','happy','inner','media','noble','piano','quick','reach',
    'space','train','usual','video','worth','extra','feast','giant','honey','irony',
    'knock','local','ninth','olive','photo','rapid','storm','truck','upper','vivid',
    'wound','youth','alarm','brain','crown','dirty','eager','fever','globe','hobby',
    'inbox','laser','novel','opera','pride','trend','vague','weary','young','about',
    'above','agree','basic','carry','dance','enter','faith','grass','heart','image',
    'judge','knife','laugh','music','nurse','ocean','paper','queen','raise','share',
    'think','under','voice','wheel','young','brave','civil','dream','equal','force',
    'grace','happy','inner','large','media','noble','outer','piano','quick','reach',
    'space','train','usual','video','worth','extra','feast','giant','honey','irony',
    'knock','local','ninth','olive','photo','quest','rapid','storm','truck','upper',
    'vivid','wound','xenon','youth','alarm','brain','crown','dirty','eager','fever',
    'globe','hobby','inbox','joyful','knelt','laser','modest','novel','opera','pride',
    'roman','snake','trend','urban','vague','weary','xerox','young','zoned','badge',
    'climb','error','flood','globe','honor','inlet','joint','knife','layer','major',
    'nerve','officer','plate','radar','solar','trace','unity','vocal','wheat','young',
    'about','above','agree','basic','bring','carry','dance','enter','faith','grass',
    'heart','image','judge','knife','laugh','music','nurse','ocean','paper','queen',
    'raise','share','think','under','voice','wheel','young','brave','civil','dream',
    'equal','force','grace','happy','inner','large','media','noble','outer','piano',
    'quick','reach','space','train','usual','video','worth','extra','feast','giant',
    'honey','irony','knock','local','ninth','olive','photo','quest','rapid','storm',
    'truck','upper','vivid','wound','xenon','youth','alarm','brain','crown','dirty',
    'eager','fever','globe','hobby','inbox','joyful','knelt','laser','modest','novel',
    'opera','pride','roman','snake','trend','urban','vague','weary','xerox','young',
    'zoned','badge','climb','error','flood','globe','honor','inlet','joint','knife',
    'layer','major','nerve','officer','plate','radar','solar','trace','unity','vocal',
    'wheat','young','about','above','agree','basic','bring','carry','dance','enter',
    'faith','grass','heart','image','judge','knife','laugh','music','nurse','ocean',
    'paper','queen','raise','share','think','under','voice','wheel','young','brave',
    'civil','dream','equal','force','grace','happy','inner','large','media','noble',
    'outer','piano','quick','reach','space','train','usual','video','worth','extra',
    'feast','giant','honey','irony','knock','local','ninth','olive','photo','quest',
    'rapid','storm','truck','upper','vivid','wound','xenon','youth','alarm','brain',
    'crown','dirty','eager','fever','globe','hobby','inbox','joyful','knelt','laser',
    'modest','novel','opera','pride','roman','snake','trend','urban','vague','weary',
    'xerox','young','zoned','badge','climb','error','flood','globe','honor','inlet',
    'joint','knife','layer','major','nerve','officer','plate','radar','solar','trace',
    'unity','vocal','wheat','young','about','above','agree','basic','bring','carry',
    'dance','enter','faith','grass','heart','image','judge','knife','laugh','music',
    'nurse','ocean','paper','queen','raise','share','think','under','voice','wheel',
    'young','brave','civil','dream','equal','force','grace','happy','inner','large',
    'media','noble','outer','piano','quick','reach','space','train','usual','video',
    'worth','extra','feast','giant','honey','irony','knock','local','ninth','olive',
    'photo','quest','rapid','storm','truck','upper','vivid','wound','xenon','youth',
    'alarm','brain','crown','dirty','eager','fever','globe','hobby','inbox','joyful'
]);

const TURN_TIME = 30;
const HARD_MIN = 4;

export default {
    config: {
        name: 'wcg',
        aliases: ['wordchain', 'chain', 'wordgame'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Word Chain Game — multiplayer word chain',
        category: 'games',
        coolDown: 10,
        role: 0,
        groupOnly: true,
        guide: { en: '{prefix}wcg start [hard]\n{prefix}wcg join\n{prefix}wcg stop\n{prefix}wcg <word>' }
    },

    async onStart({ sock, message, args, from, sender, prefix, reply, React }) {
        React('🔗');
        const sub = (args[0] || '').toLowerCase();
        const game = games.get(from);

        switch (sub) {
            case 'start': {
                if (game && game.active) {
                    return reply(`❌ Game already running! Type *${prefix}wcg join* to join.`);
                }
                const hardMode = args[1]?.toLowerCase() === 'hard';
                const room = {
                    active: true,
                    creator: sender,
                    players: { [sender]: { words: 0, letters: 0, longest: '' } },
                    participants: [sender],
                    currentLetter: '',
                    currentWord: '',
                    currentBy: '',
                    turnTimer: null,
                    lobbyTimer: null,
                    mode: hardMode ? 'hard' : 'easy',
                    wordsPlayed: 0,
                    playedWords: new Set(),
                    turnStart: 0,
                };
                games.set(from, room);

                let text = `━━━━━━━━━━━━━━━━━━━━\n`;
                text += `  🔗 *WORD CHAIN GAME*\n`;
                text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                text += `  🎮 Mode: ${hardMode ? '🔴 Hard (min 4 letters)' : '🟢 Easy'}\n`;
                text += `  👤 Created by: @${sender.split('@')[0]}\n\n`;
                text += `  👥 Players: @${sender.split('@')[0]}\n\n`;
                text += `  ⏳ Lobby open for 30s!\n`;
                text += `  › *${prefix}wcg join* — join\n`;
                text += `  › *${prefix}wcg start* — start early\n`;
                text += `━━━━━━━━━━━━━━━━━━━━`;

                await reply({ text, mentions: [sender] });

                room.lobbyTimer = setTimeout(() => {
                    if (room.active && room.participants.length >= 2) {
                        startRound(from, sock, room);
                    } else if (room.active) {
                        games.delete(from);
                        sock.sendMessage(from, { text: `❌ Not enough players. Game cancelled.` });
                    }
                }, 30000);
                break;
            }

            case 'join': {
                if (!game || !game.active) return reply(`❌ No game running. Start one with *${prefix}wcg start*`);
                if (!game.lobbyTimer) return reply(`❌ Game already started.`);
                if (game.players[sender]) return reply(`✅ You're already in!`);

                game.players[sender] = { words: 0, letters: 0, longest: '' };
                game.participants.push(sender);

                let text = `✅ @${sender.split('@')[0]} joined!\n\n👥 Players: ${game.participants.length}\n`;
                for (const p of game.participants) text += `  • @${p.split('@')[0]}\n`;
                await reply({ text, mentions: game.participants });
                break;
            }

            case 'stop':
            case 'end': {
                if (!game || !game.active) return reply(`❌ No game running.`);
                if (game.turnTimer) clearTimeout(game.turnTimer);
                if (game.lobbyTimer) clearTimeout(game.lobbyTimer);
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

                if (game.participants.length < 2 && game.active) {
                    endGame(from, sock, game);
                    games.delete(from);
                }
                break;
            }

            default: {
                if (!game || !game.active) {
                    return reply(`❌ No active game.\n\n*Usage:*\n${prefix}wcg start [hard]\n${prefix}wcg join`);
                }
                if (!game.players[sender]) return reply(`❌ You're not in the game.`);
                if (game.currentBy === sender) return reply(`⏳ Wait for your turn!`);

                const word = sub.toLowerCase();
                if (!word || !/^[a-z]+$/.test(word)) return reply(`❌ Letters only!`);
                if (game.mode === 'hard' && word.length < HARD_MIN) return reply(`❌ Hard mode: min ${HARD_MIN} letters!`);
                if (!word.startsWith(game.currentLetter)) return reply(`❌ Must start with *${game.currentLetter.toUpperCase()}*!`);
                if (game.playedWords.has(word)) return reply(`❌ *"${word}"* already used!`);
                if (!WORDS.has(word)) return reply(`❌ *"${word}"* not in dictionary!`);

                if (game.turnTimer) clearTimeout(game.turnTimer);
                game.playedWords.add(word);
                game.wordsPlayed++;
                game.players[sender].words++;
                game.players[sender].letters += word.length;
                if (word.length > game.players[sender].longest.length) {
                    game.players[sender].longest = word;
                }
                game.currentLetter = word[word.length - 1];
                game.currentWord = word;
                game.currentBy = sender;

                await reply(`✅ @${sender.split('@')[0]}: *${word}*\n\n🔤 Next: *${game.currentLetter.toUpperCase()}* | ⏰ ${TURN_TIME}s`);

                game.turnTimer = setTimeout(() => skipTurn(from, sock, game), TURN_TIME * 1000);
                break;
            }
        }
    }
};

function startRound(chatId, sock, room) {
    if (!room.active) return;
    room.currentLetter = 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    room.playedWords = new Set();
    room.wordsPlayed = 0;
    room.turnStart = Date.now();

    let text = `━━━━━━━━━━━━━━━━━━━━\n  🎮 *GAME STARTED!*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `  🔤 Starting letter: *${room.currentLetter.toUpperCase()}*\n`;
    text += `  📏 Mode: ${room.mode === 'hard' ? '🔴 Hard' : '🟢 Easy'}\n`;
    text += `  ⏰ ${TURN_TIME}s per turn\n\n`;
    text += `  👥 Players:\n`;
    for (const p of room.participants) text += `     • @${p.split('@')[0]}\n`;
    text += `\n  Type a word starting with *${room.currentLetter.toUpperCase()}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━`;

    sock.sendMessage(chatId, { text, mentions: room.participants });
    room.turnTimer = setTimeout(() => skipTurn(chatId, sock, room), TURN_TIME * 1000);
}

function skipTurn(chatId, sock, room) {
    if (!room.active) return;
    const idx = (room.participants.indexOf(room.currentBy) + 1) % room.participants.length;
    room.currentBy = room.participants[idx];

    sock.sendMessage(chatId, {
        text: `⏰ *Time's up!*\n\n🔤 @${room.currentBy.split('@')[0]} — type a word starting with *${room.currentLetter.toUpperCase()}*`,
        mentions: [room.currentBy]
    });

    room.turnTimer = setTimeout(() => skipTurn(chatId, sock, room), TURN_TIME * 1000);
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
