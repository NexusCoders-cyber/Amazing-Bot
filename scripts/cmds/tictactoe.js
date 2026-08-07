import { registerOnReply } from '../../src/utils/amazingbot.js';

const EMPTY = '-', X = 'X', O = 'O';
const WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function renderBoard(board) {
    const rows = [];
    for (let i = 0; i < 9; i += 3) {
        rows.push(board.slice(i, i + 3).join(' | '));
    }
    return rows.join('\n---------\n');
}

function checkWin(board, mark) {
    return WIN_COMBOS.some(([a, b, c]) => board[a] === mark && board[b] === mark && board[c] === mark);
}

function isDraw(board) { return board.every(c => c !== EMPTY); }

function bestMove(board) {
    let best = -Infinity, move = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] !== EMPTY) continue;
        board[i] = O;
        const score = minimax(board, 0, false);
        board[i] = EMPTY;
        if (score > best) { best = score; move = i; }
    }
    return move;
}

function minimax(board, depth, isMax) {
    if (checkWin(board, O)) return 10 - depth;
    if (checkWin(board, X)) return depth - 10;
    if (isDraw(board)) return 0;
    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] !== EMPTY) continue;
            board[i] = O; best = Math.max(best, minimax(board, depth + 1, false)); board[i] = EMPTY;
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] !== EMPTY) continue;
            board[i] = X; best = Math.min(best, minimax(board, depth + 1, true)); board[i] = EMPTY;
        }
        return best;
    }
}

export default {
    config: {
        name: 'tictactoe',
        aliases: ['ttt', 'xo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Play Tic-Tac-Toe against the bot',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}tictactoe then reply with a number 1-9' },
    },

    async onStart({ sock, message, from, sender, reply }) {
        const board = Array(9).fill(EMPTY);
        const text = `Tic-Tac-Toe\nYou are X, bot is O\n\n${renderBoard(board)}\n\nReply with a number 1-9 to play\n1 | 2 | 3\n---------\n4 | 5 | 6\n---------\n7 | 8 | 9`;
        const sent = await sock.sendMessage(from, { text }, { quoted: message });
        registerOnReply(sent.key.id, { commandName: 'tictactoe', board, playerJid: sender });
    },

    async onReply({ sock, message, from, sender, Reply }) {
        if (sender !== Reply.playerJid) return;
        const text = (message?.message?.conversation || '').trim();
        const move = parseInt(text) - 1;

        if (isNaN(move) || move < 0 || move > 8) {
            return sock.sendMessage(from, { text: 'Enter a number from 1 to 9.' }, { quoted: message });
        }

        const board = Reply.board;
        if (board[move] !== EMPTY) {
            return sock.sendMessage(from, { text: 'That cell is taken. Pick another.' }, { quoted: message });
        }

        board[move] = X;

        if (checkWin(board, X)) {
            Reply.delete();
            return sock.sendMessage(from, { text: `${renderBoard(board)}\n\nYou win!` }, { quoted: message });
        }
        if (isDraw(board)) {
            Reply.delete();
            return sock.sendMessage(from, { text: `${renderBoard(board)}\n\nIt's a draw.` }, { quoted: message });
        }

        const botMove = bestMove(board);
        board[botMove] = O;

        if (checkWin(board, O)) {
            Reply.delete();
            return sock.sendMessage(from, { text: `${renderBoard(board)}\n\nBot wins!` }, { quoted: message });
        }
        if (isDraw(board)) {
            Reply.delete();
            return sock.sendMessage(from, { text: `${renderBoard(board)}\n\nIt's a draw.` }, { quoted: message });
        }

        const next = await sock.sendMessage(from, { text: `${renderBoard(board)}\n\nYour turn. Reply with a number 1-9.` }, { quoted: message });
        registerOnReply(next.key.id, { commandName: 'tictactoe', board, playerJid: sender });
    },
};
