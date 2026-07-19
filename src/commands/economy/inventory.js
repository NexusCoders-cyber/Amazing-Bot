import { getEco, saveEco, cleanEffects, fmtTime } from '../../utils/economyDB.js';

export default {
    name: 'inventory',
    aliases: ['inv', 'bag', 'items'],
    category: 'economy',
    description: 'View your inventory and active effects.',
    usage: 'inventory',
    example: 'inventory',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, from, sender, prefix }) {
        const eco = getEco(sender);
        const now = Date.now();

        const cleaned = cleanEffects(eco);
        if (cleaned.length !== (eco.activeEffects || []).length) {
            saveEco(sender, { activeEffects: cleaned });
        }

        const inventory = eco.inventory || [];
        const activeEffects = cleaned;

        let text = `🎒 *Inventory*\n\n`;

        if (inventory.length === 0) {
            text += `📭 Your inventory is empty.\n`;
        } else {
            text += `📦 *Items (${inventory.length})*\n`;
            inventory.forEach(item => {
                text += `  ${item.emoji || '📦'} *${item.name}* — x${item.quantity || 1}\n`;
            });
        }

        text += `\n`;

        if (activeEffects.length === 0) {
            text += `⚡ *Active Effects*\nNone`;
        } else {
            text += `⚡ *Active Effects (${activeEffects.length})*\n`;
            activeEffects.forEach(e => {
                const left = Math.max(0, e.expiresAt - now);
                const mins = Math.floor(left / 60000);
                const hrs = Math.floor(mins / 60);
                const timeStr = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
                text += `  • ${e.id} — ${timeStr} remaining\n`;
            });
        }

        if (inventory.length > 0) {
            text += `\n💡 Use *${prefix}use <item>* to activate an item.`;
        }

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
