'use strict';

const STORAGE_KEY = 'avatar-training-v1';
const LEVEL_THRESHOLDS = [0, 50, 200, 500, 1000];

function load(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){ return null; }
}

function save(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function toLevel(total){ let lv=0; for(let i=0;i<LEVEL_THRESHOLDS.length;i++){ if(total>=LEVEL_THRESHOLDS[i]) lv=i; } return lv; }

function getPartLevels(t){
  const chest = t.pushup;
  const back  = t.pullup;
  const arms  = t.pushup + t.pullup;
  const abs   = t.situp;
  const legs  = t.squat;
  return { chest: toLevel(chest), back: toLevel(back), arms: toLevel(arms), abs: toLevel(abs), legs: toLevel(legs) };
}
