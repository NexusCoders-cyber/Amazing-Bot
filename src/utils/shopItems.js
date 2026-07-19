export const ITEMS = [
    {
        id: 'shield',
        name: 'Shield',
        emoji: '🛡️',
        price: 500,
        description: 'Protects you from being robbed for 24 hours',
        type: 'timed',
        duration: 86400000
    },
    {
        id: 'pickaxe',
        name: 'Pickaxe',
        emoji: '⛏️',
        price: 300,
        description: 'Earn +50% from work for 8 hours',
        type: 'timed',
        duration: 28800000
    },
    {
        id: 'laptop',
        name: 'Laptop',
        emoji: '💻',
        price: 1200,
        description: 'Earn +100% from work for 12 hours',
        type: 'timed',
        duration: 43200000
    },
    {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        emoji: '🍀',
        price: 800,
        description: '+50% bonus on your next daily claim (1 use)',
        type: 'consumable',
        uses: 1
    },
    {
        id: 'coffee',
        name: 'Coffee',
        emoji: '☕',
        price: 150,
        description: 'Cut your work cooldown by 10 minutes (1 use)',
        type: 'consumable',
        uses: 1
    },
    {
        id: 'lottery',
        name: 'Lottery Ticket',
        emoji: '🎟️',
        price: 100,
        description: 'Scratch for a chance to win up to 10,000 coins (1 use)',
        type: 'consumable',
        uses: 1
    },
    {
        id: 'bank_upgrade',
        name: 'Bank Upgrade',
        emoji: '🏦',
        price: 3000,
        description: 'Permanently increase your bank capacity by 25,000',
        type: 'permanent'
    },
    {
        id: 'vault',
        name: 'Vault',
        emoji: '🔐',
        price: 8000,
        description: 'Permanently increase your bank capacity by 100,000',
        type: 'permanent'
    },
    {
        id: 'ring',
        name: 'Diamond Ring',
        emoji: '💍',
        price: 5000,
        description: 'Prestige item — displayed on your profile',
        type: 'cosmetic'
    },
    {
        id: 'crown',
        name: 'Crown',
        emoji: '👑',
        price: 15000,
        description: 'Rarest prestige item — flex on everyone',
        type: 'cosmetic'
    }
];

export function getItem(id) {
    return ITEMS.find(i => i.id === id) || null;
}

export function findItem(query) {
    const q = query.toLowerCase();
    return ITEMS.find(i => i.id === q || i.name.toLowerCase() === q) || null;
}
