import axios from 'axios';

export default {
    config: {
        name: 'color',
        aliases: ['colour', 'colorinfo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get info about a color',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}color <hex or name>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('Usage: color <hex code or color name>\nExamples: color #ff5733, color blue');

        const input = args.join(' ');
        try {
            // Use colormind.io or simple hex parsing
            let hex = input;

            // Try name lookup via API
            if (!hex.startsWith('#') && !/^[0-9a-fA-F]{3,8}$/.test(hex)) {
                try {
                    const { data } = await axios.get(`https://www.thecolorapi.com/id?name=${encodeURIComponent(hex)}`, { timeout: 5000 });
                    hex = data.hex?.value || hex;
                } catch {}
            }

            if (!hex.startsWith('#')) hex = '#' + hex;

            // Parse hex to RGB
            const clean = hex.replace('#', '');
            let r, g, b;
            if (clean.length === 3) {
                r = parseInt(clean[0] + clean[0], 16);
                g = parseInt(clean[1] + clean[1], 16);
                b = parseInt(clean[2] + clean[2], 16);
            } else {
                r = parseInt(clean.slice(0, 2), 16);
                g = parseInt(clean.slice(2, 4), 16);
                b = parseInt(clean.slice(4, 6), 16);
            }

            const hsl = rgbToHsl(r, g, b);

            reply([
                `🎨 *Color Info*`,
                '',
                `HEX : ${hex}`,
                `RGB : ${r}, ${g}, ${b}`,
                `HSL : ${hsl}`,
                `Luminance: ${((0.299 * r + 0.587 * g + 0.114 * b) / 255 * 100).toFixed(1)}%`,
            ].join('\n'));
        } catch {
            reply('Could not parse color. Use hex format like #ff5733.');
        }
    },
};

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}
