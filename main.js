'use strict';

const DEFAULT_BGM_TRACKS = [
  'パイレーツオブカリヴィアン.mp3',
  'bgm2.mp3',
  'bgm3.mp3',
  'bgm4.mp3',
  'kintorebgm5.mp3',
  'kintore6.mp3',
  'kintorer7.mp3',
];
const BGM_TRACKS = (window.BGM_FILES && Array.isArray(window.BGM_FILES) && window.BGM_FILES.length)
  ? window.BGM_FILES
  : DEFAULT_BGM_TRACKS;

function playSE(){
  try {
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type='square';
    osc.frequency.value = 140;
    const now = ac.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now+0.18);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(now+0.2);
  } catch(e) { console.warn('SE失敗', e); }
}

function labelOf(ex){ return ({pushup:'腕立て伏せ',squat:'スクワット',situp:'腹筋',pullup:'懸垂'})[ex]||ex; }

function renderTotals(state, totalsPanel){
  const t = state.totals; const p = getPartLevels(t);
  totalsPanel.innerHTML = `
    <div class="cell"><div class="small">腕立て伏せ</div><div class="level">${t.pushup}回</div></div>
    <div class="cell"><div class="small">スクワット</div><div class="level">${t.squat}回</div></div>
    <div class="cell"><div class="small">腹筋</div><div class="level">${t.situp}回</div></div>
    <div class="cell"><div class="small">懸垂</div><div class="level">${t.pullup}回</div></div>
    <div class="cell"><div class="small">部位レベル（腕）</div><div class="level">Lv${p.arms}</div></div>
    <div class="cell"><div class="small">部位レベル（胸）</div><div class="level">Lv${p.chest}</div></div>
    <div class="cell"><div class="small">部位レベル（背中）</div><div class="level">Lv${p.back}</div></div>
    <div class="cell"><div class="small">部位レベル（腹）</div><div class="level">Lv${p.abs}</div></div>
    <div class="cell"><div class="small">部位レベル（脚）</div><div class="level">Lv${p.legs}</div></div>`;
}

function renderLog(state, logBody){
  logBody.innerHTML = state.log.map(r=>`<tr><td>${r.date}</td><td>${labelOf(r.exercise)}</td><td>${r.reps}</td></tr>`).join('');
}

function toLocalDateString(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function renderCalendar(state, dateInput, calendar){
  const now = dateInput.value ? new Date(dateInput.value) : new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1);
  const startDow = (first.getDay()+7)%7; // 0:日
  const days = new Date(y, m+1, 0).getDate();
  const todayStr = toLocalDateString(new Date());
  const byDate = {};
  for(const r of state.log){ byDate[r.date] = (byDate[r.date]||0) + r.reps; }
  const header = ['日','月','火','水','木','金','土'].map(d=>`<div class="cell dow">${d}</div>`).join('');
  let cells = Array(startDow).fill('<div class="cell"></div>').join('');
  for(let d=1; d<=days; d++){
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const total = byDate[ds]||0;
    const todayCls = ds===todayStr ? ' today' : '';
    cells += `<div class="cell${todayCls}"><div class="d">${d}</div><div class="total">${total>0?total+'回':''}</div></div>`;
  }
  calendar.innerHTML = header + cells;
}

function drawWeekly(state, dateInput, weeklyTotal, weeklyByEx){
  const end = dateInput.value ? new Date(dateInput.value + 'T00:00:00') : new Date();
  end.setHours(0,0,0,0);
  const dates=[]; const map={};
  for(let i=6;i>=0;i--){
    const d = new Date(end);
    d.setDate(end.getDate()-i);
    const ds = toLocalDateString(d);
    dates.push(ds);
    map[ds] = {pushup:0,squat:0,situp:0,pullup:0};
  }
  for(const r of state.log){ if(map[r.date]) map[r.date][r.exercise]+=r.reps; }
  const totals = dates.map(ds=>map[ds].pushup+map[ds].squat+map[ds].situp+map[ds].pullup);
  barChart(weeklyTotal, totals, dates);
  stackedChart(weeklyByEx, dates, map);
}

function ensureBgm(){
  // 既存があればランダム選曲だけ適用して終了
  const existing = document.getElementById('bgm');
  const BGM_INDEX_KEY = 'bgmIndex';

  const pick = (i) => BGM_TRACKS[i % BGM_TRACKS.length];

  // 直前インデックスを極力避けてランダム選択
  const pickRandomIndex = (excludeIndex) => {
    const len = BGM_TRACKS.length;
    if (len <= 1) return 0;
    let idx = Math.floor(Math.random() * len);
    if (Number.isFinite(excludeIndex) && excludeIndex >= 0 && idx === excludeIndex) {
      idx = (idx + 1) % len; // 直前と同じならひとつずらす
    }
    return idx;
  };

  const setRandomSrc = (audio) => {
    const len = BGM_TRACKS.length;
    let prev = Number(localStorage.getItem(BGM_INDEX_KEY));
    if (!Number.isFinite(prev)) prev = -1;
    let idx = pickRandomIndex(prev);
    const tried = new Set();

    const trySet = () => {
      tried.add(idx);
      const src = pick(idx);
      audio.src = src;
      audio.dataset.trackIndex = String(idx);

      // 成功時にインデックスを保存
      const onLoaded = () => {
        localStorage.setItem(BGM_INDEX_KEY, String(idx));
        audio.removeEventListener('loadeddata', onLoaded);
      };
      audio.addEventListener('loadeddata', onLoaded, { once: true });

      // 失敗時は未試行の別曲へフォールバック
      const onError = () => {
        audio.removeEventListener('error', onError);
        if (tried.size >= len) {
          return; // 全て失敗なら諦め
        }
        let nextIdx = pickRandomIndex(prev);
        let guard = 0;
        while (tried.has(nextIdx) && guard < len) { nextIdx = pickRandomIndex(prev); guard++; }
        if (tried.has(nextIdx)) {
          // 念のため残りの中から未試行を線形探索
          for (let i = 0; i < len; i++) { if (!tried.has(i)) { nextIdx = i; break; } }
        }
        idx = nextIdx;
        trySet();
      };
      audio.addEventListener('error', onError);
    };
    trySet();
  };

  if (existing) {
    setRandomSrc(existing);
    window.bgm = existing;
    return;
  }

  const bgm = document.createElement('audio');
  bgm.id = 'bgm';
  bgm.volume = 0.5;
  bgm.preload = 'auto';
  setRandomSrc(bgm);
  document.body.appendChild(bgm);
  window.bgm = bgm;
}

// エントリ
document.addEventListener('DOMContentLoaded', () => {
  ensureBgm();
  const refs = getDomRefs();
  const state = load() || { totals: { pushup: 0, squat: 0, situp: 0, pullup: 0 }, log: [] };

  // 音量初期化
  if (window.bgm) {
    window.bgm.volume = Number(refs.bgmVolume.value);
    refs.bgmVolume.addEventListener('input', (e) => {
      window.bgm.volume = Number(e.target.value);
    });
  }

  // 今日を初期値（ローカル日付）
  refs.dateInput.value = toLocalDateString(new Date());

  const rerenderAll = () => {
    renderTotals(state, refs.totalsPanel);
    renderLog(state, refs.logBody);
    renderCalendar(state, refs.dateInput, refs.calendar);
    drawWeekly(state, refs.dateInput, refs.weeklyTotal, refs.weeklyByEx);
    radarChart(refs.radarCanvas, getPartLevels(state.totals), 4);
    applyHypertrophy(state.totals, refs);
  };

  rerenderAll();

  // 実行イベント
  refs.runBtn.addEventListener('click', async () => {
    const date = refs.dateInput.value || toLocalDateString(new Date());
    const inputs = [
      ['pushup', Number(refs.pushupInput.value)||0],
      ['squat',  Number(refs.squatInput.value)||0],
      ['situp',  Number(refs.situpInput.value)||0],
      ['pullup', Number(refs.pullupInput.value)||0],
    ];

    playSE();

    for (const [ex, reps] of inputs) {
      if (reps > 0) {
        state.totals[ex] += reps;
        state.log.unshift({ date, exercise: ex, reps });
      }
    }
    save(state);
    rerenderAll();

    const seq = inputs.filter(([,r])=>r>0);
    refs.runBtn.disabled = true;
    let bgmPrevLoop;
    if (window.bgm && seq.length > 0) {
      bgmPrevLoop = window.bgm.loop;
      window.bgm.loop = true;
      if (window.bgm.paused) window.bgm.play();
    }
    const totalReps = seq.reduce((s, [, r]) => s + Math.min(r, 50), 0);
    if (totalReps > 0) {
      await playAnimation(totalReps, refs);
    }
    if (seq.length > 0) resetAvatarPose(refs);
    if (window.bgm && seq.length > 0) {
      window.bgm.pause();
      window.bgm.currentTime = 0;
      window.bgm.loop = bgmPrevLoop ?? false;
    }
    rerenderAll();
    refs.runBtn.disabled = false;
    [refs.pushupInput, refs.squatInput, refs.situpInput, refs.pullupInput].forEach(i=>i.value='');
  });

  // リセット
  refs.resetBtn.addEventListener('click', () => {
    if(!confirm('全ての回数とログ、アバター成長をリセットします。よろしいですか？')) return;
    state.totals = { pushup: 0, squat: 0, situp: 0, pullup: 0 };
    state.log = [];
    save(state);
    // 次回ロードの曲順を最初に戻す
    localStorage.removeItem('bgmIndex');
    resetAvatarPose(refs);
    rerenderAll();
    if (window.bgm) { window.bgm.pause(); window.bgm.currentTime = 0; window.bgm.loop = false; }
  });
});
