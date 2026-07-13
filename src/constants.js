const BOT_VERSION = '2.0.0';
const BOT_NAME = 'ILOM Bot';
const BOT_AUTHOR = 'Ilom';
const BOT_DESCRIPTION = 'ILOM Bot v2 — Multi-Device WhatsApp Bot by Ilom';

const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
    STICKER: 'sticker',
    CONTACT: 'contact',
    LOCATION: 'location',
    LIVE_LOCATION: 'liveLocation',
    POLL: 'poll',
    BUTTON_RESPONSE: 'buttonResponse',
    LIST_RESPONSE: 'listResponse'
};

const COMMAND_CATEGORIES = {
    ADMIN: 'admin',
    AI: 'ai',
    DOWNLOADER: 'downloader',
    ECONOMY: 'economy',
    FUN: 'fun',
    GAMES: 'games',
    GENERAL: 'general',
    MEDIA: 'media',
    OWNER: 'owner',
    UTILITY: 'utility'
};

const USER_PERMISSIONS = {
    OWNER: 'owner',
    ADMIN: 'admin',
    PREMIUM: 'premium',
    USER: 'user',
    BANNED: 'banned'
};

const GROUP_PERMISSIONS = {
    OWNER: 'superadmin',
    ADMIN: 'admin',
    MEMBER: 'member'
};

const COMMAND_PERMISSIONS = {
    OWNER: 'owner',
    ADMIN: 'admin',
    PREMIUM: 'premium',
    GROUP: 'group',
    PRIVATE: 'private',
    BOT_ADMIN: 'botAdmin'
};

const ERROR_CODES = {
    UNKNOWN_COMMAND: 'UNKNOWN_COMMAND',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    INVALID_ARGUMENTS: 'INVALID_ARGUMENTS',
    COOLDOWN_ACTIVE: 'COOLDOWN_ACTIVE',
    RATE_LIMITED: 'RATE_LIMITED',
    USER_BANNED: 'USER_BANNED',
    GROUP_BANNED: 'GROUP_BANNED',
    FEATURE_DISABLED: 'FEATURE_DISABLED',
    API_ERROR: 'API_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    MEDIA_ERROR: 'MEDIA_ERROR'
};

const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

const EVENT_TYPES = {
    MESSAGE_CREATE: 'messageCreate',
    MESSAGE_UPDATE: 'messageUpdate',
    MESSAGE_DELETE: 'messageDelete',
    GROUP_JOIN: 'groupJoin',
    GROUP_LEAVE: 'groupLeave',
    GROUP_UPDATE: 'groupUpdate',
    CALL_RECEIVED: 'callReceived',
    CONNECTION_UPDATE: 'connectionUpdate',
    READY: 'ready',
    ERROR: 'error'
};

const MIME_TYPES = {
    IMAGE: {
        JPEG: 'image/jpeg',
        PNG: 'image/png',
        GIF: 'image/gif',
        WEBP: 'image/webp'
    },
    VIDEO: {
        MP4: 'video/mp4',
        AVI: 'video/avi',
        MOV: 'video/mov',
        MKV: 'video/mkv'
    },
    AUDIO: {
        MP3: 'audio/mpeg',
        M4A: 'audio/mp4',
        OGG: 'audio/ogg',
        WAV: 'audio/wav'
    },
    DOCUMENT: {
        PDF: 'application/pdf',
        DOC: 'application/msword',
        DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        TXT: 'text/plain',
        ZIP: 'application/zip'
    }
};

const MEDIA_LIMITS = {
    IMAGE: {
        MAX_SIZE: 5 * 1024 * 1024,
        ALLOWED_FORMATS: ['jpeg', 'jpg', 'png', 'gif', 'webp']
    },
    VIDEO: {
        MAX_SIZE: 50 * 1024 * 1024,
        MAX_DURATION: 300,
        ALLOWED_FORMATS: ['mp4', 'avi', 'mov', 'mkv', 'webm']
    },
    AUDIO: {
        MAX_SIZE: 10 * 1024 * 1024,
        ALLOWED_FORMATS: ['mp3', 'm4a', 'ogg', 'wav', 'aac']
    },
    STICKER: {
        MAX_SIZE: 1024 * 1024,
        DIMENSIONS: 512,
        FORMAT: 'webp'
    }
};

const RATE_LIMITS = {
    COMMANDS: { WINDOW: 60000, MAX_REQUESTS: 20 },
    MESSAGES: { WINDOW: 60000, MAX_REQUESTS: 100 },
    MEDIA: { WINDOW: 300000, MAX_REQUESTS: 10 }
};

const COOLDOWNS = {
    GLOBAL: 1000,
    COMMAND: 3000,
    MEDIA: 5000,
    DOWNLOAD: 10000,
    AI: 5000,
    GAME: 2000
};

const TIMEOUTS = {
    CONNECTION: 60000,
    COMMAND_EXECUTION: 30000,
    MEDIA_DOWNLOAD: 60000,
    API_REQUEST: 15000,
    DATABASE_QUERY: 10000,
    GAME_SESSION: 300000
};

const REGEX_PATTERNS = {
    URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[1-9]\d{1,14}$/,
    MENTION: /@(\d+)/g,
    COMMAND: /^[.!/#>](\w+)/
};

const API_ENDPOINTS = {
    OPENAI: 'https://api.openai.com/v1',
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta',
    WEATHER: 'https://api.openweathermap.org/data/2.5',
    NEWS: 'https://newsapi.org/v2',
    YOUTUBE: 'https://www.googleapis.com/youtube/v3',
    TRANSLATE: 'https://api.mymemory.translated.net',
    SPOTIFY: 'https://api.spotify.com/v1',
    QR_CODE: 'https://api.qrserver.com/v1/create-qr-code'
};

const ECONOMY_CONFIG = {
    STARTING_BALANCE: 1000,
    DAILY_REWARD: 100,
    WEEKLY_REWARD: 500,
    WORK_REWARDS: { MIN: 50, MAX: 200 },
    GAMBLE_LIMITS: { MIN: 10, MAX: 1000 },
    ROB_SUCCESS_RATE: 0.3,
    SHOP_ITEMS: {
        PREMIUM: { price: 5000, duration: 2592000000 },
        TITLE: { price: 1000 },
        BADGE: { price: 500 }
    }
};

const GAME_CONFIG = {
    TRIVIA: {
        TIME_LIMIT: 30000,
        POINTS: 100,
        CATEGORIES: ['general', 'science', 'history', 'sports', 'entertainment']
    },
    HANGMAN: { TIME_LIMIT: 120000, MAX_WRONG: 6, POINTS: 150 },
    MATH: { TIME_LIMIT: 15000, POINTS: 75 },
    MEMORY: { TIME_LIMIT: 60000, POINTS: 200 }
};

const EMOJIS = {
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️',
    INFO: 'ℹ️',
    LOADING: '⏳',
    STAR: '⭐',
    FIRE: '🔥',
    CROWN: '👑',
    ROBOT: '🤖',
    BRAIN: '🧠'
};

const CACHE_KEYS = {
    USER_PREFIX: 'user:',
    GROUP_PREFIX: 'group:',
    COMMAND_PREFIX: 'command:',
    COOLDOWN_PREFIX: 'cooldown:',
    SESSION_PREFIX: 'session:'
};

const DEFAULT_SETTINGS = {
    USER: {
        language: 'en',
        timezone: 'UTC',
        notifications: true,
        privacy: { showOnline: true, allowCommands: true }
    },
    GROUP: {
        language: 'en',
        timezone: 'UTC',
        welcome: { enabled: false, message: 'Welcome {user} to {group}!' },
        goodbye: { enabled: false, message: 'Goodbye {user}!' },
        antilink: false,
        antispam: true,
        autodelete: false,
        onlyAdmins: false
    }
};

const SUPPORTED_FORMATS = {
    AUDIO: ['mp3', 'm4a', 'aac', 'ogg', 'wav', 'flac'],
    VIDEO: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'],
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'zip']
};

export default {
    BOT_VERSION,
    BOT_NAME,
    BOT_AUTHOR,
    BOT_DESCRIPTION,
    MESSAGE_TYPES,
    COMMAND_CATEGORIES,
    USER_PERMISSIONS,
    GROUP_PERMISSIONS,
    COMMAND_PERMISSIONS,
    ERROR_CODES,
    STATUS_CODES,
    EVENT_TYPES,
    MIME_TYPES,
    MEDIA_LIMITS,
    RATE_LIMITS,
    COOLDOWNS,
    TIMEOUTS,
    REGEX_PATTERNS,
    API_ENDPOINTS,
    ECONOMY_CONFIG,
    GAME_CONFIG,
    EMOJIS,
    CACHE_KEYS,
    DEFAULT_SETTINGS,
    SUPPORTED_FORMATS
};
