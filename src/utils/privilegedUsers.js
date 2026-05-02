import config from '../config.js';
import { normalizePhone } from './sessionControl.js';

function toDigits(value = '') {
    return normalizePhone(value);
}

function parseEnvList(envValue = '') {
    return String(envValue || '')
        .split(',')
        .map((item) => toDigits(item.trim()))
        .filter(Boolean);
}

export function getTopOwnerNumbers() {
    const fromEnvOwners = parseEnvList(process.env.OWNER_NUMBERS || '');
    const fromEnvSudo = parseEnvList(process.env.SUDO_NUMBERS || '');
    const fromEnvDev = parseEnvList(process.env.DEVELOPER_NUMBERS || process.env.DEV_NUMBERS || '');
    const fromEnvTop = toDigits(process.env.TOP_OWNER_NUMBER || process.env.TOP_OWNER || '');
    const fromConfig = (config.ownerNumbers || []).map((x) => toDigits(x)).filter(Boolean);
    const fromConfigSudo = (config.sudoers || []).map((x) => toDigits(x)).filter(Boolean);

    const all = new Set([
        ...fromConfig,
        ...fromConfigSudo,
        ...fromEnvOwners,
        ...fromEnvSudo,
        ...fromEnvDev,
    ]);

    if (fromEnvTop) all.add(fromEnvTop);

    return [...all].filter(Boolean);
}

export function getPrimaryTopOwner() {
    const top = toDigits(process.env.TOP_OWNER_NUMBER || process.env.TOP_OWNER || '');
    if (top) return top;
    return getTopOwnerNumbers()[0] || '';
}

export function getDeveloperNumbers() {
    return getTopOwnerNumbers();
}

export function isTopOwner(sender = '') {
    const digits = toDigits(sender);
    if (!digits) return false;
    return getTopOwnerNumbers().includes(digits);
}

export function isDeveloper(sender = '') {
    return isTopOwner(sender);
}

export function canUseSensitiveOwnerTools(sender = '') {
    return isTopOwner(sender);
}
