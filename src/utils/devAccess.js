// Developer-only access control
// Only these two numbers can use dev-level commands

const DEV_NUMBERS = new Set([
    '23408120478393',
    '2347075663318',
]);

export function isDev(sender) {
    const num = String(sender || '').replace(/@.*$/, '').split(':')[0].replace(/[^0-9]/g, '');
    return DEV_NUMBERS.has(num);
}

export function getDevs() {
    return [...DEV_NUMBERS];
}
