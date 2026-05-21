'use strict';

function applyHypertrophy(totals, refs) {
  const p = getPartLevels(totals);
  const s = lv => (1 + [0, .06, .12, .20, .28][lv]);

  const torsoScale = Math.max(s(p.chest), s(p.back));
  refs.torso.setAttribute('transform', `translate(46,50) scale(${torsoScale})`);
  refs.absG.setAttribute('transform', `translate(49,80) scale(${s(p.abs)})`);

  const armScale = s(p.arms);
  refs.armLUpper.setAttribute('transform', `translate(38,52) scale(${armScale})`);
  refs.armRUpper.setAttribute('transform', `translate(73,52) scale(${armScale})`);

  const legScale = s(p.legs);
  refs.legLUpper.setAttribute('transform', `translate(50,96) scale(${legScale})`);
  refs.legRUpper.setAttribute('transform', `translate(62,96) scale(${legScale})`);
}
