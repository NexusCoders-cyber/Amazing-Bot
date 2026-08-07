export default {
    config: {
        name: 'calc',
        aliases: ['calculate', 'math'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Simple calculator',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}calc <expression>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('Usage: calc <expression>\nExample: calc 2 + 2 * 3');

        const expr = args.join(' ');

        // Sanitize: only allow numbers, operators, parentheses, dots, spaces
        if (/[^0-9+\-*/().%\s^]/.test(expr)) {
            return reply('Invalid characters in expression. Only numbers and operators allowed.');
        }

        try {
            // Replace ^ with ** for exponent
            const sanitized = expr.replace(/\^/g, '**');
            // Use Function constructor for safe eval (math only)
            const result = new Function(`"use strict"; return (${sanitized})`)();

            if (typeof result !== 'number' || isNaN(result)) {
                return reply('Invalid expression.');
            }

            reply([
                `🔢 *Calculator*`,
                '',
                `\`${expr}\``,
                `= *${Number.isInteger(result) ? result : result.toFixed(6).replace(/\.?0+$/, '')}*`,
            ].join('\n'));
        } catch {
            reply('Could not evaluate expression. Check syntax.');
        }
    },
};
