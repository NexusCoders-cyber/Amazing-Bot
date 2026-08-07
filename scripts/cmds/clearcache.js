import { isDev } from '../../src/utils/devAccess.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'clearcache',
        aliases: ['cc', 'cleanup'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Clear bot cache and temp files (dev only)',
        category: 'owner',
        coolDown: 30,
        role: 0,
        guide: { en: '{prefix}clearcache' },
    },

    async onStart({ reply, sender, React }) {
        React('🧹');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        try {
            let cleared = 0;

            // Clear /tmp files older than 1 hour
            try {
                execSync('find /tmp -maxdepth 1 -type f -mmin +60 -delete 2>/dev/null', { timeout: 10000 });
                cleared++;
            } catch {}

            // Clear node_modules/.cache
            const cacheDirs = [
                'node_modules/.cache',
                '.cache',
                'tmp',
            ];
            for (const dir of cacheDirs) {
                const fullPath = path.join(process.cwd(), dir);
                if (fs.existsSync(fullPath)) {
                    fs.rmSync(fullPath, { recursive: true, force: true });
                    cleared++;
                }
            }

            // Force garbage collection if available
            if (global.gc) global.gc();

            const mem = process.memoryUsage();
            reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  🧹 *CACHE CLEARED*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  🗑️ Items cleared: ${cleared}`,
                `  💾 Memory now: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
