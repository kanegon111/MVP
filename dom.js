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
  const radarCanvas = document.getElementById('radarChart');

  const avatar = document.getElementById('avatar');

  const refs = {
    dateInput, runBtn, resetBtn, bgmVolume,
    pushupInput, squatInput, situpInput, pullupInput,
    logBody, totalsPanel, calendar, weeklyTotal, weeklyByEx, radarCanvas,
    avatar,
  };
  if (Object.values(refs).some(el => !el)) throw new Error('初期化に必要なDOM要素が見つかりません');
  return refs;
}

function resetAvatarPose(refs) {
  const v = refs.avatar;
  if (!v) return;
  try { v.pause(); } catch (e) {}
  try { v.currentTime = 0; } catch (e) {}
  v.loop = false;
}
