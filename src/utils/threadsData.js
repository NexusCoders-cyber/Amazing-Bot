import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadBlob, saveBlob, isDatabaseConnected } from './persistentStore.js';

const __filename = fileURLToPath(import.meta.url);
const DATA_FILE = path.join(path.dirname(path.dirname(path.dirname(__filename))), 'data', 'threads.json');
const STORE_KEY = 'store:threads';

let _data = null;
let _dirty = false;
let _hydrationPromise = null;

function ensureHydrated() {
    if (!_hydrationPromise) _hydrationPromise = hydrateFromMongo();
    return _hydrationPromise;
}

function load() {
    if (_data) return _data;
    try {
        fs.ensureDirSync(path.dirname(DATA_FILE));
        _data = fs.existsSync(DATA_FILE) ? fs.readJsonSync(DATA_FILE) : {};
    } catch (err) {
        console.error('[threadsData] Failed to read data file, starting fresh:', err.message);
        _data = {};
    }
    return _data;
}

async function hydrateFromMongo() {
    if (!isDatabaseConnected()) return;
    try {
        const remote = await loadBlob(STORE_KEY);
        if (remote && typeof remote === 'object') {
            _data = { ..._data, ...remote };
            _dirty = true;
            console.log(`[threadsData] Hydrated ${Object.keys(remote).length} thread(s) from MongoDB`);
        }
    } catch (err) {
        console.error('[threadsData] MongoDB hydration failed:', err.message);
    }
}

function save() {
    if (!_dirty || !_data) return;
    try {
        fs.ensureDirSync(path.dirname(DATA_FILE));
        fs.writeJsonSync(DATA_FILE, _data, { spaces: 2 });
        _dirty = false;
    } catch (err) {
        console.error('[threadsData] Failed to write data file:', err.message);
    }
    saveBlob(STORE_KEY, _data).catch(() => {});
}

setInterval(save, 3000);
process.on('exit', save);
process.on('SIGINT', () => { save(); process.exit(0); });
process.on('SIGTERM', () => { save(); process.exit(0); });

function cleanId(id) {
    return String(id || '').split('@')[0].split(':')[0];
}

function defaultThread(id) {
    return {
        threadID: id,
        threadName: '',
        adminIDs: [],
        participantIDs: [],
        imageSrc: null,
        emoji: null,
        data: {},
        settings: {
            language: 'en',
            antilink: false,
            antispam: true,
            welcome: { enabled: false, message: 'Welcome {name}!' },
            goodbye: { enabled: false, message: 'Goodbye {name}!' },
        },
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

const threadsData = {
    async create(threadID, info = {}) {
        const id = cleanId(threadID);
        if (!id) return null;
        const data = load();
        await ensureHydrated();
        if (!data[id]) {
            data[id] = {
                ...defaultThread(id),
                threadName: info.subject || '',
                adminIDs: (info.participants || []).filter(p => p.admin).map(p => cleanId(p.id)),
                participantIDs: (info.participants || []).map(p => cleanId(p.id)),
                imageSrc: info.profilePictureUrl || null,
            };
            _dirty = true;
        }
        return data[id];
    },

    async get(threadID) {
        const id = cleanId(threadID);
        if (!id) return null;
        const data = load();
        await ensureHydrated();
        if (!data[id]) { data[id] = defaultThread(id); _dirty = true; }
        return data[id];
    },

    async getAll() {
        const data = load();
        await ensureHydrated();
        return Object.values(data);
    },

    async set(threadID, updateData, dotPath = null) {
        const id = cleanId(threadID);
        if (!id) return null;
        const data = load();
        await ensureHydrated();
        if (!data[id]) data[id] = defaultThread(id);
        if (dotPath) {
            pathSet(data[id], dotPath, updateData);
        } else {
            Object.assign(data[id], updateData);
        }
        data[id].updatedAt = Date.now();
        _dirty = true;
        return data[id];
    },

    async refreshInfo(threadID, info = {}) {
        const id = cleanId(threadID);
        if (!id) return;
        const data = load();
        if (!data[id]) data[id] = defaultThread(id);
        const updates = {};
        if (info.subject && info.subject !== data[id].threadName) updates.threadName = info.subject;
        if (info.participants) {
            updates.adminIDs = info.participants.filter(p => p.admin).map(p => cleanId(p.id));
            updates.participantIDs = info.participants.map(p => cleanId(p.id));
        }
        if (info.profilePictureUrl) updates.imageSrc = info.profilePictureUrl;
        if (Object.keys(updates).length) await this.set(threadID, updates);
    },

    async remove(threadID) {
        const id = cleanId(threadID);
        if (!id) return;
        const data = load();
        delete data[id];
        _dirty = true;
        save();
    },

    async getSetting(threadID, key) {
        const thread = await this.get(threadID);
        return thread?.settings?.[key] ?? null;
    },

    async setSetting(threadID, key, value) {
        const thread = await this.get(threadID);
        const settings = { ...(thread?.settings || {}), [key]: value };
        return await this.set(threadID, { settings });
    },

    flush: () => { _dirty = true; save(); },
};

export default threadsData;
