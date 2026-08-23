import os from 'os';
import moment from 'moment';
export default {
    config: {
        name: 'botinfo',
        aliases: ['info', 'about', 'bi'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Bot system information',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}botinfo' },
    },
    async onStart({ reply, AmazingBot }) {
        const mem = process.memoryUsage();
        const cpu = os.cpus()[0]?.model || 'Unknown';
        const ram = `${(mem.heapUsed / 1024 / 1024).toFixed(1)} / ${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`;
        reply([
            `AmazingBot by Raphael Ilom`,
            ``,
            `Platform : ${process.platform}`,
            `Node.js  : ${process.version}`,
            `Arch     : ${os.arch()}`,
            `CPU      : ${cpu}`,
            `RAM      : ${ram}`,
            `Date     : ${moment().format('DD/MM/YYYY HH:mm:ss')}`,
            `onReply  : ${AmazingBot?.onReply?.size || 0} active`,
            `onChat   : ${AmazingBot?.onChat?.length || 0} active`,
        ].join('\n'));
    },
};
