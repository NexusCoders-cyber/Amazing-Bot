import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const DATA_FILE = path.join(path.dirname(path.dirname(path.dirname(__filename))), 'data', 'users.json');

let _data = null;
let _dirty = false;

function load() {
    if (_data) return _data;
    try {
        fs.ensureDirSync(path.dirname(DATA_FILE));
        _data = fs.existsSync(DATA_FILE) ? fs.readJsonSync(DATA_FILE) : {};
    } catch (err) {
        console.error('[usersData] Failed to read data file, starting fresh:', err.message);
        _data = {};
    }
    return _data;
}

function save() {
    if (!_dirty || !_data) return;
    try {
        fs.ensureDirSync(path.dirname(DATA_FILE));
        fs.writeJsonSync(DATA_FILE, _data, { spaces: 2 });
        _dirty = false;
    } catch (err) {
        console.error('[usersData] Failed to write data file:', err.message);
    }
}

setInterval(save, 3000);
process.on('exit', save);
process.on('SIGINT', () => { save(); process.exit(0); });
process.on('SIGTERM', () => { save(); process.exit(0); });

function cleanId(id) {
    return String(id || '').replace(/[^0-9]/g, '').split(':')[0];
}

function defaultUser(id) {
    return {
        userID: id,
        name: '',
        gender: null,
        vanity: null,
        avatarUrl: null,
        data: {},
        exp: 0,
        money: 0,
        banned: false,
        premium: false,
        language: 'en',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

function pathSet(obj, dotPath, value) {
    const keys = String(dotPath).split('.');
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
        cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
}

const usersData = {
    async create(userID, userInfo = {}) {
        const id = cleanId(userID);
        if (!id) return null;
        const data = load();
        if (!data[id]) {
            data[id] = { ...defaultUser(id), name: userInfo.name || '', gender: userInfo.gender || null };
            _dirty = true;
        }
        return data[id];
    },

    async get(userID) {
        const id = cleanId(userID);
        if (!id) return null;
        const data = load();
        if (!data[id]) { data[id] = defaultUser(id); _dirty = true; }
        return data[id];
    },

    async getAll() {
        return Object.values(load());
    },

    async set(userID, updateData, dotPath = null) {
        const id = cleanId(userID);
        if (!id) return null;
        const data = load();
        if (!data[id]) data[id] = defaultUser(id);
        if (dotPath) {
            pathSet(data[id], dotPath, updateData);
        } else {
            Object.assign(data[id], updateData);
        }
        data[id].updatedAt = Date.now();
        _dirty = true;
        return data[id];
    },

    async getName(userID) {
        const user = await this.get(userID);
        return user?.name || cleanId(userID) || 'Unknown';
    },

    async getAvatarUrl(userID) {
        const user = await this.get(userID);
        return user?.avatarUrl || null;
    },

    async refreshInfo(userID, info = {}) {
        const id = cleanId(userID);
        if (!id) return;
        const data = load();
        if (!data[id]) data[id] = defaultUser(id);
        const updates = {};
        if (info.name && info.name !== data[id].name) updates.name = info.name;
        if (info.gender) updates.gender = info.gender;
        if (info.vanity) updates.vanity = info.vanity;
        if (info.avatarUrl) updates.avatarUrl = info.avatarUrl;
        if (Object.keys(updates).length) await this.set(userID, updates);
    },

    async remove(userID) {
        const id = cleanId(userID);
        if (!id) return;
        const data = load();
        delete data[id];
        _dirty = true;
        save();
    },

    async addExp(userID, amount) {
        const user = await this.get(userID);
        if (!user) return null;
        return await this.set(userID, { exp: (user.exp || 0) + Number(amount) });
    },

    async addMoney(userID, amount) {
        const user = await this.get(userID);
        if (!user) return null;
        return await this.set(userID, { money: (user.money || 0) + Number(amount) });
    },

    async subtractMoney(userID, amount) {
        const user = await this.get(userID);
        if (!user) return null;
        return await this.set(userID, { money: Math.max(0, (user.money || 0) - Number(amount)) });
    },

    flush: () => { _dirty = true; save(); },
};

export default usersData;
