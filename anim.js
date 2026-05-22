'use strict';

const ANIM_PER_REP_MS = 600;
const MAX_VIDEO_LOOPS = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getVideoDurationMs(video) {
  if (video && isFinite(video.duration) && video.duration > 0) {
    return video.duration * 1000;
  }
  return null;
}

async function ensureVideoMetadata(video, timeoutMs = 1500) {
  if (getVideoDurationMs(video) != null) return;
  await new Promise(resolve => {
    let settled = false;
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    video.addEventListener('loadedmetadata', finish, { once: true });
    setTimeout(finish, timeoutMs);
  });
}

async function playAnimation(totalReps, refs) {
  const video = refs.avatar;
  if (!video || totalReps <= 0) return;

  await ensureVideoMetadata(video);

  const requestedMs = ANIM_PER_REP_MS * totalReps;
  const videoMs = getVideoDurationMs(video);
  const maxMs = videoMs != null ? videoMs * MAX_VIDEO_LOOPS : Infinity;
  const durationMs = Math.min(requestedMs, maxMs);

  try {
    video.loop = true;
    video.currentTime = 0;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (e) {}

  await sleep(durationMs);
}
