'use strict';

const CHART_EX_KEYS = ['pushup', 'squat', 'situp', 'pullup'];
const CHART_COLORS = {
  pushup: '#8ab4f8',
  squat:  '#7ee787',
  situp:  '#f7c843',
  pullup: '#f28b82',
};
const CHART_LABELS_JA = {
  pushup: '腕立て',
  squat:  'スクワット',
  situp:  '腹筋',
  pullup: '懸垂',
};

function _initCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 280;
  const cssH = canvas.clientHeight || 140;
  canvas.width  = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.max(1, Math.round(cssH * dpr));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);
  return { ctx, w: cssW, h: cssH };
}

function _formatDate(ds) {
  const parts = String(ds).split('-');
  if (parts.length !== 3) return ds;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

function _niceMax(v) {
  if (v <= 1) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const norm = v / base;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * base;
}

function _drawAxis(ctx, x, y, plotW, plotH, max, ticks = 4) {
  ctx.strokeStyle = '#2a2e44';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#9aa1c7';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= ticks; i++) {
    const ty = y + plotH * (1 - i / ticks);
    const tickVal = Math.round((max * i) / ticks);
    ctx.beginPath();
    ctx.moveTo(x, ty);
    ctx.lineTo(x + plotW, ty);
    ctx.stroke();
    ctx.fillText(String(tickVal), x - 4, ty);
  }
}

function barChart(canvas, values, labels) {
  const { ctx, w, h } = _initCanvas(canvas);

  const padL = 26, padR = 8, padT = 12, padB = 20;
  const plotW = Math.max(1, w - padL - padR);
  const plotH = Math.max(1, h - padT - padB);

  const max = _niceMax(Math.max(1, ...values));
  _drawAxis(ctx, padL, padT, plotW, plotH, max);

  const n = values.length;
  const slotW = plotW / n;
  const barW = Math.min(28, slotW * 0.6);

  values.forEach((v, i) => {
    const x = padL + slotW * i + (slotW - barW) / 2;
    const bh = (v / max) * plotH;
    const y = padT + plotH - bh;

    ctx.fillStyle = v > 0 ? '#6ae3ff' : '#2a2e44';
    ctx.fillRect(x, y, barW, Math.max(v > 0 ? 1 : 0, bh));

    if (v > 0) {
      ctx.fillStyle = '#e6e9ff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(v), x + barW / 2, y - 2);
    }

    ctx.fillStyle = '#9aa1c7';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(_formatDate(labels[i]), x + barW / 2, padT + plotH + 4);
  });
}

function radarChart(canvas, partLevels, maxLevel = 4) {
  const { ctx, w, h } = _initCanvas(canvas);

  const axes = [
    { key: 'arms',  label: '腕' },
    { key: 'chest', label: '胸' },
    { key: 'back',  label: '背中' },
    { key: 'abs',   label: '腹' },
    { key: 'legs',  label: '脚' },
  ];
  const n = axes.length;
  const cx = w / 2;
  const cy = h / 2 + 6;
  const radius = Math.min(w, h) / 2 - 26;
  const rings = maxLevel;

  // 多角形のグリッド
  ctx.strokeStyle = '#2a2e44';
  ctx.lineWidth = 1;
  for (let r = 1; r <= rings; r++) {
    const rr = (radius * r) / rings;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + rr * Math.cos(a);
      const y = cy + rr * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 各軸の放射線
  ctx.strokeStyle = '#2a2e44';
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
    ctx.stroke();
  }

  // データのポリゴン
  const points = axes.map((ax, i) => {
    const lv = Math.max(0, Math.min(maxLevel, partLevels[ax.key] || 0));
    const rr = (radius * lv) / maxLevel;
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a), lv };
  });

  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(106, 227, 255, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#6ae3ff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // データポイント
  ctx.fillStyle = '#6ae3ff';
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 軸ラベル
  ctx.fillStyle = '#e6e9ff';
  ctx.font = '11px sans-serif';
  ctx.textBaseline = 'middle';
  axes.forEach((ax, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const lx = cx + (radius + 14) * Math.cos(a);
    const ly = cy + (radius + 14) * Math.sin(a);
    const cos = Math.cos(a);
    if (Math.abs(cos) < 0.2) ctx.textAlign = 'center';
    else if (cos > 0) ctx.textAlign = 'left';
    else ctx.textAlign = 'right';
    ctx.fillText(`${ax.label} Lv${partLevels[ax.key] || 0}`, lx, ly);
  });

  // 最大レベル表示（右上）
  ctx.fillStyle = '#666c8c';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`max Lv${maxLevel}`, w - 4, 4);
}

function stackedChart(canvas, dates, map) {
  const { ctx, w, h } = _initCanvas(canvas);

  const padL = 26, padR = 8, padT = 26, padB = 20;
  const plotW = Math.max(1, w - padL - padR);
  const plotH = Math.max(1, h - padT - padB);

  const totals = dates.map(ds => CHART_EX_KEYS.reduce((s, k) => s + (map[ds]?.[k] || 0), 0));
  const max = _niceMax(Math.max(1, ...totals));

  // 凡例
  ctx.font = '10px sans-serif';
  ctx.textBaseline = 'middle';
  let lx = padL;
  const ly = 6;
  CHART_EX_KEYS.forEach(k => {
    ctx.fillStyle = CHART_COLORS[k];
    ctx.fillRect(lx, ly + 3, 8, 8);
    ctx.fillStyle = '#9aa1c7';
    ctx.textAlign = 'left';
    ctx.fillText(CHART_LABELS_JA[k], lx + 12, ly + 7);
    lx += 12 + ctx.measureText(CHART_LABELS_JA[k]).width + 10;
  });

  _drawAxis(ctx, padL, padT, plotW, plotH, max);

  const n = dates.length;
  const slotW = plotW / n;
  const barW = Math.min(28, slotW * 0.6);

  dates.forEach((ds, i) => {
    const x = padL + slotW * i + (slotW - barW) / 2;
    let yBase = padT + plotH;

    CHART_EX_KEYS.forEach(k => {
      const v = map[ds]?.[k] || 0;
      if (v <= 0) return;
      const bh = (v / max) * plotH;
      ctx.fillStyle = CHART_COLORS[k];
      ctx.fillRect(x, yBase - bh, barW, bh);
      yBase -= bh;
    });

    if (totals[i] > 0) {
      ctx.fillStyle = '#e6e9ff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(totals[i]), x + barW / 2, yBase - 2);
    }

    ctx.fillStyle = '#9aa1c7';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(_formatDate(ds), x + barW / 2, padT + plotH + 4);
  });
}
