import mongoose from 'mongoose';
import { economyStorage } from '../utils/economyStorage.js';

const UserSchema = new mongoose.Schema({
    jid: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, index: true },
    name: { type: String, default: 'User' },
    profilePicture: { type: String, default: null },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    isBlocked: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: null },
    banUntil: { type: Date, default: null },
    bannedBy: { type: String, default: null },
    bannedAt: { type: Date, default: null },
    isPremium: { type: Boolean, default: false },
    premiumUntil: { type: Date, default: null },
    premiumType: { type: String, enum: ['basic', 'pro', 'unlimited', null], default: null },
    economy: {
        balance: { type: Number, default: 1000 },
        bank: { type: Number, default: 0 },
        diamonds: { type: Number, default: 0 },
        stars: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        rank: { type: String, default: 'Beginner' },
        dailyStreak: { type: Number, default: 0 },
        lastDaily: { type: Date, default: null },
        lastWeekly: { type: Date, default: null },
        lastMonthly: { type: Date, default: null },
        lastWork: { type: Date, default: null },
        transactions: [{
            type: { type: String },
            amount: Number,
            description: String,
            timestamp: { type: Date, default: Date.now }
        }]
    },
    gameStats: {
        gamesPlayed: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 }
    },
    statistics: {
        commandsUsed: { type: Number, default: 0 },
        messagesSent: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now },
        joinedAt: { type: Date, default: Date.now }
    },
    afk: {
        isAfk: { type: Boolean, default: false },
        reason: { type: String, default: null },
        since: { type: Date, default: null }
    },
    warnings: [{
        reason: String,
        warnedBy: String,
        warnedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true, versionKey: false });

let User;
try {
    User = mongoose.model('User');
} catch {
    User = mongoose.model('User', UserSchema);
}

const isDatabaseConnected = () => {
    return mongoose.connection.readyState === 1 && !mongoose.connection.simulated;
};

async function getUser(jid) {
    if (!jid) return null;
    if (isDatabaseConnected()) {
        try {
            return await User.findOne({ jid }).maxTimeMS(5000).lean();
        } catch {}
    }
    return await economyStorage.getUser(jid);
}

async function createUser(userData) {
    if (!userData?.jid) return null;
    if (isDatabaseConnected()) {
        try {
            const existing = await User.findOne({ jid: userData.jid });
            if (existing) return existing;
            const user = new User({
                ...userData,
                phone: userData.phone || userData.jid.split('@')[0]
            });
            return await user.save();
        } catch {}
    }
    return await economyStorage.createUser(userData);
}

async function updateUser(jid, updateData) {
    if (!jid) return null;
    if (isDatabaseConnected()) {
        try {
            return await User.findOneAndUpdate(
                { jid },
                updateData,
                { new: true, upsert: true, maxTimeMS: 5000 }
            );
        } catch {}
    }
    return await economyStorage.updateUser(jid, updateData);
}

async function deleteUser(jid) {
    if (!jid) return { deletedCount: 0 };
    if (isDatabaseConnected()) {
        try {
            const result = await User.findOneAndDelete({ jid });
            return result ? { deletedCount: 1 } : { deletedCount: 0 };
        } catch {}
    }
    return { deletedCount: 1 };
}

async function getUserStats() {
    if (isDatabaseConnected()) {
        try {
            const total = await User.countDocuments();
            const premium = await User.countDocuments({ isPremium: true });
            const banned = await User.countDocuments({ isBanned: true });
            const active = await User.countDocuments({
                'statistics.lastActive': { $gte: new Date(Date.now() - 86400000) }
            });
            return { total, premium, banned, active };
        } catch {}
    }
    const users = await economyStorage.getAllUsers({}, Infinity, 0);
    const oneDayAgo = Date.now() - 86400000;
    return {
        total: users.length,
        premium: users.filter(u => u.isPremium).length,
        banned: users.filter(u => u.isBanned).length,
        active: users.filter(u => new Date(u.statistics?.lastActive || 0).getTime() >= oneDayAgo).length
    };
}

async function getAllUsers(filter = {}, limit = 100, skip = 0) {
    if (isDatabaseConnected()) {
        try {
            return await User.find(filter)
                .select('jid phone name isPremium isBanned statistics.lastActive createdAt')
                .sort({ 'statistics.lastActive': -1 })
                .skip(skip)
                .limit(limit);
        } catch {}
    }
    return await economyStorage.getAllUsers(filter, limit, skip);
}

async function countUsers(filter = {}) {
    if (isDatabaseConnected()) {
        try {
            return await User.countDocuments(filter);
        } catch {}
    }
    return await economyStorage.countUsers(filter);
}

async function getUserEconomy(jid) {
    if (!jid) return null;
    if (isDatabaseConnected()) {
        try {
            const user = await User.findOne({ jid }).select('economy').maxTimeMS(5000).lean();
            return user ? user.economy : null;
        } catch {}
    }
    const user = await economyStorage.getUser(jid);
    return user ? user.economy : null;
}

async function updateUserEconomy(jid, economyData) {
    if (!jid) return null;
    const updateFields = {};
    for (const [key, value] of Object.entries(economyData)) {
        updateFields[`economy.${key}`] = value;
    }
    if (isDatabaseConnected()) {
        try {
            return await User.findOneAndUpdate(
                { jid },
                { $set: updateFields },
                { new: true, upsert: true, maxTimeMS: 5000 }
            );
        } catch {}
    }
    return await economyStorage.updateUser(jid, updateFields);
}

async function createUserEconomy(data) {
    if (!data?.jid) return null;
    const jid = data.jid;
    const defaults = {
        jid,
        phone: data.phone || jid.split('@')[0],
        name: data.name || 'User',
        economy: {
            balance: data.balance ?? 1000,
            bank: data.bank ?? 0,
            diamonds: data.diamonds ?? 0,
            stars: data.stars ?? 0,
            level: data.level ?? 1,
            xp: data.xp ?? 0,
            rank: 'Beginner',
            dailyStreak: 0,
            lastDaily: data.lastDaily ?? null,
            lastWeekly: data.lastWeekly ?? null,
            lastMonthly: data.lastMonthly ?? null,
            lastWork: data.lastWork ?? null,
            transactions: []
        }
    };

    if (isDatabaseConnected()) {
        try {
            return await User.findOneAndUpdate(
                { jid },
                { $setOnInsert: defaults },
                { new: true, upsert: true, maxTimeMS: 5000 }
            );
        } catch {}
    }
    return await economyStorage.createUser(defaults);
}

export default User;
export {
    User,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    getAllUsers,
    countUsers,
    getUserEconomy,
    updateUserEconomy,
    createUserEconomy
};
