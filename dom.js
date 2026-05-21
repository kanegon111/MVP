'use strict';

function getDomRefs() {
  const dateInput = document.getElementById('date');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetBtn');
  const bgmVolume = document.getElementById('bgmVolume');
  const pushupInput = document.getElementById('pushupInput');
  const squatInput  = document.getElementById('squatInput');
  const situpInput  = document.getElementById('situpInput');
  const pullupInput = document.getElementById('pullupInput');

  const logBody = document.getElementById('logBody');
  const totalsPanel = document.getElementById('totalsPanel');
  const calendar = document.getElementById('calendar');

  const weeklyTotal = document.getElementById('weeklyTotal');
  const weeklyByEx  = document.getElementById('weeklyByEx');

  const avatar = document.getElementById('avatar');
  const upperBody = document.getElementById('upperBody');
  const head   = document.getElementById('head');
  const torso  = document.getElementById('torso');
  const absG   = document.getElementById('abs');

  // 腕：上腕＋前腕（肘関節）
  const armLUpper = document.getElementById('armLUpper');
  const armLFore  = document.getElementById('armLFore');
  const armRUpper = document.getElementById('armRUpper');
  const armRFore  = document.getElementById('armRFore');

  // 脚：太もも＋すね（膝関節）
  const legLUpper = document.getElementById('legLUpper');
  const legLLower = document.getElementById('legLLower');
  const legRUpper = document.getElementById('legRUpper');
  const legRLower = document.getElementById('legRLower');

  const refs = {
    dateInput, runBtn, resetBtn, bgmVolume,
    pushupInput, squatInput, situpInput, pullupInput,
    logBody, totalsPanel, calendar, weeklyTotal, weeklyByEx,
    avatar, upperBody, head, torso, absG,
    armLUpper, armLFore, armRUpper, armRFore,
    legLUpper, legLLower, legRUpper, legRLower,
  };
  if (Object.values(refs).some(el => !el)) throw new Error('初期化に必要なDOM要素が見つかりません');
  return refs;
}

function resetAvatarPose(refs) {
  refs.upperBody.setAttribute('transform', '');
  refs.head.setAttribute('transform', 'translate(50,28)');
  refs.torso.setAttribute('transform', 'translate(46,50)');
  refs.absG.setAttribute('transform', 'translate(49,80)');

  refs.armLUpper.setAttribute('transform', 'translate(38,52)');
  refs.armLFore.setAttribute('transform', 'translate(0,14)');
  refs.armRUpper.setAttribute('transform', 'translate(73,52)');
  refs.armRFore.setAttribute('transform', 'translate(0,14)');

  refs.legLUpper.setAttribute('transform', 'translate(50,96)');
  refs.legLLower.setAttribute('transform', 'translate(0,12)');
  refs.legRUpper.setAttribute('transform', 'translate(62,96)');
  refs.legRLower.setAttribute('transform', 'translate(0,12)');
}
