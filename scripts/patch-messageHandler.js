import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MH = join(__dirname, '../src/handlers/messageHandler.js');

let src = readFileSync(MH, 'utf8');

const OLD = `import { getStickerActionByHash, getStickerHashFromMessage } from '../utils/stickerVault.js';`;
const NEW = `import { getStickerActionByHash, getStickerHashFromMessage, collectSticker } from '../utils/stickerVault.js';`;

if (src.includes(OLD)) {
    src = src.replace(OLD, NEW);
    writeFileSync(MH, src, 'utf8');
    console.log('✅ messageHandler.js patched — collectSticker import added.');
} else if (src.includes('collectSticker')) {
    console.log('ℹ️  collectSticker already imported. No change needed.');
} else {
    console.log('⚠️  Anchor line not found. Apply this fix manually:');
    console.log('   File: src/handlers/messageHandler.js');
    console.log('   Find:    import { getStickerActionByHash, getStickerHashFromMessage } from');
    console.log('   Replace: import { getStickerActionByHash, getStickerHashFromMessage, collectSticker } from');
}
