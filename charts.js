'use strict';

function barChart(canvas, values, labels){
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth * devicePixelRatio;
  const h = canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.clearRect(0,0,w,h);
  const max = Math.max(1, ...values);
  const barW = w/(values.length*1.4);
  values.forEach((v,i)=>{
    const x = (i+0.2)* (w/values.length);
    const bh = (v/max)*(h*0.8);
    ctx.fillStyle = '#6ae3ff';
    ctx.fillRect(x, h-bh-10, barW, bh);
    ctx.fillStyle = '#9aa1c7';
    ctx.font = `${12*devicePixelRatio}px sans-serif`;
    ctx.textAlign='center';
    ctx.fillText(String(v), x+barW/2, h-14);
  });
}

function stackedChart(canvas, dates, map){
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth * devicePixelRatio;
  const h = canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.clearRect(0,0,w,h);
  const keys=['pushup','squat','situp','pullup'];
  const colors=['#8ab4f8','#7ee787','#f7c843','#f28b82'];
  const totals = dates.map(ds=>keys.reduce((s,k)=>s+map[ds][k],0));
  const max = Math.max(1, ...totals);
  const barW = w/(dates.length*1.6);
  dates.forEach((ds,i)=>{
    let y=h-10; const x=(i+0.2)*(w/dates.length);
    keys.forEach((k,ki)=>{
      const v=map[ds][k]; const bh=(v/max)*(h*0.8);
      ctx.fillStyle=colors[ki];
      ctx.fillRect(x, y-bh, barW, bh);
      y-=bh;
    });
  });
}
