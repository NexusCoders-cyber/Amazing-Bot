import './utils/loadEnv.js';

function normalizePhoneNumber(phone) {
    if (!phone || phone.trim() === '') return null;
    let cleaned = phone.trim();
    cleaned = cleaned.replace(/@s\.whatsapp\.net|@c\.us|@g\.us|@broadcast/g, '');
    cleaned = cleaned.split(':')[0];
    cleaned = cleaned.replace(/[^0-9]/g, '');
    if (cleaned.length < 10) return null;
    return `${cleaned}@s.whatsapp.net`;
}

const config = {
    botName: process.env.BOT_NAME || 'ILOM Bot',
    botVersion: process.env.BOT_VERSION || '2.0.0',
    botDescription: process.env.BOT_DESCRIPTION || 'ILOM Bot v2 — Multi-Device WhatsApp Bot by Ilom',
    botThumbnail: process.env.BOT_THUMBNAIL || 'https://i.ibb.co/sr8Jy29/69b07b2a6afd.png',
    botRepository: process.env.BOT_REPOSITORY || 'https://github.com/NexusCoders-cyber/Amazing-Bot.git',
    botWebsite: process.env.BOT_WEBSITE || 'https://ilom.tech',

    prefix: process.env.PREFIX || '.',
    ownerNoPrefix: process.env.OWNER_NO_PREFIX === 'true',
    noPrefixEnabled: process.env.NO_PREFIX_ENABLED === 'true',
    privateNoPrefixEnabled: process.env.PRIVATE_NO_PREFIX_ENABLED === 'true',

    ownerNumbers: (process.env.OWNER_NUMBERS || '').split(',')
        .map(normalizePhoneNumber)
        .filter(Boolean),

    ownerName: process.env.OWNER_NAME || 'Owner',

    sudoers: (process.env.SUDO_NUMBERS || '').split(',')
        .map(normalizePhoneNumber)
        .filter(Boolean),

    publicMode: process.env.PUBLIC_MODE === 'true',
    selfMode: process.env.SELF_MODE === 'true',
    autoOnline: process.env.AUTO_ONLINE !== 'false',
    autoRead: process.env.AUTO_READ === 'true',
    autoTyping: process.env.AUTO_TYPING === 'true',
    autoRecording: process.env.AUTO_RECORDING === 'true',

    whitelist: {
        enabled: process.env.WHITELIST_ENABLED === 'true',
        bypassOwners: true,
        bypassSudos: true,
        bypassBotOwner: true
    },

    database: {
        url: process.env.MONGODB_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/ilombot',
        enabled: process.env.DATABASE_ENABLED !== 'false',
        options: {
            maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 5,
            serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 5000,
            socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
            bufferCommands: false,
            autoCreate: false,
            autoIndex: false
        }
    },

    redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },

    server: {
        port: parseInt(process.env.PORT) || 5000,
        host: process.env.HOST || '0.0.0.0',
        cors: process.env.CORS_ENABLED === 'true',
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
            max: parseInt(process.env.RATE_LIMIT_MAX) || 100
        }
    },

    session: {
        sessionId: process.env.SESSION_ID || null,
        sessionPath: process.env.SESSION_PATH || './session'
    },

    features: {
        autoReply: process.env.AUTO_REPLY_ENABLED !== 'false',
        chatBot: process.env.CHAT_BOT_ENABLED === 'true',
        antiSpam: process.env.ANTI_SPAM_ENABLED !== 'false',
        antiLink: process.env.ANTI_LINK_ENABLED !== 'false',
        welcome: process.env.WELCOME_ENABLED !== 'false',
        goodbye: process.env.GOODBYE_ENABLED !== 'false',
        autoSticker: process.env.AUTO_STICKER_ENABLED === 'true',
        autoRead: process.env.AUTO_READ_ENABLED === 'true',
        antiDelete: process.env.ANTI_DELETE_ENABLED !== 'false',
        backup: process.env.AUTO_BACKUP_ENABLED === 'true'
    },

    events: {
        callAutoReject: process.env.EVENT_CALL_AUTO_REJECT !== 'false',
        groupJoin: process.env.EVENT_GROUP_JOIN !== 'false',
        groupLeave: process.env.EVENT_GROUP_LEAVE !== 'false',
        groupUpdate: process.env.EVENT_GROUP_UPDATE !== 'false',
        groupPromote: process.env.EVENT_GROUP_PROMOTE !== 'false',
        groupDemote: process.env.EVENT_GROUP_DEMOTE !== 'false',
        messageReaction: process.env.EVENT_MESSAGE_REACTION !== 'false',
        autoReaction: process.env.EVENT_AUTO_REACTION === 'true',
        levelUp: process.env.EVENT_LEVEL_UP !== 'false',
        contactUpdate: process.env.EVENT_CONTACT_UPDATE === 'true',
        messageUpdate: process.env.EVENT_MESSAGE_UPDATE !== 'false',
        messageDelete: process.env.EVENT_MESSAGE_DELETE !== 'false'
    },

    limits: {
        messageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 4096,
        mediaSize: parseInt(process.env.MAX_MEDIA_SIZE) || 50 * 1024 * 1024,
        commandCooldown: parseInt(process.env.COMMAND_COOLDOWN) || 3,
        maxWarnings: parseInt(process.env.MAX_WARNINGS) || 3,
        tempBanDuration: parseInt(process.env.TEMP_BAN_DURATION) || 3600000
    },

    apis: {
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 150,
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
        },
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        },
        weather: {
            apiKey: process.env.WEATHER_API_KEY,
            provider: process.env.WEATHER_PROVIDER || 'openweathermap'
        },
        news: {
            apiKey: process.env.NEWS_API_KEY,
            country: process.env.NEWS_COUNTRY || 'us',
            category: process.env.NEWS_CATEGORY || 'general'
        },
        translate: {
            apiKey: process.env.TRANSLATE_API_KEY,
            provider: process.env.TRANSLATE_PROVIDER || 'google'
        },
        youtube: { apiKey: process.env.YOUTUBE_API_KEY },
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        },
        qwen: {
            baseURL: process.env.QWEN_API_BASE_URL || '',
            token: process.env.QWEN_TOKEN || process.env.QWEN_API_TOKEN || process.env.QWEN_API_KEY || ''
        },
        groq: {
            apiKey: process.env.GROQ_API_KEY,
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
        }
    },

    economy: {
        enabled: process.env.ECONOMY_ENABLED === 'true',
        startingBalance: parseInt(process.env.STARTING_BALANCE) || 1000,
        dailyAmount: parseInt(process.env.DAILY_AMOUNT) || 100,
        weeklyAmount: parseInt(process.env.WEEKLY_AMOUNT) || 500,
        workCooldown: parseInt(process.env.WORK_COOLDOWN) || 3600000,
        robCooldown: parseInt(process.env.ROB_COOLDOWN) || 7200000,
        currency: {
            name: process.env.CURRENCY_NAME || 'coins',
            symbol: process.env.CURRENCY_SYMBOL || '🪙'
        }
    },

    games: {
        enabled: process.env.GAMES_ENABLED === 'true',
        maxActiveGames: parseInt(process.env.MAX_ACTIVE_GAMES) || 10,
        gameTimeout: parseInt(process.env.GAME_TIMEOUT) || 300000
    },

    media: {
        stickers: {
            packName: process.env.STICKER_PACK_NAME || 'ILOM Bot',
            authorName: process.env.STICKER_AUTHOR_NAME || 'Created by Ilom'
        },
        download: {
            maxFileSize: parseInt(process.env.MAX_DOWNLOAD_SIZE) || 100 * 1024 * 1024,
            allowedFormats: (process.env.ALLOWED_FORMATS || 'mp4,mp3,jpg,png,gif').split(','),
            quality: process.env.DOWNLOAD_QUALITY || 'medium'
        },
        upload: {
            tempPath: process.env.TEMP_UPLOAD_PATH || './temp/uploads',
            maxSize: parseInt(process.env.MAX_UPLOAD_SIZE) || 20 * 1024 * 1024
        }
    },

    security: {
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-key-change-this',
        jwtSecret: process.env.JWT_SECRET || 'jwt-secret-change-this',
        sessionSecret: process.env.SESSION_SECRET || 'session-secret-change-this',
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'localhost').split(',')
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json',
        enableConsole: process.env.LOG_CONSOLE !== 'false',
        enableFile: process.env.LOG_FILE !== 'false'
    },

    localization: {
        defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
        fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
        supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,es,fr,de,pt,ar,hi,zh,ja,ko').split(','),
        autoDetect: process.env.AUTO_DETECT_LANGUAGE === 'true'
    },

    timezone: process.env.TIMEZONE || 'UTC',
    dateFormat: process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss',

    performance: {
        lowResourceMode: process.env.LOW_RESOURCE_MODE !== 'false',
        cacheSize: parseInt(process.env.CACHE_SIZE) || 300,
        cacheTTL: parseInt(process.env.CACHE_TTL) || 1800,
        maxConcurrentCommands: parseInt(process.env.MAX_CONCURRENT_COMMANDS) || 15,
        memoryThreshold: parseFloat(process.env.MEMORY_THRESHOLD) || 0.85
    },

    backup: {
        enabled: process.env.AUTO_BACKUP_ENABLED === 'true',
        interval: parseInt(process.env.BACKUP_INTERVAL) || 86400000,
        maxBackups: parseInt(process.env.MAX_BACKUPS) || 7,
        path: process.env.BACKUP_PATH || './backups'
    },

    notifications: {
        updates: process.env.NOTIFY_UPDATES !== 'false',
        errors: process.env.NOTIFY_ERRORS !== 'false',
        dailyStats: process.env.NOTIFY_DAILY_STATS === 'true',
        telegramEnabled: process.env.TELEGRAM_NOTIFICATIONS === 'true'
    }
};

function validateConfig() {
    if (!config.ownerNumbers || config.ownerNumbers.length === 0) {
        console.warn('  OWNER_NUMBERS not set in .env');
    }
    if (config.security.encryptionKey === 'default-key-change-this') {
        console.warn('  Using default encryption key — set ENCRYPTION_KEY for production');
    }
}

validateConfig();

export default config;
