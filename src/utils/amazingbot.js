function initAmazingBot() {
    if (global.AmazingBot) return global.AmazingBot;
    global.AmazingBot = {
        onReply: new Map(),
        onReaction: new Map(),
        onEvent: new Map(),
        onChat: [],
        eventCommands: new Map(),
        config: {},
    };
    return global.AmazingBot;
}

function getAmazingBot() {
    return global.AmazingBot || initAmazingBot();
}

function registerOnReply(messageId, data) {
    const ab = getAmazingBot();
    const entry = { ...data };
    entry.delete = () => ab.onReply.delete(messageId);
    ab.onReply.set(messageId, entry);
    return entry;
}

function registerOnReaction(messageId, data) {
    const ab = getAmazingBot();
    const entry = { ...data };
    entry.delete = () => ab.onReaction.delete(messageId);
    ab.onReaction.set(messageId, entry);
    return entry;
}

function registerEventCommand(commandName, command) {
    const ab = getAmazingBot();
    ab.eventCommands.set(commandName, command);
}

function getOnReply(messageId) {
    return global.AmazingBot?.onReply?.get(messageId) || null;
}

function getOnReaction(messageId) {
    return global.AmazingBot?.onReaction?.get(messageId) || null;
}

export {
    initAmazingBot,
    getAmazingBot,
    registerOnReply,
    registerOnReaction,
    registerEventCommand,
    getOnReply,
    getOnReaction,
};

export default initAmazingBot;
