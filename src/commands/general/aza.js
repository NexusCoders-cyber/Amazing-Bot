import axios from 'axios';
import { canUseSensitiveOwnerTools } from '../../utils/privilegedUsers.js';

export default {
    name: 'aza',
    aliases: ['donate', 'support', 'thanks', 'accolade'],
    category: 'general',
    description: 'Support our project by donating',
    usage: 'aza',
    cooldown: 3,

    async execute({ sock, message, from, sender }) {
        const isTop = canUseSensitiveOwnerTools(sender);
        const donationInfo = process.env.DONATION_INFO || 'Contact the owner for donation details';

        let caption = '🙏 *Support Our Project*\n\n';
        caption += donationInfo + '\n\n';

        if (isTop) {
            caption += `👑 *ACCOLADE — TOP OWNER/DEV*\n`;
            caption += `🌟 Thank you for your leadership and support!\n`;
            caption += `⚡ You're the backbone of this project!\n\n`;
        }

        caption += `✨ Thank you for supporting our project! ❤️`;

        try {
            const { data } = await axios.get(
                `https://apis.prexzyvilla.site/writetext?text=${encodeURIComponent('Thank You! Support Us')}`,
                { responseType: 'arraybuffer', timeout: 12000 }
            );
            await sock.sendMessage(from, {
                image: Buffer.from(data),
                caption
            }, { quoted: message });
        } catch {
            await sock.sendMessage(from, { text: caption }, { quoted: message });
        }
    }
};
