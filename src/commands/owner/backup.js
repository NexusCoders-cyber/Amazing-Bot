import backupService from '../../services/backupService.js';

export default {
    name: 'backup',
    aliases: ['save', 'export'],
    category: 'owner',
    description: 'Create system backup of bot data and configuration (Owner Only)',
    usage: 'backup [full|session|media|logs|config]',
    cooldown: 300,
    permissions: ['owner'],
    ownerOnly: true,

    async execute({ sock, message, args, from, sender }) {
        try {
            const backupType = (args[0] || 'full').toLowerCase();
            const validTypes = ['full', 'config', 'media', 'session', 'logs'];

            if (!validTypes.includes(backupType)) {
                return await sock.sendMessage(from, {
                    text: `❌ *Invalid backup type: "${backupType}"*\n\nValid types:\n• full — Complete backup (default)\n• session — Auth session only\n• config — Config files only\n• media — Media files only\n• logs — Log files only\n\nExample: backup full`
                }, { quoted: message });
            }

            await sock.sendMessage(from, {
                text: `💾 *Creating ${backupType.toUpperCase()} backup...*\n\nPlease wait, this may take a moment.`
            }, { quoted: message });

            const result = await backupService.createBackup(backupType);

            const sizeMB = (result.size / 1024 / 1024).toFixed(2);

            await sock.sendMessage(from, {
                text: `✅ *Backup Complete*\n\n📦 Type: ${backupType.toUpperCase()}\n📁 File: ${result.name}\n💾 Size: ${sizeMB} MB\n📅 Created: ${new Date(result.createdAt).toLocaleString()}\n\nBackup saved to: backups/`
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ *Backup Failed*\n\nError: ${error.message}\n\nCheck disk space and permissions then try again.`
            }, { quoted: message });
        }
    }
};
