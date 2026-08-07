export default {
    config: {
        name: 'jetlagcalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .jetlagcalc <timezones_crossed>nExample: .jetlagcalc 7n(use a negative ',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jetlagcalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const zonesCrossed = parseInt(args[0]);
            if (isNaN(zonesCrossed)) return reply('Usage: .jetlagcalc <timezones_crossed>\nExample: .jetlagcalc 7\n(use a negative number for traveling west)');
            const days = Math.ceil(Math.abs(zonesCrossed) / (zonesCrossed > 0 ? 1.5 : 1));
            reply(`🛫 Crossing ${Math.abs(zonesCrossed)} timezone(s) ${zonesCrossed > 0 ? 'eastward' : 'westward'}:\nEstimated recovery time: *~${days} day(s)*\n\nTip: eastward travel is typically harder to adjust to than westward.`);
        
    },
};
