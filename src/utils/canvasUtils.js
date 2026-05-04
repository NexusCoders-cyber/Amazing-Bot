import { createCanvas, loadImage } from '@napi-rs/canvas';
import axios from 'axios';

async function fetchImage(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
        return await loadImage(Buffer.from(res.data));
    } catch {
        return null;
    }
}

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function circleClip(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
}

async function buildCard({ title, subtitle, label, avatarUrl, bgColor, accentColor }) {
    const W = 700, H = 220;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 16);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const avatarX = 110, avatarY = H / 2, radius = 72;
    ctx.save();
    circleClip(ctx, avatarX, avatarY, radius);
    let avatarDrawn = false;
    if (avatarUrl) {
        const img = await fetchImage(avatarUrl);
        if (img) {
            ctx.drawImage(img, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
            avatarDrawn = true;
        }
    }
    if (!avatarDrawn) {
        const ag = ctx.createRadialGradient(avatarX, avatarY, 0, avatarX, avatarY, radius);
        ag.addColorStop(0, accentColor);
        ag.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = ag;
        ctx.fillRect(avatarX - radius, avatarY - radius, radius * 2, radius * 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((subtitle[0] || '?').toUpperCase(), avatarX, avatarY);
    }
    ctx.restore();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    const tx = 220;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px Sans';
    ctx.fillText(label, tx, 72);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Sans';
    const maxW = W - tx - 30;
    let name = subtitle;
    while (ctx.measureText(name).width > maxW && name.length > 4) name = name.slice(0, -1);
    if (name !== subtitle) name += '...';
    ctx.fillText(name, tx, 118);

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '18px Sans';
    ctx.fillText(title, tx, 158);

    return canvas.toBuffer('image/png');
}

export async function createPromoteImage(userName, groupName, authorName) {
    try {
        return await buildCard({
            title: `Promoted by +${authorName} in ${groupName}`,
            subtitle: `+${userName}`,
            label: 'New Group Admin',
            avatarUrl: null,
            bgColor: '#1a2a1a',
            accentColor: '#4ade80'
        });
    } catch { return null; }
}

export async function createDemoteImage(userName, groupName, authorName) {
    try {
        return await buildCard({
            title: `Demoted by +${authorName} in ${groupName}`,
            subtitle: `+${userName}`,
            label: 'Removed as Admin',
            avatarUrl: null,
            bgColor: '#2a1a1a',
            accentColor: '#f87171'
        });
    } catch { return null; }
}

export async function createGroupUpdateImage(type, oldValue, newValue, authorName) {
    try {
        const W = 700, H = 220;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#16213e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 16);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 22px Sans';
        ctx.fillText(`Group ${type} Changed`, 30, 55);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '18px Sans';
        ctx.fillText('Before:', 30, 95);

        ctx.fillStyle = '#f87171';
        ctx.font = '20px Sans';
        const oldTrunc = String(oldValue || '').slice(0, 40);
        ctx.fillText(oldTrunc, 100, 95);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '18px Sans';
        ctx.fillText('After:', 30, 135);

        ctx.fillStyle = '#4ade80';
        ctx.font = '20px Sans';
        const newTrunc = String(newValue || '').slice(0, 40);
        ctx.fillText(newTrunc, 100, 135);

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '16px Sans';
        ctx.fillText(`Changed by: +${authorName}`, 30, 180);

        return canvas.toBuffer('image/png');
    } catch { return null; }
}

export async function createLevelUpImage(userName, level, currentXp, requiredXp) {
    try {
        const W = 700, H = 200;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#111827');
        grad.addColorStop(1, '#1f2937');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 16);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 38px Sans';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('🎉 LEVEL UP!', 30, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Sans';
        ctx.fillText(String(userName).slice(0, 25), 30, 100);

        ctx.fillStyle = '#d1d5db';
        ctx.font = '22px Sans';
        ctx.fillText(`You reached level ${level}`, 30, 135);

        const barX = 30, barY = 155, barW = W - 60, barH = 22;
        const progress = requiredXp > 0 ? Math.max(0, Math.min(1, currentXp / requiredXp)) : 0;

        ctx.fillStyle = '#374151';
        drawRoundedRect(ctx, barX, barY, barW, barH, 11);
        ctx.fill();

        ctx.fillStyle = '#22c55e';
        drawRoundedRect(ctx, barX, barY, Math.floor(barW * progress), barH, 11);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`${currentXp} / ${requiredXp} XP`, barX + barW / 2, barY + 15);

        return canvas.toBuffer('image/png');
    } catch { return null; }
}

export async function createWelcomeImage(userName, groupName, memberCount, avatarUrl) {
    try {
        const W = 700, H = 220;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#1a2a1a');
        grad.addColorStop(1, '#0f1a0f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 16);
        ctx.stroke();
        ctx.globalAlpha = 1;

        const avatarX = 110, avatarY = H / 2, radius = 72;
        ctx.save();
        circleClip(ctx, avatarX, avatarY, radius);
        let avatarDrawn = false;
        if (avatarUrl) {
            const img = await fetchImage(avatarUrl);
            if (img) {
                ctx.drawImage(img, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
                avatarDrawn = true;
            }
        }
        if (!avatarDrawn) {
            const ag = ctx.createRadialGradient(avatarX, avatarY, 0, avatarX, avatarY, radius);
            ag.addColorStop(0, '#4ade80');
            ag.addColorStop(1, '#1a2a1a');
            ctx.fillStyle = ag;
            ctx.fillRect(avatarX - radius, avatarY - radius, radius * 2, radius * 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 52px Sans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((String(userName || '?')[0]).toUpperCase(), avatarX, avatarY);
        }
        ctx.restore();

        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, radius + 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 22px Sans';
        ctx.fillText('Welcome!', 220, 72);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px Sans';
        const maxW = W - 220 - 30;
        let name = String(userName || '');
        while (ctx.measureText(name).width > maxW && name.length > 4) name = name.slice(0, -1);
        if (name !== String(userName || '')) name += '...';
        ctx.fillText(name, 220, 112);

        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '18px Sans';
        ctx.fillText(String(groupName || '').slice(0, 35), 220, 145);

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '16px Sans';
        ctx.fillText(`Member #${memberCount}`, 220, 172);

        return canvas.toBuffer('image/png');
    } catch { return null; }
}

export async function createGoodbyeImage(userName, groupName, memberCount, avatarUrl) {
    try {
        return await buildCard({
            title: `${groupName} now has ${memberCount} members`,
            subtitle: String(userName || ''),
            label: 'Goodbye 👋',
            avatarUrl,
            bgColor: '#2a1a2a',
            accentColor: '#c084fc'
        });
    } catch { return null; }
}
