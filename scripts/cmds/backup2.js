import { isDev } from '../../src/utils/devAccess.js';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'backup',
        aliases: ['backupbot', 'bk'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Backup bot files (dev only)',
        category: 'owner',
        coolDown: 60,
        role: 0,
        guide: { en: '{prefix}backup' },
    },

    async onStart({ reply, sender, prefix, React }) {
        React('📦');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        try {
            const backupDir = path.join(process.cwd(), 'backups');
            if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const backupPath = path.join(backupDir, `backup_${timestamp}`);

            // Key files/dirs to backup
            const items = ['src', 'scripts', 'package.json', '.env', 'data'];
            let filesCopied = 0;

            for (const item of items) {
                const srcPath = path.join(process.cwd(), item);
                if (!fs.existsSync(srcPath)) continue;

                const destPath = path.join(backupPath, item);
                if (fs.statSync(srcPath).isDirectory()) {
                    fs.cpSync(srcPath, destPath, { recursive: true });
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
                filesCopied++;
            }

            // Create tar.gz
            const { execSync } = await import('child_process');
            const archivePath = `${backupPath}.tar.gz`;
            execSync(`tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`, { timeout: 60000 });
            fs.rmSync(backupPath, { recursive: true });

            const stats = fs.statSync(archivePath);

            reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  📦 *BACKUP COMPLETE*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  📁 Path: ${archivePath}`,
                `  💾 Size: ${(stats.size / 1024).toFixed(1)} KB`,
                `  📂 Items: ${filesCopied}`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        } catch (err) {
            reply(`❌ Backup failed: ${err.message}`);
        }
    },
};
