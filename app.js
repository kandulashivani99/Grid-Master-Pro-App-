
/* ---------- Global Error Catcher (debug) ---------- */
window.addEventListener('error', function(e){
  console.error('GridMaster error:', e.message, e.filename, e.lineno);
});
/* ============================================================
   GridMaster Pro v3 — Engineering Toolkit
   (i18n + AR + AI APIs + 24 EB tariffs)
   ============================================================ */

/* ---------- SPLASH ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    try { var s=document.getElementById('splash'); if(s) s.style.display='none'; } catch(e){console.error('splash',e);}
    try { var a=document.getElementById('app'); if(a) a.classList.remove('hidden'); } catch(e){console.error('app',e);}
    try { if (typeof applyI18n==='function') applyI18n(); } catch(e){console.error('applyI18n',e);}
    try { if (typeof startDashboard==='function' && document.getElementById('loadChart')) startDashboard(); } catch(e){console.error('startDashboard',e);}
    try { if (typeof buildCalcGrid==='function' && document.getElementById('calcGrid')) buildCalcGrid(); } catch(e){console.error('buildCalcGrid',e);}
    try { if (typeof addAppliance==='function' && document.getElementById('applianceList')) { addAppliance(); addAppliance(); } } catch(e){console.error('addAppliance',e);}
    try { if (typeof seedChat==='function' && document.getElementById('chatBox')) seedChat(); } catch(e){console.error('seedChat',e);}
    try { if (typeof loadAISettings==='function' && document.getElementById('aiProvider')) loadAISettings(); } catch(e){console.error('loadAISettings',e);}
  }, 1500);
});

/* ---------- THEME ---------- */
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
if (themeBtn) {
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeBtn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const nxt = cur === 'dark' ? '' : 'dark';
  if (nxt) document.documentElement.setAttribute('data-theme', nxt);
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', nxt);
  themeBtn.textContent = nxt === 'dark' ? '☀️' : '🌙';
});
}

/* ---------- LANGUAGE PICKER ---------- */
var _lb = document.getElementById('langBtn');
if (_lb) _lb.addEventListener('click', () => {
  var lm = document.getElementById('langModal');
  if (lm) lm.classList.remove('hidden');
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.l === getLang());
  });
});
function closeLangModal() { document.getElementById('langModal').classList.add('hidden'); }
document.querySelectorAll('.lang-btn').forEach(b => {
  b.addEventListener('click', () => { setLang(b.dataset.l); closeLangModal(); });
});

/* ---------- NAV ---------- */
function go(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const target = document.querySelector(`.view[data-view="${view}"]`);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`.nav-btn[data-go="${view}"]`).forEach(b => b.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'present') renderSlide();
  if (view === 'quiz') startQuiz();
  if (view === 'learn') renderLearn();
  if (view === 'wind') drawWindCurve();
  if (view !== 'ar') stopAR();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]'); if (t) go(t.dataset.go);
});

/* ---------- HELPERS ---------- */
const num = id => parseFloat(document.getElementById(id).value) || 0;
const txt = id => document.getElementById(id).value;
const show = (id, html) => { const el=document.getElementById(id); el.innerHTML=html; el.classList.add('show'); };
const fmt = (n,d=2) => Number(n).toLocaleString('en-IN', {maximumFractionDigits:d});

/* =====================================================
   LIVE DASHBOARD
   ===================================================== */
let loadHistory = Array.from({length: 30}, () => 50 + Math.random() * 50);
function startDashboard() {
  setInterval(() => {
    document.getElementById('mVolt').textContent = (228 + Math.random()*4).toFixed(1) + ' V';
    document.getElementById('mCurr').textContent = (10 + Math.random()*5).toFixed(2) + ' A';
    document.getElementById('mFreq').textContent = (49.85 + Math.random()*0.3).toFixed(2) + ' Hz';
    document.getElementById('mPF').textContent = (0.88 + Math.random()*0.1).toFixed(2);
    const renew = Math.round(55 + Math.random()*30);
    document.getElementById('mRen').textContent = renew + '%';
    document.getElementById('renBar').style.width = renew + '%';
    loadHistory.push(40 + Math.random()*60);
    if (loadHistory.length > 30) loadHistory.shift();
    drawLoadChart();
  }, 1500);
  drawLoadChart();
}
function drawLoadChart() {
  const c = document.getElementById('loadChart'); if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,'rgba(6,182,212,0.5)');
  grad.addColorStop(1,'rgba(6,182,212,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(0,h);
  loadHistory.forEach((v,i) => {
    const x = (i/(loadHistory.length-1))*w;
    const y = h - (v/100)*h;
    ctx.lineTo(x,y);
  });
  ctx.lineTo(w,h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2;
  ctx.beginPath();
  loadHistory.forEach((v,i) => {
    const x = (i/(loadHistory.length-1))*w;
    const y = h - (v/100)*h;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();
}

/* =====================================================
   SOLAR
   ===================================================== */
function calcSolar() {
  const A = num('s_area'), G = num('s_irr'), eff = num('s_eff')/100, sun = num('s_sun');
  const power = A * G * eff; const daily = power * sun / 1000;
  show('r_solar', `
    <span class="big">${fmt(power)} W</span>
    <div class="row-info"><span>Daily energy</span><b>${fmt(daily)} kWh</b></div>
    <div class="row-info"><span>Monthly</span><b>${fmt(daily*30)} kWh</b></div>
    <div class="row-info"><span>Annual</span><b>${fmt(daily*365)} kWh</b></div>`);
}
function calcSolarDesign() {
  const load = num('sd_load'), sun = num('sd_sun'), backup = num('sd_backup');
  const sysV = num('sd_sysV'), pW = num('sd_panelW'), bV = num('sd_battV');
  const cost = num('sd_cost'), tar = num('sd_tar');
  const requiredW = (load * 1000) / sun;
  const panels = Math.ceil(requiredW / pW);
  const installedW = panels * pW;
  const inverterKVA = Math.ceil((installedW / 1000) * 1.25 * 10) / 10;
  const battWh = (load*1000 / 24) * backup;
  const battAh = battWh / sysV / 0.8;
  const battsInSeries = Math.round(sysV / bV);
  const I = installedW / sysV;
  let cable = '2.5 mm²';
  if (I > 20) cable = '4 mm²'; if (I > 30) cable = '6 mm²';
  if (I > 45) cable = '10 mm²'; if (I > 60) cable = '16 mm²';
  if (I > 80) cable = '25 mm²';
  const totalCost = installedW * cost;
  const annualKWh = load * 365;
  const annualSaving = annualKWh * tar;
  const payback = totalCost / annualSaving;
  show('r_sd', `
    <span class="big">${panels} × ${pW}W Panels</span>
    <div class="row-info"><span>Installed Capacity</span><b>${fmt(installedW/1000,2)} kW</b></div>
    <div class="row-info"><span>Inverter Size</span><b>${inverterKVA} kVA</b></div>
    <div class="row-info"><span>Battery Bank</span><b>${fmt(battAh)} Ah @ ${sysV}V</b></div>
    <div class="row-info"><span>Batteries</span><b>${battsInSeries} × ${bV}V in series</b></div>
    <div class="row-info"><span>Cable</span><b>${cable} (≈${fmt(I)}A)</b></div>
    <div class="row-info"><span>System Cost</span><b>₹${fmt(totalCost,0)}</b></div>
    <div class="row-info"><span>Annual Energy</span><b>${fmt(annualKWh)} kWh</b></div>
    <div class="row-info"><span>Annual Saving</span><b>₹${fmt(annualSaving,0)}</b></div>
    <div class="row-info"><span>Payback</span><b>${fmt(payback,1)} years</b></div>`);
}

/* =====================================================
   WIND
   ===================================================== */
function calcWind() {
  const rho = num('w_rho'), r = num('w_r'), v = num('w_v');
  const cp = Math.min(num('w_cp'), 0.593), eg = num('w_eg')/100, tsr = num('w_tsr');
  const A = Math.PI * r * r;
  const ideal = 0.5 * rho * A * Math.pow(v,3);
  const elec = ideal * cp * eg;
  const rpm = (tsr * v * 60) / (2 * Math.PI * r);
  show('r_wind', `
    <span class="big">${fmt(elec)} W</span>
    <div class="row-info"><span>Swept Area</span><b>${fmt(A)} m²</b></div>
    <div class="row-info"><span>Available Wind Power</span><b>${fmt(ideal)} W</b></div>
    <div class="row-info"><span>Rotor Speed</span><b>${fmt(rpm,1)} RPM</b></div>
    <div class="row-info"><span>Annual Energy (CF=25%)</span><b>${fmt(elec*8760*0.25/1000)} kWh</b></div>`);
  drawWindCurve();
}
function drawWindCurve() {
  const c = document.getElementById('windCurve'); if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  const rho = num('w_rho')||1.225, r = num('w_r')||2;
  const cp = Math.min(num('w_cp')||0.4, 0.593), eg = (num('w_eg')||90)/100;
  const A = Math.PI*r*r, margin = 30;
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(margin,10); ctx.lineTo(margin,h-margin); ctx.lineTo(w-10,h-margin); ctx.stroke();
  ctx.fillStyle = getComputedStyle(document.body).color; ctx.font = '11px sans-serif';
  ctx.fillText('Power (W)', margin+4, 14);
  ctx.fillText('Wind Speed (m/s)', w-100, h-10);
  let max = 0; const pts = [];
  for (let v=0; v<=25; v++) { const p = 0.5*rho*A*Math.pow(v,3)*cp*eg; pts.push({v,p}); if (p>max) max=p; }
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
  pts.forEach((pt,i) => {
    const x = margin + (pt.v/25)*(w-margin-10);
    const y = h-margin - (pt.p/max)*(h-margin-10);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.lineTo(w-10, h-margin); ctx.lineTo(margin, h-margin); ctx.closePath();
  ctx.fillStyle = 'rgba(34,211,238,.18)'; ctx.fill();
}

/* =====================================================
   HYBRID
   ===================================================== */
function calcHybridDesign() {
  const s = num('hd_solar'), w = num('hd_wind');
  const sh = num('hd_sun'), wh = num('hd_wh');
  const load = num('hd_load'), batt = num('hd_batt');
  const solarKWh = s * sh; const windKWh = w * wh;
  const totalGen = solarKWh + windKWh;
  const diff = totalGen - load;
  let msg = diff > 0
    ? `<b>✅ Surplus:</b> +${fmt(diff)} kWh → charges battery`
    : diff < 0 ? `<b>⚠ Deficit:</b> ${fmt(-diff)} kWh → battery discharges`
    : `<b>⚖ Perfectly balanced</b>`;
  const battStatus = diff > 0 ? Math.min(100, (diff/batt)*100) : Math.max(0, 100 - (Math.abs(diff)/batt)*100);
  show('r_hd', `
    <span class="big">${fmt(totalGen)} kWh/day</span>
    <div class="row-info"><span>Solar generation</span><b>${fmt(solarKWh)} kWh</b></div>
    <div class="row-info"><span>Wind generation</span><b>${fmt(windKWh)} kWh</b></div>
    <div class="row-info"><span>Total load</span><b>${fmt(load)} kWh</b></div>
    <div class="row-info"><span>Battery SOC</span><b>${fmt(battStatus,0)}%</b></div>
    <div class="row-info"><span>Status</span>${msg}</div>
    <div class="row-info"><span>Renewable Fraction</span><b>${fmt(Math.min(100,totalGen/load*100))}%</b></div>`);
  drawHybridChart(solarKWh, windKWh, load);
}
function drawHybridChart(s,w,L) {
  const c = document.getElementById('hybridChart'); if (!c) return;
  const ctx = c.getContext('2d'); const W=c.width, H=c.height;
  ctx.clearRect(0,0,W,H);
  const data = [
    {label:'Solar', value:s, color:'#f59e0b'},
    {label:'Wind',  value:w, color:'#22d3ee'},
    {label:'Load',  value:L, color:'#16a34a'}
  ];
  const max = Math.max(...data.map(d=>d.value),1);
  const bw = 50, gap = 30, base = H-50, startX = 50;
  data.forEach((d,i) => {
    const bh = (d.value/max)*(H-90);
    const x = startX + i*(bw+gap);
    const grad = ctx.createLinearGradient(0, base-bh, 0, base);
    grad.addColorStop(0, d.color); grad.addColorStop(1, d.color+'55');
    ctx.fillStyle = grad; ctx.fillRect(x, base-bh, bw, bh);
    ctx.fillStyle = getComputedStyle(document.body).color;
    ctx.font = 'bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(d.label, x+bw/2, base+18);
    ctx.fillText(fmt(d.value)+' kWh', x+bw/2, base-bh-6);
  });
  ctx.textAlign='left';
}

/* =====================================================
   📐 AR ROOFTOP ESTIMATOR (Camera + Overlay)
   ===================================================== */
let arStream = null, arAnim = null;
async function startAR() {
  const video = document.getElementById('arVideo');
  const overlay = document.getElementById('arOverlay');
  const placeholder = document.getElementById('arPlaceholder');
  try {
    arStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video.srcObject = arStream;
    placeholder.classList.add('hidden');
    video.onloadedmetadata = () => {
      overlay.width = video.videoWidth || 640;
      overlay.height = video.videoHeight || 480;
      drawAROverlay();
    };
  } catch (e) {
    placeholder.classList.remove('hidden');
    placeholder.innerHTML = `<div style="font-size:3rem">📷</div><p>⚠ Camera permission denied or unavailable.<br>You can still enter dimensions below.</p>`;
  }
}
function stopAR() {
  if (arStream) { arStream.getTracks().forEach(t => t.stop()); arStream = null; }
  if (arAnim) { cancelAnimationFrame(arAnim); arAnim = null; }
  const placeholder = document.getElementById('arPlaceholder');
  if (placeholder) placeholder.classList.remove('hidden');
  const video = document.getElementById('arVideo');
  if (video) video.srcObject = null;
}
function drawAROverlay() {
  const overlay = document.getElementById('arOverlay');
  if (!overlay || !arStream) return;
  const ctx = overlay.getContext('2d');
  const W = overlay.width, H = overlay.height;
  ctx.clearRect(0, 0, W, H);
  const len = num('ar_len') || 10;
  const wid = num('ar_wid') || 8;
  const panelM2 = num('ar_panel') || 1.95;
  const panelLen = 1.65, panelWid = 1.0; // approx
  const cols = Math.floor(wid / panelWid);
  const rows = Math.floor(len / panelLen);
  // draw grid representing panels
  const gridW = W * 0.7, gridH = H * 0.55;
  const startX = (W - gridW)/2, startY = (H - gridH)/2 + 20;
  const cellW = gridW / Math.max(cols,1);
  const cellH = gridH / Math.max(rows,1);
  // outline
  ctx.strokeStyle = 'rgba(6,182,212,.9)'; ctx.lineWidth = 3;
  ctx.strokeRect(startX, startY, gridW, gridH);
  // panels
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c*cellW + 2, y = startY + r*cellH + 2;
      const grad = ctx.createLinearGradient(x, y, x+cellW, y+cellH);
      grad.addColorStop(0, 'rgba(6,182,212,.35)');
      grad.addColorStop(1, 'rgba(22,163,74,.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, cellW-4, cellH-4);
      ctx.strokeStyle = 'rgba(34,211,238,.7)'; ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellW-4, cellH-4);
    }
  }
  // info text
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(10, 10, 220, 60);
  ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`📐 ${len}m × ${wid}m`, 20, 32);
  ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
  ctx.fillText(`${cols * rows} panels possible`, 20, 52);
  arAnim = requestAnimationFrame(drawAROverlay);
}
function calcAR() {
  const len = num('ar_len'), wid = num('ar_wid');
  const tilt = num('ar_tilt'), shade = num('ar_shade')/100;
  const panel = num('ar_panel'), pw = num('ar_pw');
  const area = len * wid;
  const usable = area * shade * 0.7; // 70% usable (walkways, structure)
  const panels = Math.floor(usable / panel);
  const installedW = panels * pw;
  const sunHours = 5; // average India
  const tiltFactor = Math.cos((Math.abs(tilt - 20) * Math.PI) / 180); // ~optimum 20°
  const daily = (installedW / 1000) * sunHours * tiltFactor;
  const cost = installedW * 55;
  const annual = daily * 365;
  const saving = annual * 8;
  const payback = cost / saving;
  show('r_ar', `
    <span class="big">${panels} panels (${fmt(installedW/1000,2)} kW)</span>
    <div class="row-info"><span>Rooftop Area</span><b>${fmt(area)} m²</b></div>
    <div class="row-info"><span>Usable Area</span><b>${fmt(usable)} m²</b></div>
    <div class="row-info"><span>Tilt Efficiency</span><b>${fmt(tiltFactor*100)}%</b></div>
    <div class="row-info"><span>Daily Generation</span><b>${fmt(daily,2)} kWh</b></div>
    <div class="row-info"><span>Annual Generation</span><b>${fmt(annual,0)} kWh</b></div>
    <div class="row-info"><span>System Cost</span><b>₹${fmt(cost,0)}</b></div>
    <div class="row-info"><span>Annual Saving</span><b>₹${fmt(saving,0)}</b></div>
    <div class="row-info"><span>Payback</span><b>${fmt(payback,1)} years</b></div>`);
  if (arStream) drawAROverlay();
}

/* =====================================================
   20+ ELECTRICAL CALCULATORS
   ===================================================== */
const CALCS = [
  { id:'kw_hp', name:'kW ↔ HP', ico:'⚙️', fields:[{l:'kW',n:'a',v:1}], compute:v=>`<b>${fmt(v.a/0.7457)} HP</b> | ${fmt(v.a*1000)} W` },
  { id:'hp_kw', name:'HP ↔ kW', ico:'⚙️', fields:[{l:'HP',n:'a',v:1}], compute:v=>`<b>${fmt(v.a*0.7457)} kW</b> | ${fmt(v.a*745.7)} W` },
  { id:'kva_a', name:'kVA → Amps (3φ)', ico:'⚡', fields:[{l:'kVA',n:'a',v:10},{l:'Line V',n:'b',v:415}], compute:v=>`<b>${fmt((v.a*1000)/(Math.sqrt(3)*v.b))} A</b>` },
  { id:'kva_a1', name:'kVA → Amps (1φ)', ico:'⚡', fields:[{l:'kVA',n:'a',v:5},{l:'V',n:'b',v:230}], compute:v=>`<b>${fmt((v.a*1000)/v.b)} A</b>` },
  { id:'kw_a3', name:'kW → Amps (3φ)', ico:'🔌', fields:[{l:'kW',n:'a',v:5},{l:'V',n:'b',v:415},{l:'PF',n:'c',v:0.85}], compute:v=>`<b>${fmt((v.a*1000)/(Math.sqrt(3)*v.b*v.c))} A</b>` },
  { id:'kw_a1', name:'kW → Amps (1φ)', ico:'🔌', fields:[{l:'kW',n:'a',v:2},{l:'V',n:'b',v:230},{l:'PF',n:'c',v:0.9}], compute:v=>`<b>${fmt((v.a*1000)/(v.b*v.c))} A</b>` },
  { id:'ohm', name:"Ohm's Law", ico:'Ω', fields:[{l:'V',n:'V',v:230},{l:'R (Ω)',n:'R',v:46}], compute:v=>`<b>I = ${fmt(v.V/v.R)} A</b> | P = ${fmt(v.V*v.V/v.R)} W` },
  { id:'vdrop', name:'Voltage Drop', ico:'📉', fields:[{l:'I (A)',n:'I',v:20},{l:'L (m)',n:'L',v:30},{l:'mm²',n:'S',v:4},{l:'V',n:'V',v:230}], compute:v=>{ const Vd=(2*v.I*0.0175*v.L)/v.S; return `<b>V drop: ${fmt(Vd)} V</b><br>Percent: ${fmt(Vd/v.V*100)}% ${Vd/v.V*100<3?'✅':'⚠'}`; }},
  { id:'cable', name:'Cable Size', ico:'🧵', fields:[{l:'I (A)',n:'I',v:25},{l:'L (m)',n:'L',v:25},{l:'V drop %',n:'d',v:3},{l:'V',n:'V',v:230}], compute:v=>{ const Smin=(2*v.I*0.0175*v.L)/(v.d/100*v.V); const sizes=[1.5,2.5,4,6,10,16,25,35,50,70,95,120]; const rec=sizes.find(s=>s>=Smin)||150; return `<b>Recommended: ${rec} mm²</b><br>Min: ${fmt(Smin,2)} mm²`; }},
  { id:'tx', name:'Transformer Sizing', ico:'🏭', fields:[{l:'kW',n:'P',v:50},{l:'PF',n:'pf',v:0.8},{l:'Margin %',n:'m',v:25}], compute:v=>{ const kva=(v.P/v.pf)*(1+v.m/100); const std=[10,16,25,40,63,100,160,200,250,315,400,500,630,800,1000]; const rec=std.find(s=>s>=kva)||1250; return `<b>${fmt(kva)} kVA</b><br>Standard: <b>${rec} kVA</b>`; }},
  { id:'cap', name:'Capacitor Bank', ico:'🔋', fields:[{l:'kW',n:'P',v:100},{l:'PF1',n:'p1',v:0.7},{l:'Target PF',n:'p2',v:0.95}], compute:v=>`<b>${fmt(v.P*(Math.tan(Math.acos(v.p1))-Math.tan(Math.acos(v.p2))))} kVAR</b>` },
  { id:'motor', name:'Motor FLC', ico:'🌀', fields:[{l:'HP',n:'hp',v:5},{l:'V',n:'V',v:415},{l:'PF',n:'pf',v:0.85},{l:'Eff %',n:'e',v:88}], compute:v=>{ const P=v.hp*745.7; const I=P/(Math.sqrt(3)*v.V*v.pf*v.e/100); return `<b>FLC: ${fmt(I)} A</b>`; }},
  { id:'mcb', name:'MCB / MCCB', ico:'🛡️', fields:[{l:'I (A)',n:'I',v:18}], compute:v=>{ const std=[6,10,16,20,25,32,40,50,63,80,100,125,160,200,250,400,630,800]; const rec=std.find(s=>s>=v.I*1.25)||1000; return `<b>${rec} A</b> (1.25× FLC)`; }},
  { id:'cb_short', name:'Short Circuit', ico:'💥', fields:[{l:'Tx kVA',n:'k',v:500},{l:'V',n:'V',v:415},{l:'%Z',n:'z',v:5}], compute:v=>{ const Ifl=(v.k*1000)/(Math.sqrt(3)*v.V); const Isc=Ifl*100/v.z; return `<b>I<sub>sc</sub> ≈ ${fmt(Isc/1000,2)} kA</b>`; }},
  { id:'pv_string', name:'PV String', ico:'☀️', fields:[{l:'Inv Max V',n:'mv',v:600},{l:'Inv MPPT min',n:'mn',v:200},{l:'Voc',n:'voc',v:48},{l:'Vmp',n:'vmp',v:40}], compute:v=>`<b>${Math.ceil(v.mn/v.vmp)}–${Math.floor(v.mv/v.voc)} panels in series</b>` },
  { id:'eta', name:'Inverter η', ico:'📊', fields:[{l:'DC W',n:'d',v:5000},{l:'AC W',n:'a',v:4750}], compute:v=>`<b>η = ${fmt(v.a/v.d*100)}%</b>` },
  { id:'energy', name:'Energy Cost', ico:'💵', fields:[{l:'W',n:'P',v:1000},{l:'Hours/day',n:'h',v:8},{l:'₹/kWh',n:'r',v:7}], compute:v=>{ const kwh=v.P*v.h/1000; return `<b>Daily: ₹${fmt(kwh*v.r)}</b><br>Monthly: ₹${fmt(kwh*v.r*30)}<br>Yearly: ₹${fmt(kwh*v.r*365)}`; }},
  { id:'battery2', name:'Battery Backup', ico:'🔋', fields:[{l:'Ah',n:'a',v:150},{l:'V',n:'v',v:12},{l:'Load W',n:'L',v:500},{l:'η %',n:'e',v:85}], compute:v=>`<b>${fmt((v.a*v.v*0.8*v.e/100)/v.L,1)} hours backup</b>` },
  { id:'lux', name:'Lighting', ico:'💡', fields:[{l:'L (m)',n:'L',v:5},{l:'W (m)',n:'W',v:4},{l:'Lux',n:'lx',v:300}], compute:v=>{ const lumens=v.L*v.W*v.lx; return `<b>${fmt(lumens,0)} lumens</b><br>≈ ${Math.ceil(lumens/800)} × 9W LED bulbs`; }},
  { id:'earth', name:'Earthing', ico:'🌍', fields:[{l:'Phase mm²',n:'p',v:25}], compute:v=>{ let e; if(v.p<=16)e=v.p; else if(v.p<=35)e=16; else e=v.p/2; return `<b>${e} mm²</b> earth conductor`; }},
  { id:'pf_corr', name:'Power Factor', ico:'cos φ', fields:[{l:'kW',n:'P',v:8},{l:'kVA',n:'S',v:10}], compute:v=>`<b>PF = ${fmt(v.P/v.S,3)}</b><br>kVAR: ${fmt(Math.sqrt(v.S*v.S-v.P*v.P))}` },
  { id:'tariff', name:'Solar ROI', ico:'📈', fields:[{l:'Cost ₹',n:'c',v:300000},{l:'kWh/yr',n:'k',v:7500},{l:'₹/kWh',n:'r',v:8}], compute:v=>{ const sav=v.k*v.r; return `<b>₹${fmt(sav,0)}/yr</b><br>Payback: ${fmt(v.c/sav,1)} yr<br>25-yr: ₹${fmt(sav*25-v.c,0)}`; }},
  { id:'cu_loss', name:'Cable I²R Loss', ico:'🔥', fields:[{l:'I (A)',n:'I',v:50},{l:'R (Ω/km)',n:'R',v:0.5},{l:'L (m)',n:'L',v:100}], compute:v=>`<b>${fmt(v.I*v.I*v.R*v.L/1000)} W</b> loss` },
  { id:'tx_eff', name:'Tx Efficiency', ico:'📊', fields:[{l:'Out W',n:'o',v:9500},{l:'Cu Loss W',n:'c',v:200},{l:'Core W',n:'i',v:100}], compute:v=>`<b>η = ${fmt(v.o/(v.o+v.c+v.i)*100,2)}%</b>` },
];
function buildCalcGrid() {
  const g = document.getElementById('calcGrid');
  g.innerHTML = CALCS.map(c => `
    <button class="calc-tile" onclick="openCalc('${c.id}')">
      <span class="ico">${c.ico}</span><span class="name">${c.name}</span>
    </button>`).join('');
  document.getElementById('statCalcs').textContent = CALCS.length + '+';
}
function filterCalcs() {
  const q = document.getElementById('calcSearch').value.toLowerCase();
  document.querySelectorAll('.calc-tile').forEach(t => {
    t.style.display = t.querySelector('.name').textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
function openCalc(id) {
  const c = CALCS.find(x=>x.id===id); if (!c) return;
  document.getElementById('modalTitle').textContent = c.ico + ' ' + c.name;
  document.getElementById('modalBody').innerHTML = `
    ${c.fields.map(f => `<label>${f.l} <input type="number" id="mf_${f.n}" value="${f.v}" step="any"></label>`).join('')}
    <button class="primary" onclick="runCalc('${id}')">Calculate</button>
    <div class="result" id="mf_result"></div>`;
  document.getElementById('calcModal').classList.remove('hidden');
}
function closeCalcModal() { document.getElementById('calcModal').classList.add('hidden'); }
function runCalc(id) {
  const c = CALCS.find(x=>x.id===id);
  const vals = {}; c.fields.forEach(f => vals[f.n] = num('mf_'+f.n));
  show('mf_result', c.compute(vals));
}

/* =====================================================
   EB BILL — 24 INDIAN STATES
   ===================================================== */
const STATE_SLABS = {
  generic:[[100,4],[200,5.5],[300,7],[500,8.5],[Infinity,10]],
  ts: [[100,2.6],[200,4.4],[300,7.2],[400,8.5],[800,9],[Infinity,9.5]],
  ap: [[75,1.45],[125,2.6],[225,3.85],[300,5.4],[400,7.2],[Infinity,8.75]],
  ka: [[50,4.15],[100,5.6],[200,7.15],[Infinity,8.2]],
  tn: [[100,0],[200,2.35],[400,4.7],[500,6.3],[600,8.4],[800,9.45],[Infinity,10.5]],
  mh: [[100,3.46],[300,7.43],[500,11.42],[1000,13.34],[Infinity,15.32]],
  dl: [[200,3],[400,4.5],[800,6.5],[1200,7],[Infinity,8]],
  up: [[150,5.5],[300,6.0],[500,6.5],[Infinity,7]],
  gj: [[50,3.05],[100,3.5],[250,4.15],[Infinity,5.2]],
  wb: [[102,5.26],[180,6.7],[300,7.12],[600,7.41],[900,8.03],[Infinity,9.46]],
  rj: [[50,4.75],[150,6.5],[300,7.35],[500,7.65],[Infinity,7.95]],
  mp: [[50,4.05],[150,5.05],[300,6.45],[Infinity,6.65]],
  kl: [[50,3.25],[100,4.05],[150,5.10],[200,6.95],[250,8.20],[300,9.20],[350,10.50],[Infinity,11.70]],
  pb: [[100,3.49],[300,5.84],[500,7.30],[Infinity,7.60]],
  hr: [[100,2.7],[250,2.95],[500,5.25],[800,6.45],[Infinity,7.10]],
  br: [[100,4.27],[200,5.07],[300,5.40],[Infinity,6.40]],
  or: [[50,3.10],[200,4.80],[400,5.80],[Infinity,6.60]],
  as: [[120,5.95],[240,7.15],[Infinity,8.05]],
  jh: [[100,3.5],[300,4.65],[400,6.25],[Infinity,7.50]],
  ch: [[100,3.40],[200,3.50],[400,4.40],[600,5.40],[Infinity,6.80]],
  uk: [[100,2.90],[200,4.30],[400,5.30],[Infinity,6.55]],
  hp: [[125,4.30],[300,4.85],[Infinity,5.30]],
  jk: [[100,1.55],[200,3.05],[400,4.20],[Infinity,5.15]],
  gomu:[[100,1.60],[200,2.40],[300,3.60],[400,4.40],[Infinity,5.10]]
};
function calcEB() {
  const state = document.getElementById('eb_state').value;
  const units = num('eb_units'), fixed = num('eb_fixed');
  const slabs = STATE_SLABS[state] || STATE_SLABS.generic;
  let rem = units, last = 0, total = 0, breakdown = '';
  for (const [lim, rate] of slabs) {
    if (rem <= 0) break;
    const used = Math.min(rem, lim - last);
    if (used > 0) {
      total += used * rate;
      breakdown += `<div class="row-info"><span>${last+1}–${Math.min(lim,units)} @ ₹${rate}</span><b>₹${fmt(used*rate)}</b></div>`;
      rem -= used; last = lim;
    }
  }
  const duty = total * 0.06;
  const grand = total + fixed + duty;
  show('r_eb', `
    <span class="big">₹${fmt(grand,0)}</span>
    ${breakdown}
    <div class="row-info"><span>Energy charges</span><b>₹${fmt(total)}</b></div>
    <div class="row-info"><span>Fixed</span><b>₹${fmt(fixed)}</b></div>
    <div class="row-info"><span>Electricity duty (6%)</span><b>₹${fmt(duty)}</b></div>
    <div class="row-info"><span><b>Total</b></span><b>₹${fmt(grand,0)}</b></div>`);
}

let applianceId = 0;
const APP_PRESETS = ['Fan','LED Light','Refrigerator','AC 1.5T','TV','Geyser','Iron','Washing Machine','Microwave','Computer'];
const APP_W = [75,9,150,1500,100,2000,1000,500,1200,200];
function addAppliance() {
  applianceId++;
  const idx = (applianceId-1) % APP_PRESETS.length;
  const row = document.createElement('div');
  row.className = 'appliance-row';
  row.innerHTML = `
    <input type="text" value="${APP_PRESETS[idx]}">
    <input type="number" value="${APP_W[idx]}" placeholder="Watt">
    <input type="number" value="1" placeholder="Qty">
    <input type="number" value="4" placeholder="Hrs">
    <button onclick="this.parentElement.remove(); calcAppliances()">✕</button>`;
  row.querySelectorAll('input').forEach(i => i.addEventListener('input', calcAppliances));
  document.getElementById('applianceList').appendChild(row);
  calcAppliances();
}
function calcAppliances() {
  let totalW = 0, dailyKWh = 0;
  document.querySelectorAll('.appliance-row').forEach(r => {
    const [, w, q, h] = r.querySelectorAll('input');
    const W = parseFloat(w.value)||0, Q = parseFloat(q.value)||0, H = parseFloat(h.value)||0;
    totalW += W*Q; dailyKWh += W*Q*H/1000;
  });
  const month = dailyKWh*30;
  show('r_appl', `
    <span class="big">${fmt(month,1)} kWh/month</span>
    <div class="row-info"><span>Connected Load</span><b>${fmt(totalW/1000,2)} kW</b></div>
    <div class="row-info"><span>Daily</span><b>${fmt(dailyKWh,2)} kWh</b></div>
    <div class="row-info"><span>Yearly</span><b>${fmt(month*12,0)} kWh</b></div>`);
}

/* =====================================================
   🤖 AI ASSISTANT (offline + OpenAI + Gemini)
   ===================================================== */
const KB = [
  { kw:['inverter','trip','tripping'], a:`<b>Common reasons an inverter trips:</b><br>1) Overload<br>2) Low/high battery voltage<br>3) Grid voltage/freq out of range<br>4) Overheating<br>5) DC isolation / earth fault<br>6) Loose terminals<br><br>Check the error code, then measure DC/AC voltages, load and cooling.` },
  { kw:['panel','5hp','motor'], a:`<b>Panels for a 5 HP motor:</b><br>5 HP ≈ 3.7 kW. With 70% duty and inverter losses, need ~5 kW solar + ~6 kVA VFD-friendly inverter.<br>• 5,000 W / 400 W = <b>13 panels</b><br>• Or 10 × 550W = 5.5 kW.<br>Add ~10 kWh battery if running motor when sun is unavailable.` },
  { kw:['voltage','drop'], a:`<b>Voltage drop</b> = V=I·R. Caused by long cables, undersized conductors, high current. Fix: bigger cable, shorter run, parallel cables, higher voltage. Use our Voltage Drop calculator.` },
  { kw:['mppt'], a:`<b>MPPT</b> = Maximum Power Point Tracking. Continuously finds the (V × I) operating point where panel output is maximum. Methods: P&O, Incremental Conductance, Fuzzy Logic. Implemented inside boost converter / charge controller.` },
  { kw:['cable','10kw'], a:`<b>Cable for 10 kW load:</b><br>• 1φ 230V → ~43A → <b>10 mm² Cu</b><br>• 3φ 415V → ~15.4A → <b>4 mm² Cu</b><br>Verify with Cable Size calculator.` },
  { kw:['battery','sizing'], a:`<b>Battery sizing:</b><br>Ah = (Load Wh × Days)/(V × DoD × η)<br>e.g. 2 kWh × 2 days @ 48V, 0.8, 0.9 = 116 Ah.` },
  { kw:['solar','roi','payback'], a:`<b>Solar payback in India:</b> 4–6 years for residential (₹50–60/W, ₹7–9/kWh tariff). 20+ years of free electricity after. Use the Solar Designer.` },
  { kw:['smart','grid'], a:`<b>Smart Grid</b> = traditional grid + sensors + 2-way communication + automation + renewables + storage. Benefits: reliability, low losses, easy renewable & EV integration.` },
  { kw:['wind','speed','rpm'], a:`<b>Wind RPM</b> = (λ × v × 60)/(2πR). λ (Tip Speed Ratio) is usually 6–8 for HAWT. Gearbox steps up to ~1500 RPM.` },
  { kw:['cp','betz'], a:`<b>Cp</b> = fraction of wind kinetic energy a turbine extracts. <b>Betz limit</b>: Cp ≤ 0.593. Modern turbines achieve 0.40–0.50.` },
  { kw:['boost','converter'], a:`<b>Boost converter</b>: V<sub>out</sub> = V<sub>in</sub>/(1−D). Components: L, MOSFET, diode, C. Used in solar MPPT to match panel V to bus V.` },
  { kw:['power','factor'], a:`<b>PF</b> = cos φ = kW/kVA. <0.9 wastes capacity (penalties). Improve with capacitor banks — use Capacitor Bank calculator.` },
];
function findAnswer(q) {
  q = q.toLowerCase();
  let best = null, bestScore = 0;
  for (const k of KB) {
    const score = k.kw.reduce((s,w) => s + (q.includes(w)?1:0), 0);
    if (score > bestScore) { bestScore = score; best = k; }
  }
  if (best && bestScore > 0) return best.a;
  return `🤔 I don't have this in my offline knowledge base. Try keywords like <b>inverter, MPPT, voltage drop, battery, solar ROI, cable, motor, power factor, smart grid, wind, boost converter</b>.<br><br>💡 <i>Or enable online AI by adding your OpenAI/Gemini API key in AI Settings above.</i>`;
}
function seedChat() {
  const c = document.getElementById('chatBox');
  c.innerHTML = `<div class="msg bot">👋 Hi! I'm your Electrical Engineering assistant. Ask me anything about <b>solar, wind, smart grid, inverters, cables, motors</b>, etc.</div>`;
}

/* AI settings */
function loadAISettings() {
  const provider = localStorage.getItem('aiProvider') || 'offline';
  const key = localStorage.getItem('aiKey') || '';
  document.getElementById('aiProvider').value = provider;
  document.getElementById('aiKey').value = key;
}
function saveAISettings() {
  const provider = document.getElementById('aiProvider').value;
  const key = document.getElementById('aiKey').value.trim();
  localStorage.setItem('aiProvider', provider);
  if (key) localStorage.setItem('aiKey', key); else localStorage.removeItem('aiKey');
  const msg = document.getElementById('aiSettingsMsg');
  msg.innerHTML = provider === 'offline'
    ? '✅ Using offline knowledge base.'
    : (key ? `✅ ${provider.toUpperCase()} connected. Key saved locally.` : '⚠ Save an API key to use online AI.');
  setTimeout(()=> { msg.innerHTML = ''; }, 4000);
}

async function sendChat() {
  const input = document.getElementById('chatMsg');
  const q = input.value.trim(); if (!q) return;
  const c = document.getElementById('chatBox');
  c.innerHTML += `<div class="msg user">${escapeHTML(q)}</div>`;
  input.value = '';
  c.scrollTop = c.scrollHeight;

  const provider = localStorage.getItem('aiProvider') || 'offline';
  const key = localStorage.getItem('aiKey') || '';

  // typing indicator
  const typingId = 'typing-' + Date.now();
  c.innerHTML += `<div class="msg bot" id="${typingId}"><i>typing…</i></div>`;
  c.scrollTop = c.scrollHeight;

  let answer = '';
  try {
    if (provider === 'openai' && key) answer = await askOpenAI(q, key);
    else if (provider === 'gemini' && key) answer = await askGemini(q, key);
    else answer = findAnswer(q);
  } catch (e) {
    answer = `⚠ AI error: ${escapeHTML(e.message)}<br><br>${findAnswer(q)}`;
  }
  document.getElementById(typingId).innerHTML = answer;
  c.scrollTop = c.scrollHeight;
}
function quickAsk(q) { document.getElementById('chatMsg').value = q; sendChat(); }

const SYSTEM_PROMPT = "You are an expert electrical engineering and renewable energy assistant inside the GridMaster Pro app. Answer concisely in clean HTML (use <b>, <br>, <ul>, <li>). Focus on practical answers for solar, wind, smart grid, inverters, cables, motors, batteries and Indian electrical standards. Use Indian units (kW, A, V, ₹).";

async function askOpenAI(q, key) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: q }
      ],
      temperature: 0.4,
      max_tokens: 500
    })
  });
  if (!res.ok) { const t = await res.text(); throw new Error('OpenAI: ' + res.status + ' ' + t.slice(0,120)); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response';
}
async function askGemini(q, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + q }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
    })
  });
  if (!res.ok) { const t = await res.text(); throw new Error('Gemini: ' + res.status + ' ' + t.slice(0,120)); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}
function escapeHTML(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* =====================================================
   PDF REPORTS
   ===================================================== */
function generateReport() {
  if (!window.jspdf) { alert('⚠ PDF library not loaded.\n\nThis happens when the app is opened without internet (e.g. in this sandbox preview).\n\nHost the app online (Netlify/GitHub Pages) or open it in a normal browser tab — PDF generation will work fully.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const name = txt('rp_name'), loc = txt('rp_loc'), by = txt('rp_by');
  const load = num('rp_load'), sun = num('rp_sun'), pw = num('rp_pw'), cost = num('rp_cost');
  const requiredW = load*1000/sun;
  const panels = Math.ceil(requiredW/pw);
  const installed = panels*pw;
  const inv = (installed/1000)*1.25;
  const battKWh = load*0.5;
  const totalCost = installed*cost;
  const annual = load*365;
  const saving = annual*8;
  const payback = totalCost/saving;

  doc.setFillColor(11,93,59); doc.rect(0,0,210,30,'F');
  doc.setTextColor(255); doc.setFontSize(20); doc.setFont('helvetica','bold');
  doc.text('GridMaster Pro', 14, 14);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Solar Power System — Project Report', 14, 22);

  doc.setTextColor(20); doc.setFontSize(11);
  let y = 42;
  const addLine = (k,v) => { doc.setFont('helvetica','bold'); doc.text(k+':', 14, y); doc.setFont('helvetica','normal'); doc.text(String(v), 70, y); y += 8; };

  doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.text('Project Information', 14, y); y+=8;
  doc.setFontSize(10);
  addLine('Project Name', name);
  addLine('Site Location', loc);
  addLine('Date', new Date().toLocaleDateString('en-IN'));
  addLine('Prepared By', by);

  y+=4; doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.text('System Design', 14, y); y+=8;
  doc.setFontSize(10);
  addLine('Daily Load', load + ' kWh');
  addLine('Sun Hours', sun + ' hrs/day');
  addLine('Panel Wattage', pw + ' W');
  addLine('Required Capacity', fmt(requiredW)+' W');
  addLine('Number of Panels', panels);
  addLine('Installed Capacity', fmt(installed/1000,2)+' kW');
  addLine('Recommended Inverter', fmt(inv,2)+' kVA');
  addLine('Battery (50% backup)', fmt(battKWh,2)+' kWh');

  y+=4; doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.text('Financial Analysis', 14, y); y+=8;
  doc.setFontSize(10);
  addLine('System Cost', 'INR ' + fmt(totalCost,0));
  addLine('Annual Generation', fmt(annual) + ' kWh');
  addLine('Annual Savings (INR 8)', 'INR ' + fmt(saving,0));
  addLine('Payback Period', fmt(payback,1) + ' years');
  addLine('25-year Return', 'INR ' + fmt(saving*25 - totalCost,0));

  y+=10; doc.setFontSize(9); doc.setTextColor(100);
  doc.text('Auto-generated by GridMaster Pro. Estimates only.', 14, y);
  doc.text('Refer to local DISCOM regulations and certified installers for final design.', 14, y+5);

  doc.setFillColor(11,93,59); doc.rect(0,287,210,10,'F');
  doc.setTextColor(255); doc.setFontSize(8);
  doc.text('(c) 2026 GridMaster Pro — All-in-One Electrical & Renewable Energy Toolkit', 14, 293);

  doc.save(`${name.replace(/\s+/g,'_')}_Solar_Report.pdf`);
}
function generateQuote() {
  if (!window.jspdf) { alert('⚠ PDF library not loaded.\n\nThis happens when the app is opened without internet (e.g. in this sandbox preview).\n\nHost the app online (Netlify/GitHub Pages) or open it in a normal browser tab — PDF generation will work fully.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const name = txt('qt_name'), kw = num('qt_kw'), rate = num('qt_rate'), gst = num('qt_gst');
  const subtotal = kw*rate; const tax = subtotal*gst/100; const total = subtotal + tax;
  doc.setFillColor(6,182,212); doc.rect(0,0,210,30,'F');
  doc.setTextColor(255); doc.setFontSize(20); doc.setFont('helvetica','bold');
  doc.text('QUOTATION', 14, 14);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('GridMaster Pro — Solar Solutions', 14, 22);
  doc.setTextColor(20); doc.setFontSize(11);
  doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), 14, 42);
  doc.text('Quote #: GM-' + Date.now().toString().slice(-6), 14, 48);
  doc.setFont('helvetica','bold'); doc.text('Client:', 14, 58);
  doc.setFont('helvetica','normal'); doc.text(name, 35, 58);
  let y = 75;
  doc.setFillColor(240,240,240); doc.rect(14, y-6, 182, 10, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text('Description', 18, y); doc.text('Qty', 110, y); doc.text('Rate', 130, y); doc.text('Amount', 165, y);
  y += 10; doc.setFont('helvetica','normal');
  doc.text(`Solar Power System (${kw} kW)`, 18, y);
  doc.text(String(kw), 110, y); doc.text(fmt(rate,0), 130, y); doc.text(fmt(subtotal,0), 165, y);
  y += 12; doc.line(14, y, 196, y); y+=6;
  doc.text('Subtotal', 130, y); doc.text('INR ' + fmt(subtotal,0), 165, y); y+=8;
  doc.text('GST (' + gst + '%)', 130, y); doc.text('INR ' + fmt(tax,0), 165, y); y+=8;
  doc.setFont('helvetica','bold'); doc.setFontSize(12);
  doc.text('TOTAL', 130, y); doc.text('INR ' + fmt(total,0), 165, y);
  y+=20; doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(80);
  doc.text('Includes: Panels, inverter, mounting, cables, installation & commissioning.', 14, y); y+=5;
  doc.text('Warranty: 25 yr panel, 5 yr inverter, 1 yr workmanship.', 14, y); y+=5;
  doc.text('Validity: 15 days. Payment: 50% advance, 50% on commissioning.', 14, y);
  doc.setFillColor(6,182,212); doc.rect(0,287,210,10,'F');
  doc.setTextColor(255); doc.setFontSize(8);
  doc.text('Thank you for choosing GridMaster Pro', 14, 293);
  doc.save(`Quote_${name.replace(/\s+/g,'_')}.pdf`);
}

/* =====================================================
   LEARN
   ===================================================== */
const learnData = [
  { t:'1. Smart Grid', b:`Electrical network with digital communication, sensors, automation. Integrates renewables, storage, demand response.` },
  { t:'2. Solar PV', b:`Photovoltaic effect → DC. V<sub>oc</sub>, I<sub>sc</sub>, V<sub>mp</sub>, I<sub>mp</sub>, FF. Lower with high temperature, higher with irradiance.` },
  { t:'3. Wind Energy', b:`<b>P = ½ρAv³Cp</b>. Betz: Cp ≤ 0.593. Variable-speed pitch turbines preferred.` },
  { t:'4. MPPT', b:`P&O, Incremental Conductance, Fuzzy. Tracks max power point.` },
  { t:'5. Boost Converter', b:`<b>V<sub>out</sub>=V<sub>in</sub>/(1−D)</b>. L, MOSFET, diode, C.` },
  { t:'6. Inverters', b:`VSI (PV grid-tie) vs CSI (high-power drives).` },
  { t:'7. Battery Storage', b:`Ah = (Load·Days)/(V·DoD·η).` },
  { t:'8. Hybrid Solar–Wind', b:`Multi-input inverter → DC bus + battery → grid.` },
  { t:'9. Smart Grid India', b:`NSGM, RDSS smart meters, 500+ GW non-fossil target by 2030.` },
  { t:'10. Challenges & Opportunities', b:`Intermittency, cost, cybersecurity ↔ EVs, microgrids, AI, green H₂.` }
];
function renderLearn() {
  const c = document.getElementById('learn-list'); if (c.dataset.done) return;
  c.innerHTML = learnData.map((d,i) => `
    <div class="acc-item"><div class="acc-head">${d.t}</div><div class="acc-body"><p>${d.b}</p></div></div>`).join('');
  c.querySelectorAll('.acc-item').forEach(item => {
    item.querySelector('.acc-head').addEventListener('click', () => item.classList.toggle('open'));
  });
  c.dataset.done = '1';
}

/* PRESENT */
const slides = [
  { h:'⚡ Smart Grid Technology', body:'<p>Status, Challenges & Opportunities</p>' },
  { h:'🎯 Project Objective', body:'<p>Hybrid solar/wind with MPPT control.</p>' },
  { h:'☀️ Solar PV', body:'<ul><li>Photovoltaic effect</li><li>V<sub>oc</sub>, I<sub>sc</sub>, V<sub>mp</sub>, I<sub>mp</sub></li></ul>' },
  { h:'🌬️ Wind Energy', body:'<p>P = ½ρAv³Cp · Betz ≤ 0.593</p>' },
  { h:'📈 MPPT', body:'<p>P&O, IC, Fuzzy.</p>' },
  { h:'🔌 Boost Converter', body:'<p>V<sub>out</sub>=V<sub>in</sub>/(1−D)</p>' },
  { h:'🔋 Battery', body:'<p>Ah = (Load·Days)/(V·DoD·η)</p>' },
  { h:'⚡ Hybrid', body:'<p>Solar + Wind → DC Bus → Inverter → Grid</p>' },
  { h:'🇮🇳 India', body:'<ul><li>NSGM</li><li>RDSS meters</li><li>500+ GW target</li></ul>' },
  { h:'🚧 Challenges', body:'<ul><li>Intermittency</li><li>Cost</li><li>Cybersecurity</li></ul>' },
  { h:'🚀 Opportunities', body:'<ul><li>EVs</li><li>Microgrids</li><li>AI</li><li>Green H₂</li></ul>' },
  { h:'✅ Conclusion', body:'<p>Smart Grid + MPPT hybrid = clean reliable power.</p>' },
  { h:'🙏 Thank You', body:'<p style="font-size:1.2rem">Questions?</p>' }
];
let curSlide = 0;
function renderSlide() {
  const s = slides[curSlide];
  document.getElementById('slide').innerHTML = `<h2>${s.h}</h2>${s.body}`;
  document.getElementById('slideNum').textContent = `${curSlide+1} / ${slides.length}`;
}
function nextSlide() { curSlide=(curSlide+1)%slides.length; renderSlide(); }
function prevSlide() { curSlide=(curSlide-1+slides.length)%slides.length; renderSlide(); }
document.addEventListener('keydown', e => {
  const pres = document.querySelector('.view[data-view="present"]');
  if (!pres || pres.classList.contains('hidden')) return;
  if (e.key==='ArrowRight') nextSlide();
  if (e.key==='ArrowLeft') prevSlide();
});

/* QUIZ */
const quizQs = [
  { q:'What does MPPT stand for?', o:['Max Power Point Tracking','Multi-Point Power Test','Modulated Pulse','Max Phase Power'], a:0 },
  { q:'Betz limit:', o:['0.593','1.0','0.45','0.75'], a:0 },
  { q:'Boost converter output:', o:['V_out=V_in·D','V_out=V_in/(1−D)','V_out=V_in·(1−D)','V_out=V_in/D'], a:1 },
  { q:'Rising temperature mostly reduces:', o:['I_sc','V_oc','FF only','Nothing'], a:1 },
  { q:'Wind power varies with v raised to:', o:['1','2','3','4'], a:2 },
  { q:'Most common PV grid-tie inverter:', o:['VSI','CSI','Z-source','Cyclo'], a:0 },
  { q:'1 HP ≈', o:['0.5 kW','0.746 kW','1 kW','2 kW'], a:1 },
  { q:'Fill Factor:', o:['(V_mp·I_mp)/(V_oc·I_sc)','V_oc/V_mp','I_sc·V_oc','(V_oc+V_mp)/2'], a:0 },
  { q:'PF = 1 means:', o:['Inductive','Resistive','Capacitive','None'], a:1 },
  { q:'NSGM:', o:['Nat Solar Grid Mission','Nat Smart Grid Mission','Nat Standard Grid Module','None'], a:1 }
];
let qIdx=0, qScore=0, qLocked=false;
function startQuiz() { qIdx=0; qScore=0; renderQuiz(); }
function renderQuiz() {
  const box = document.getElementById('quizBox');
  if (qIdx >= quizQs.length) {
    const pct = Math.round((qScore/quizQs.length)*100);
    const emoji = pct>=80?'🏆':pct>=60?'🎉':pct>=40?'👍':'💡';
    box.innerHTML = `<div class="q-final"><div style="font-size:3rem">${emoji}</div><h3>${qScore}/${quizQs.length}</h3><p>${pct}%</p><button class="primary" onclick="startQuiz()">Try Again</button></div>`;
    return;
  }
  const Q = quizQs[qIdx];
  box.innerHTML = `
    <div class="q-progress"><div style="width:${(qIdx/quizQs.length)*100}%"></div></div>
    <div class="q-card"><h3>Q${qIdx+1}. ${Q.q}</h3>
    ${Q.o.map((o,i)=>`<div class="q-opt" data-i="${i}">${o}</div>`).join('')}</div>`;
  qLocked = false;
  box.querySelectorAll('.q-opt').forEach(el => {
    el.addEventListener('click', () => {
      if (qLocked) return; qLocked = true;
      const i = parseInt(el.dataset.i);
      if (i===Q.a) { el.classList.add('correct'); qScore++; }
      else { el.classList.add('wrong'); box.querySelectorAll('.q-opt')[Q.a].classList.add('correct'); }
      setTimeout(()=>{ qIdx++; renderQuiz(); }, 850);
    });
  });
}

/* SW */
if (typeof navigator!=='undefined' && navigator.serviceWorker && navigator.serviceWorker.register) {
  try { navigator.serviceWorker.register('sw.js').catch(()=>{}); } catch(e){}
}
