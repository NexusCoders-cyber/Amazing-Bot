import { updateGroup } from '../../models/Group.js';

export default {
    name: 'welcome',
    aliases: ['welcometext', 'setwelcome'],
    category: 'admin',
    description: 'Toggle welcome messages or set custom welcome text',
    usage: 'welcome [on/off] [custom message]',
    cooldown: 5,
    permissions: ['admin'],

    async execute({ sock, message, args, from, user, group, isGroup, isGroupAdmin, prefix }) {
        if (!isGroup) {
            return await sock.sendMessage(from, {
                text: '❌ *Group Only*\n\nThis command can only be used in groups.'
            }, { quoted: message });
        }

        if (!isGroupAdmin) {
            return await sock.sendMessage(from, {
                text: '❌ *Admin Only*\n\nYou need group admin privileges to use this command.'
            }, { quoted: message });
        }

        try {
            const action = args[0]?.toLowerCase();
            const currentStatus = group?.settings?.welcome?.enabled || false;
            const currentMessage = group?.settings?.welcome?.message || 'Welcome to the group, @user! 👋';

            if (!action) {
                return await sock.sendMessage(from, {
                    text: `👋 *Welcome Settings*\n\n*Status:* ${currentStatus ? 'Enabled ✅' : 'Disabled ❌'}\n*Message:* ${currentMessage}\n\n*Usage:*\n• ${prefix}welcome on/off\n• ${prefix}welcome set Your message here\n\n*Variables:*\n• @user - User mention\n• @group - Group name`
                }, { quoted: message });
            }

            if (action === 'on' || action === 'enable' || action === '1') {
                await updateGroup(from, {
                    $set: { 'settings.welcome.enabled': true }
                });

                return await sock.sendMessage(from, {
                    text: '✅ *Welcome Messages Enabled*\n\nNew members will receive welcome messages when they join.'
                }, { quoted: message });

            } else if (action === 'off' || action === 'disable' || action === '0') {
                await updateGroup(from, {
                    $set: { 'settings.welcome.enabled': false }
                });

                return await sock.sendMessage(from, {
                    text: '❌ *Welcome Messages Disabled*\n\nNew members will not receive welcome messages.'
                }, { quoted: message });

            } else if (action === 'set' || action === 'message') {
                const customMessage = args.slice(1).join(' ');
                if (!customMessage) {
                    return await sock.sendMessage(from, {
                        text: `❌ *No Message*\n\nPlease provide a custom welcome message.\n\n*Usage:* ${prefix}welcome set Welcome @user to @group!`
                    }, { quoted: message });
                }

                await updateGroup(from, {
                    $set: {
                        'settings.welcome.message': customMessage,
                        'settings.welcome.enabled': true
                    }
                });

                return await sock.sendMessage(from, {
                    text: `✅ *Custom Welcome Message Set*\n\n*New Message:* ${customMessage}\n\nWelcome messages are now enabled with your custom text.`
                }, { quoted: message });

            } else if (action === 'test') {
                const testMessage = currentMessage
                    .replace('@user', `@${message.key.participant?.split('@')[0] || 'testuser'}`)
                    .replace('@group', (await sock.groupMetadata(from)).subject);

                return await sock.sendMessage(from, {
                    text: `🧪 *Welcome Message Test*\n\n${testMessage}`,
                    mentions: [message.key.participant || from]
                }, { quoted: message });

            } else {
                return await sock.sendMessage(from, {
                    text: `❌ *Invalid Option*\n\nUse: ${prefix}welcome on/off, ${prefix}welcome set [message], or ${prefix}welcome test`
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Welcome command error:', error);
            await sock.sendMessage(from, {
                text: '❌ *Error*\n\nFailed to update welcome settings.'
            }, { quoted: message });
        }
    }
};
