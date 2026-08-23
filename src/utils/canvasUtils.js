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

function formatNum(n) {
    return Number(n || 0).toLocaleString('en-US');
}

function getTier(level) {
    if (level >= 100) return { name: 'Diamond', color: '#a78bfa' };
    if (level >= 50) return { name: 'Platinum', color: '#67e8f9' };
    if (level >= 25) return { name: 'Gold', color: '#ffd700' };
    if (level >= 10) return { name: 'Silver', color: '#c0c0c0' };
    return { name: 'Bronze', color: '#cd7f32' };
}

export async function createRankCard({
    name,
    avatarUrl,
    level = 1,
    xpInto = 0,
    xpNeeded = 100,
    percent = 0,
    walletText = '$0',
    bankText = '$0',
    netWorthText = '$0',
    rankPosition = null,
    totalRanked = null,
    groupName = null
}) {
    try {
        const W = 900, H = 300;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');
        const tier = getTier(level);

        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, '#1a1a2e');
        bgGrad.addColorStop(1, '#0a0a14');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        const avatarX = 150, avatarY = 150, radius = 85;

        ctx.save();
        ctx.globalAlpha = 0.25;
        const glow = ctx.createRadialGradient(avatarX, avatarY, 20, avatarX, avatarY, 220);
        glow.addColorStop(0, tier.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        ctx.strokeStyle = tier.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.35;
        drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 20);
        ctx.stroke();
        ctx.globalAlpha = 1;

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
            ag.addColorStop(0, tier.color);
            ag.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = ag;
            ctx.fillRect(avatarX - radius, avatarY - radius, radius * 2, radius * 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 64px Sans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((name?.[0] || '?').toUpperCase(), avatarX, avatarY);
        }
        ctx.restore();

        ctx.strokeStyle = tier.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();

        const tierLabel = tier.name.toUpperCase();
        ctx.font = 'bold 16px Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tierY = avatarY + radius + 26;
        const tierW = ctx.measureText(tierLabel).width + 28;
        drawRoundedRect(ctx, avatarX - tierW / 2, tierY - 14, tierW, 28, 14);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = tier.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = tier.color;
        ctx.fillText(tierLabel, avatarX, tierY);

        const tx = 280;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Sans';
        const maxNameW = 320;
        const rawName = name || 'Player';
        let displayName = rawName;
        while (ctx.measureText(displayName).width > maxNameW && displayName.length > 3) {
            displayName = displayName.slice(0, -1);
        }
        if (displayName !== rawName) displayName += '...';
        ctx.fillText(displayName, tx, 68);

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '18px Sans';
        ctx.fillText(groupName ? `Level ${level} · ${groupName}` : `Level ${level}`, tx, 96);

        if (rankPosition) {
            ctx.textAlign = 'right';
            ctx.fillStyle = tier.color;
            ctx.font = 'bold 40px Sans';
            ctx.fillText(`#${rankPosition}`, W - 40, 62);
            ctx.font = '15px Sans';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(totalRanked ? `of ${formatNum(totalRanked)}` : 'RANK', W - 40, 84);
            ctx.textAlign = 'left';
        }

        const barX = tx, barY = 130, barW = W - tx - 40, barH = 30;
        drawRoundedRect(ctx, barX, barY, barW, barH, barH / 2);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();

        const clampedPercent = Math.min(Math.max(percent, 0), 1);
        if (clampedPercent > 0) {
            const fillW = Math.max(barH, barW * clampedPercent);
            const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
            barGrad.addColorStop(0, tier.color);
            barGrad.addColorStop(1, '#ffffff');
            ctx.save();
            drawRoundedRect(ctx, barX, barY, barW, barH, barH / 2);
            ctx.clip();
            ctx.fillStyle = barGrad;
            ctx.fillRect(barX, barY, fillW, barH);
            ctx.restore();
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, barX, barY, barW, barH, barH / 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${formatNum(xpInto)} / ${formatNum(xpNeeded)} XP`, barX + barW / 2, barY + barH / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        const statY = 210;
        const stats = [
            { icon: '💰', label: 'WALLET', value: walletText },
            { icon: '🏦', label: 'BANK', value: bankText },
            { icon: '💎', label: 'NET WORTH', value: netWorthText }
        ];
        const statW = (W - tx - 40) / stats.length;
        stats.forEach((s, i) => {
            const sx = tx + i * statW;
            ctx.font = '22px Sans';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${s.icon} ${s.value}`, sx, statY + 24);
            ctx.font = '13px Sans';
            ctx.fillStyle = 'rgba(255,255,255,0.45)';
            ctx.fillText(s.label, sx, statY + 44);
        });

        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '12px Sans';
        ctx.textAlign = 'right';
        ctx.fillText('AmazingBot', W - 20, H - 16);

        return canvas.toBuffer('image/png');
    } catch { return null; }
}
