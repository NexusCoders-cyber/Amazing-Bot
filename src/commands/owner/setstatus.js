export default {
    name: 'setstatus',
    aliases: ['changestatus', 'updatebio'],
    category: 'owner',
    description: 'Set bot WhatsApp status/bio (Owner Only)',
    usage: 'setstatus <text>',
    cooldown: 30,
    permissions: ['owner'],
    ownerOnly: true,
    args: true,
    minArgs: 1,

    async execute({ sock, message, args, from, sender }) {
        try {
            const newStatus = args.join(' ');

            if (newStatus.length > 139) {
                return sock.sendMessage(from, {
                    text: `❌ Status too long (${newStatus.length}/139 chars). Please shorten it.`
                }, { quoted: message });
            }

            await sock.updateProfileStatus(newStatus);

            await sock.sendMessage(from, {
                text: `✅ *Status Updated*\n\n📝 New status:\n${newStatus}\n\n📊 Length: ${newStatus.length}/139 characters`
            }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Failed to update status: ${error.message}`
            }, { quoted: message });
        }
    }
};
