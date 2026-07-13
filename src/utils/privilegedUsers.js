import config from '../config.js';
import { normalizePhone } from './sessionControl.js';
import { getOwners as getPersistentOwners } from './owner.js';

function normalizeJid(value = '') {
    const s = String(value || '').trim();
    const userPart = s.split('@')[0].split(':')[0];
    const fromPhone = normalizePhone(userPart);
    if (fromPhone) return fromPhone;
    const digitsOnly = userPart.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 7) return digitsOnly.slice(-15);
    return userPart.length >= 4 ? userPart : '';
}

function parseJidList(envValue = '') {
    return String(envValue || '').split(',').map(normalizeJid).filter(Boolean);
}

export function getTopOwnerNumbers() {
    const top = normalizeJid(process.env.TOP_OWNER_NUMBER || process.env.TOP_OWNER || '');
    const topList = parseJidList(process.env.TOP_OWNER_NUMBERS || process.env.TOP_OWNERS || '');
    const ownerJids = (config.ownerNumbers || []).map(normalizeJid).filter(Boolean);
    const persistentOwners = getPersistentOwners().map(normalizeJid).filter(Boolean);
    const base = top ? [top, ...ownerJids.filter(n => n !== top)] : ownerJids;
    return [...new Set([...base, ...topList, ...persistentOwners])];
}

export function getPrimaryTopOwner() {
    return getTopOwnerNumbers()[0] || '';
}

export function getSudoNumbers() {
    const sudoers = (config.sudoers || []).map(normalizeJid).filter(Boolean);
    const devJids = parseJidList(process.env.DEVELOPER_NUMBERS || process.env.DEV_NUMBERS || '');
    return [...new Set([...getTopOwnerNumbers(), ...sudoers, ...devJids])];
}

export function isTopOwner(sender = '') {
    const jid = normalizeJid(sender);
    return !!jid && getTopOwnerNumbers().includes(jid);
}

export function isDeveloper(sender = '') {
    const jid = normalizeJid(sender);
    return !!jid && getSudoNumbers().includes(jid);
}

export function getDeveloperNumbers() {
    return getSudoNumbers();
}

export function canUseSensitiveOwnerTools(sender = '') {
    return isTopOwner(sender) || isDeveloper(sender);
}
