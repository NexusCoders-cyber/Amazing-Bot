import fs from 'fs';
import path from 'path';
import config from '../config.js';

const OWNERS_FILE = path.join(process.cwd(), 'owners.json');

function strip(v) {
    const s = String(v || '').replace(/[^0-9]/g, '');
    return s.length >= 7 ? s : '';
}

function stripJid(jid) {
    return strip(String(jid || '').split('@')[0].split(':')[0]);
}

function envOwners() {
    return [...config.ownerNumbersRaw];
}

function envSudoers() {
    return [
        ...envOwners(),
        ...config.sudoNumbersRaw
    ];
}

function fileOwners() {
    try {
        const data = JSON.parse(fs.readFileSync(OWNERS_FILE, 'utf8'));
        return Array.isArray(data) ? data.map(stripJid).filter(Boolean) : [];
    } catch {
        return [];
    }
}

export function getTopOwnerNumbers() {
    return [...new Set([...envOwners(), ...fileOwners()])];
}

export function getPrimaryTopOwner() {
    return getTopOwnerNumbers()[0] || '';
}

export function getSudoNumbers() {
    return [...new Set([...getTopOwnerNumbers(), ...envSudoers()])];
}

export function isTopOwner(sender = '') {
    const num = strip(sender);
    return !!num && getTopOwnerNumbers().includes(num);
}

export function isDeveloper(sender = '') {
    const num = strip(sender);
    return !!num && getSudoNumbers().includes(num);
}

export function getDeveloperNumbers() {
    return getSudoNumbers();
}

export function canUseSensitiveOwnerTools(sender = '') {
    return isTopOwner(sender) || isDeveloper(sender);
}
