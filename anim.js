'use strict';

const ANIM_PER_REP_MS = 600;

/* --- ユーティリティ --- */
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function lerp(a, b, t) { return a + (b - a) * t; }

/** duration(ms) の間、0→1 のイージング値を onUpdate に渡す */
function tween(duration, onUpdate) {
  return new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
      const raw = Math.min(1, (now - start) / duration);
      onUpdate(easeInOut(raw));
      if (raw < 1) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
}

/** translate + rotate(angle, px, py) を一括設定 */
function setJoint(el, tx, ty, angle, px, py) {
  if (angle !== 0) {
    el.setAttribute('transform', `translate(${tx},${ty}) rotate(${angle},${px},${py})`);
  } else {
    el.setAttribute('transform', `translate(${tx},${ty})`);
  }
}

/* ========================================================
   各種目のアニメーション（1レップ = downフェーズ + upフェーズ）
   ======================================================== */

async function animPushup(refs) {
  const half = ANIM_PER_REP_MS / 2;

  // --- down: 肘を曲げて体を沈める ---
  await tween(half, t => {
    const shoulder = lerp(0, -30, t);
    const elbow    = lerp(0, 45, t);
    const dip      = lerp(0, 5, t);
    const nod      = lerp(0, 4, t);

    setJoint(refs.armLUpper, 38, 52 + dip, shoulder, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbow, 4, 0);
    setJoint(refs.armRUpper, 73, 52 + dip, -shoulder, 5, 0);
    setJoint(refs.armRFore,  0, 14, -elbow, 4, 0);

    refs.torso.setAttribute('transform', `translate(46,${50 + dip})`);
    refs.absG.setAttribute('transform',  `translate(49,${80 + dip})`);
    refs.head.setAttribute('transform',  `translate(50,${28 + dip}) rotate(${nod},10,9)`);
  });

  // --- up: 腕を伸ばして体を持ち上げる ---
  await tween(half, t => {
    const shoulder = lerp(-30, 0, t);
    const elbow    = lerp(45, 0, t);
    const dip      = lerp(5, 0, t);
    const nod      = lerp(4, 0, t);

    setJoint(refs.armLUpper, 38, 52 + dip, shoulder, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbow, 4, 0);
    setJoint(refs.armRUpper, 73, 52 + dip, -shoulder, 5, 0);
    setJoint(refs.armRFore,  0, 14, -elbow, 4, 0);

    refs.torso.setAttribute('transform', `translate(46,${50 + dip})`);
    refs.absG.setAttribute('transform',  `translate(49,${80 + dip})`);
    refs.head.setAttribute('transform',  `translate(50,${28 + dip}) rotate(${nod},10,9)`);
  });
}

async function animSquat(refs) {
  const half = ANIM_PER_REP_MS / 2;

  // --- down: しゃがむ ---
  await tween(half, t => {
    const thigh = lerp(0, 28, t);
    const knee  = lerp(0, -52, t);
    const drop  = lerp(0, 12, t);
    const lean  = lerp(0, 4, t);
    const armFwd  = lerp(0, -28, t);
    const elbowFwd = lerp(0, -15, t);

    setJoint(refs.legLUpper, 50, 96, -thigh, 4, 0);
    setJoint(refs.legLLower, 0, 12, knee, 4, 0);
    setJoint(refs.legRUpper, 62, 96, thigh, 5, 0);
    setJoint(refs.legRLower, 0, 12, -knee, 4, 0);

    refs.upperBody.setAttribute('transform', `translate(0,${drop})`);
    refs.torso.setAttribute('transform', `translate(46,50) rotate(${lean},14,15)`);
    refs.head.setAttribute('transform',  `translate(50,28) rotate(${lean},10,9)`);

    setJoint(refs.armLUpper, 38, 52, armFwd, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbowFwd, 4, 0);
    setJoint(refs.armRUpper, 73, 52, armFwd, 5, 0);
    setJoint(refs.armRFore,  0, 14, elbowFwd, 4, 0);
  });

  // --- up: 立ち上がる ---
  await tween(half, t => {
    const thigh = lerp(28, 0, t);
    const knee  = lerp(-52, 0, t);
    const drop  = lerp(12, 0, t);
    const lean  = lerp(4, 0, t);
    const armFwd  = lerp(-28, 0, t);
    const elbowFwd = lerp(-15, 0, t);

    setJoint(refs.legLUpper, 50, 96, -thigh, 4, 0);
    setJoint(refs.legLLower, 0, 12, knee, 4, 0);
    setJoint(refs.legRUpper, 62, 96, thigh, 5, 0);
    setJoint(refs.legRLower, 0, 12, -knee, 4, 0);

    refs.upperBody.setAttribute('transform', `translate(0,${drop})`);
    refs.torso.setAttribute('transform', `translate(46,50) rotate(${lean},14,15)`);
    refs.head.setAttribute('transform',  `translate(50,28) rotate(${lean},10,9)`);

    setJoint(refs.armLUpper, 38, 52, armFwd, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbowFwd, 4, 0);
    setJoint(refs.armRUpper, 73, 52, armFwd, 5, 0);
    setJoint(refs.armRFore,  0, 14, elbowFwd, 4, 0);
  });
}

async function animSitup(refs) {
  const half = ANIM_PER_REP_MS / 2;

  // --- curl up: 体幹を丸める ---
  await tween(half, t => {
    const curl    = lerp(0, -18, t);
    const absCurl = lerp(0, -8, t);
    const headCurl = lerp(0, -12, t);
    const legTense = lerp(0, 5, t);

    refs.torso.setAttribute('transform', `translate(46,50) rotate(${curl},14,30)`);
    refs.absG.setAttribute('transform',  `translate(49,80) rotate(${absCurl},11,0)`);
    refs.head.setAttribute('transform',  `translate(50,28) rotate(${headCurl + curl * 0.3},10,9)`);

    setJoint(refs.legLUpper, 50, 96, -legTense, 4, 0);
    setJoint(refs.legRUpper, 62, 96, legTense, 5, 0);
  });

  // --- lower: 戻す ---
  await tween(half, t => {
    const curl    = lerp(-18, 0, t);
    const absCurl = lerp(-8, 0, t);
    const headCurl = lerp(-12, 0, t);
    const legTense = lerp(5, 0, t);

    refs.torso.setAttribute('transform', `translate(46,50) rotate(${curl},14,30)`);
    refs.absG.setAttribute('transform',  `translate(49,80) rotate(${absCurl},11,0)`);
    refs.head.setAttribute('transform',  `translate(50,28) rotate(${headCurl + curl * 0.3},10,9)`);

    setJoint(refs.legLUpper, 50, 96, -legTense, 4, 0);
    setJoint(refs.legRUpper, 62, 96, legTense, 5, 0);
  });
}

async function animPullup(refs) {
  const half = ANIM_PER_REP_MS / 2;

  // --- pull up: 体を引き上げる ---
  await tween(half, t => {
    const shoulderL = lerp(0, -130, t);
    const elbowL    = lerp(0, 70, t);
    const shoulderR = lerp(0, 130, t);
    const elbowR    = lerp(0, -70, t);
    const rise      = lerp(0, -8, t);
    const headTilt  = lerp(0, -3, t);
    const legSway   = 3 * Math.sin(t * Math.PI);

    setJoint(refs.armLUpper, 38, 52, shoulderL, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbowL, 4, 0);
    setJoint(refs.armRUpper, 73, 52, shoulderR, 5, 0);
    setJoint(refs.armRFore,  0, 14, elbowR, 4, 0);

    refs.upperBody.setAttribute('transform', `translate(0,${rise})`);
    refs.head.setAttribute('transform', `translate(50,28) rotate(${headTilt},10,9)`);

    setJoint(refs.legLUpper, 50, 96, legSway, 4, 0);
    setJoint(refs.legRUpper, 62, 96, -legSway, 5, 0);
  });

  // --- lower: 下ろす ---
  await tween(half, t => {
    const shoulderL = lerp(-130, 0, t);
    const elbowL    = lerp(70, 0, t);
    const shoulderR = lerp(130, 0, t);
    const elbowR    = lerp(-70, 0, t);
    const rise      = lerp(-8, 0, t);
    const headTilt  = lerp(-3, 0, t);
    const legSway   = 3 * Math.sin((1 - t) * Math.PI);

    setJoint(refs.armLUpper, 38, 52, shoulderL, 4, 0);
    setJoint(refs.armLFore,  0, 14, elbowL, 4, 0);
    setJoint(refs.armRUpper, 73, 52, shoulderR, 5, 0);
    setJoint(refs.armRFore,  0, 14, elbowR, 4, 0);

    refs.upperBody.setAttribute('transform', `translate(0,${rise})`);
    refs.head.setAttribute('transform', `translate(50,28) rotate(${headTilt},10,9)`);

    setJoint(refs.legLUpper, 50, 96, legSway, 4, 0);
    setJoint(refs.legRUpper, 62, 96, -legSway, 5, 0);
  });
}

/* --- メインエントリ --- */
async function playAnimation(ex, reps, refs) {
  const animFn = { pushup: animPushup, squat: animSquat, situp: animSitup, pullup: animPullup }[ex];
  if (!animFn) return;

  for (let i = 0; i < reps; i++) {
    await animFn(refs);
  }
  resetAvatarPose(refs);
}
