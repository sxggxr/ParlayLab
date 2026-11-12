/* ===== CONFIGURACIÓN DE MONETIZACIÓN (edita aquí) ===== */
const PRO_LINK = 'https://buy.stripe.com/TU_LINK_DE_PAGO';   // tu link de pago (Stripe, Mercado Pago…)
/* ===== SUPABASE (la llave publishable es pública: las tablas están protegidas con RLS) ===== */
const SB_URL='https://gpkiwvaroxuingasbuff.supabase.co';
const SB_KEY='sb_publishable_T85z6Wxq9tHjttOK5jDBWg_2LVo9PN-';
const sb=window.supabase?window.supabase.createClient(SB_URL,SB_KEY):null;
const BOOKS = [ // u = reemplaza con TU link de afiliado de cada casa
  {n:'Caliente', c:'#e11d2e', u:'https://www.caliente.mx'},
  {n:'Codere',   c:'#0a8f3c', u:'https://www.codere.mx'},
  {n:'Draftea',  c:'#f97316', u:'https://draftea.com'},
  {n:'Betway',   c:'#2a2a2a', u:'https://www.betway.mx'},
  {n:'Playdoit', c:'#6d28d9', u:'https://www.playdoit.mx'}
];
/* ===== TEXTOS / IDIOMAS ===== */
const T={es:{tagline:'Calcula, compara y apuesta con inteligencia',subtitle:'Calculadora de parlays • Arma y calcula tu parlay',login:'Iniciar sesión',register:'Crear cuenta',name:'Nombre',email:'Correo',pass:'Contraseña (mín. 6)',age:'Soy mayor de 18 años y acepto los términos',enter:'Entrar',guest:'Continuar como invitado',details:'Detalles del parlay',legsN:'{n} selecciones',addLeg:'+ Agregar selección',stakeT:'Monto y pago',stake:'Monto a apostar',comb:'Cuota combinada',pay:'Pago total',prof:'Ganancia potencial',calc:'Calcular parlay',note:'Pago estimado, sin comisiones • Se actualiza al editar',nCalc:'Calculadora',nBets:'Apuestas',nHist:'Historial',nSet:'Ajustes',betNow:'Apuesta este parlay en',sponsored:'Patrocinado',booksT:'Casas de apuestas',booksS:'Elige dónde apostar tu parlay.',bonus:'Bono de bienvenida • aplican T&C',play:'Apostar',histT:'Historial',empty:'Aún no hay parlays. Calcula uno y se guardará aquí.',load:'Usar',clear:'Borrar historial',setT:'Ajustes',lang:'Idioma',cur:'Moneda',acct:'Cuenta',out:'Cerrar sesión',proT:'ParlayLab Pro',proD:'Sin anuncios, alertas de cuotas y exportar tu historial.',proB:'Probar Pro',resp:'+18 • Juega con responsabilidad. Apostar puede causar adicción.',pick:'Selección (ej. Chiefs -3.5)',oddsPh:'Cuota americana (ej. -110)',save:'Agregar',cancel:'Cancelar',errC:'Correo o contraseña incorrectos',errE:'Ese correo ya está registrado',errO:'Cuota inválida para el formato elegido',saved:'Guardado en el historial',guestN:'Invitado',confirm:'Revisa tu correo para confirmar tu cuenta',fA:'Americano',fD:'Decimal',fF:'Fraccionario',pha:'Cuota americana (ej. -110 o +140)',phd:'Cuota decimal (ej. 1.91)',phf:'Cuota fraccionaria (ej. 10/11)',or:'o continúa con',demo:'Modo demo: agrega tu GOOGLE_CLIENT_ID en app.js',theme:'Tema',auto:'Auto',light:'Claro',dark:'Oscuro',ageReq:'Confirma que eres mayor de 18 años',privacy:'Política de privacidad',terms:'Términos y condiciones'},
en:{tagline:'Calculate, compare and bet smarter',subtitle:'Parlay Calculator • Build & calculate your parlay',login:'Log in',register:'Sign up',name:'Name',email:'Email',pass:'Password (min. 6)',age:'I am 18+ and accept the terms',enter:'Enter',guest:'Continue as guest',details:'Parlay Details',legsN:'{n} Legs',addLeg:'+ Add Leg',stakeT:'Stake & Payout',stake:'Stake Amount',comb:'Combined Odds',pay:'Total Payout',prof:'Potential Profit',calc:'Calculate Parlay',note:'Payout is estimated and does not include fees • Updates live as you edit',nCalc:'Calculator',nBets:'Bets',nHist:'History',nSet:'Settings',betNow:'Place this parlay at',sponsored:'Sponsored',booksT:'Sportsbooks',booksS:'Pick where to place your parlay.',bonus:'Welcome bonus • T&C apply',play:'Bet',histT:'History',empty:'No parlays yet. Calculate one and it will be saved here.',load:'Use',clear:'Clear history',setT:'Settings',lang:'Language',cur:'Currency',acct:'Account',out:'Log out',proT:'ParlayLab Pro',proD:'No ads, odds alerts and history export.',proB:'Try Pro',resp:'18+ • Gamble responsibly. Betting can be addictive.',pick:'Pick (e.g. Chiefs -3.5)',oddsPh:'American odds (e.g. -110)',save:'Add',cancel:'Cancel',errC:'Wrong email or password',errE:'That email is already registered',errO:'Invalid odds for the selected format',saved:'Saved to history',guestN:'Guest',confirm:'Check your email to confirm your account',fA:'American',fD:'Decimal',fF:'Fractional',pha:'American odds (e.g. -110 or +140)',phd:'Decimal odds (e.g. 1.91)',phf:'Fractional odds (e.g. 10/11)',or:'or continue with',demo:'Demo mode: add your GOOGLE_CLIENT_ID in app.js',theme:'Theme',auto:'Auto',light:'Light',dark:'Dark',ageReq:'Confirm you are 18 or older',privacy:'Privacy Policy',terms:'Terms of Service'}};
/* ===== UTILIDADES ===== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LS=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch{return null}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const ICON={NFL:'🏈',NBA:'🏀',NHL:'🏒',MLB:'⚾','Liga MX':'⚽',MLS:'⚽',Tenis:'🎾'};
let lang=LS('lang')||(navigator.language.startsWith('en')?'en':'es'),cur=LS('cur')||'MXN',reg=false;
let legs=LS('legs')||[{s:'NFL',p:'Ravens -3.5',o:-110},{s:'NBA',p:'Lakers ML',o:140},{s:'NHL',p:'Over 5.5',o:-120}];
const t=k=>T[lang][k]||k;
const fmt=n=>new Intl.NumberFormat(lang==='es'?'es-MX':'en-US',{style:'currency',currency:cur}).format(n);
const dec=o=>o>0?1+o/100:1+100/-o, fo=o=>o>0?'+'+o:''+o;
const am=d=>d>=2?Math.round((d-1)*100):Math.round(-100/(d-1));
let fmtO=LS('ofmt')||'american';
const ld=l=>l.d||dec(l.o),gcd=(a,b)=>b?gcd(b,a%b):a;
function frac(d){const x=d-1;let n=1,m=1,e=9;for(let q=1;q<=20;q++){const p=Math.round(x*q);if(p>0&&Math.abs(p/q-x)<e-1e-9){e=Math.abs(p/q-x);n=p;m=q}}const g=gcd(n,m);return n/g+'/'+m/g}
const show=d=>fmtO==='decimal'?d.toFixed(2):fmtO==='fractional'?frac(d):fo(am(d));
function parseOdds(s){let d=null;
  if(fmtO==='american'){if(/^[+-]?\d{3,4}$/.test(s)&&Math.abs(+s)>=100)d=dec(+s)}
  else if(fmtO==='decimal')d=+s.replace(',','.');
  else{const m=s.match(/^(\d+)\s*\/\s*(\d+)$/);if(m&&+m[1]>0&&+m[2]>0)d=1+m[1]/m[2]}
  return d>1&&isFinite(d)?d:null}
function fmtUI(){const i=['american','decimal','fractional'].indexOf(fmtO);$('#fmtSeg').style.setProperty('--i',i);$$('#fmtSeg button').forEach((b,k)=>b.classList.toggle('on',k===i));$('#od').placeholder=t('ph'+fmtO[0])}
const toast=m=>{const e=$('#toast');e.textContent=m;e.hidden=false;setTimeout(()=>e.hidden=true,1800)};
/* ===== RENDER ===== */
function calc(){const d=legs.reduce((a,l)=>a*ld(l),1),s=+$('#stake').value||0;return{d,s,pay:legs.length?s*d:0,prof:legs.length?s*d-s:0,o:legs.length?am(d):null}}
function tween(e,to){const a=e._v||0,t0=performance.now();e._v=to;(function f(n){const k=Math.min(1,(n-t0)/450);e.textContent=fmt(a+(to-a)*(1-Math.pow(1-k,3)));k<1&&requestAnimationFrame(f)})(t0)}
function totals(){const c=calc();$('#comb').textContent=c.o===null?'—':show(c.d);tween($('#pay'),c.pay);tween($('#prof'),c.prof)}
function render(){
  $('#legCount').textContent=t('legsN').replace('{n}',legs.length);
  $('#legs').innerHTML=legs.map((l,i)=>`<div class="leg${i===fresh?' pop':''}"><span class="ico">${ICON[l.s]||'🎯'}</span><div class="m"><b>${esc(l.s)} • ${esc(l.p)}</b></div><em>${show(ld(l))}</em><button data-del="${i}" aria-label="Eliminar">✕</button></div>`).join('');
  totals();
  const bk=BOOKS.map(b=>`<div class="bk"><i style="background:${b.c}">${b.n[0]}</i><div><b>${b.n}</b><small>${t('bonus')}</small></div><a href="${b.u}" target="_blank" rel="sponsored noopener">${t('play')}</a></div>`);
  $('#books').innerHTML=bk.join('');$('#quick').innerHTML=bk.slice(0,3).join('');
  const h=HIST;
  $('#histList').innerHTML=h.length?h.map(x=>{const d=x.legs.reduce((a,l)=>a*ld(l),1);return `<div class="leg"><div class="m"><b>${x.legs.length} • ${show(d)}</b><small>${new Date(x.ts||x.id).toLocaleDateString(lang==='es'?'es-MX':'en-US')} • ${fmt(x.stake)} → ${fmt(x.stake*d)}</small></div><button data-use="${x.id}">${t('load')}</button><button data-rm="${x.id}">✕</button></div>`}).join(''):`<p class="sub">${t('empty')}</p>`;
  $('#clearH').hidden=!h.length;LS('legs',legs);fresh=-1;
}
function apply(){
  document.documentElement.lang=lang;
  $$('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
  $$('[data-p]').forEach(e=>e.placeholder=t(e.dataset.p));
  $$('[data-l]').forEach(b=>b.classList.toggle('on',b.dataset.l===lang));
  $('#langSel').value=lang;fmtUI();$('#curSel').value=cur;proHref();render();
}
const setLang=l=>{lang=l;LS('lang',l);apply()};
function go(id){$$('.tab').forEach(e=>e.hidden=e.id!=='t-'+id);$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===id));scrollTo({top:0})}
/* ===== SESIÓN (Supabase) ===== */
let user=null,HIST=[];
const sbOk=()=>sb||(toast('Supabase no cargó: revisa tu internet y abre la página con Live Server'),0);
const errMsg=m=>/invalid login/i.test(m)?t('errC'):/already registered/i.test(m)?t('errE'):m;
function proHref(){$('#proLink').href=PRO_LINK+(user&&user.id?(PRO_LINK.includes('?')?'&':'?')+'client_reference_id='+user.id+'&prefilled_email='+encodeURIComponent(user.email||''):'')}
async function setUser(su){
  if(su){const m=su.user_metadata||{};user={id:su.id,email:su.email,name:m.full_name||m.name||su.email.split('@')[0],pic:m.avatar_url||m.picture}}
  else user=LS('guest')?{guest:true}:null;
  if(!user){$('#auth').hidden=false;$('#app').hidden=true;return}
  $('#auth').hidden=true;$('#app').hidden=false;
  const n=user.name||t('guestN');
  $('#avatar').textContent=user.pic?'':n[0].toUpperCase();$('#avatar').style.backgroundImage=user.pic?`url(${user.pic})`:'';
  $('#acct').textContent=user.email?`${n} • ${user.email}`:n;
  proHref();go('calc');await loadData()}
async function loadData(){
  let pro=false;
  if(user.id){
    const [h,p]=await Promise.all([sb.from('parlays').select('id,legs,stake,created_at').order('created_at',{ascending:false}).limit(50),sb.from('profiles').select('is_pro').maybeSingle()]);
    HIST=(h.data||[]).map(r=>({id:r.id,ts:Date.parse(r.created_at),legs:r.legs,stake:+r.stake}));pro=!!(p.data&&p.data.is_pro)}
  else HIST=LS('hist')||[];
  document.body.classList.toggle('isPro',pro);render()}
function init(){
  if(!sb)return setUser(null);
  sb.auth.onAuthStateChange((ev,s)=>{
    if(!['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT'].includes(ev)||(s&&user&&user.id===s.user.id))return;
    setTimeout(()=>setUser(s&&s.user),0)})}
function mode(r){reg=r;$('#authSeg').style.setProperty('--i',r?1:0);$('#name').hidden=!r;$('#err').textContent='';$('#tabUp').classList.toggle('on',r);$('#tabIn').classList.toggle('on',!r);$('#pass').autocomplete=r?'new-password':'current-password'}
$('#tabIn').onclick=()=>mode(false);$('#tabUp').onclick=()=>mode(true);
$('#authForm').onsubmit=async e=>{e.preventDefault();$('#err').textContent='';if(!sbOk())return;
  const email=$('#email').value.trim(),password=$('#pass').value,n=$('#name').value.trim();
  const r=reg?await sb.auth.signUp({email,password,options:{data:{full_name:n||email.split('@')[0]}}}):await sb.auth.signInWithPassword({email,password});
  if(r.error)return $('#err').textContent=errMsg(r.error.message);
  if(reg&&!r.data.session)toast(t('confirm'))};
$('#guest').onclick=()=>{LS('guest',1);setUser(null)};
$('#logout').onclick=async()=>{LS('guest',null);if(sb)await sb.auth.signOut();setUser(null)};
/* ===== EVENTOS ===== */
$$('[data-l]').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
$('#langSel').onchange=e=>setLang(e.target.value);
$('#curSel').onchange=e=>{cur=e.target.value;LS('cur',cur);render()};
$$('nav button').forEach(b=>b.onclick=()=>{go(b.dataset.t);navigator.vibrate&&navigator.vibrate(8)});
$('#avatar').onclick=()=>go('set');
$('#stake').oninput=totals;
$('#addBtn').onclick=()=>{$('#legForm').reset();$('#dlg').showModal()};
$('#legForm').onsubmit=e=>{if(e.submitter&&e.submitter.value==='x')return;
  const d=parseOdds($('#od').value.trim());
  if(!d){e.preventDefault();return toast(t('errO'))}
  legs.push({s:$('#sp').value,p:$('#pk').value.trim(),o:am(d),d});fresh=legs.length-1;render()};
$('#legs').onclick=e=>{const b=e.target.closest('[data-del]');if(b){legs.splice(+b.dataset.del,1);render()}};
$('#calcBtn').onclick=async()=>{if(!legs.length)return;const x={legs:[...legs],stake:calc().s};
  if(user&&user.id){const r=await sb.from('parlays').insert(x).select('id,created_at').single();if(r.error)return toast(r.error.message);HIST.unshift({...x,id:r.data.id,ts:Date.parse(r.data.created_at)})}
  else{HIST.unshift({...x,id:Date.now()});LS('hist',HIST.slice(0,50))}
  render();toast(t('saved'));$('#bet').scrollIntoView({behavior:'smooth'})};
$('#histList').onclick=async e=>{const u=e.target.closest('[data-use]'),r=e.target.closest('[data-rm]'),db=user&&user.id;
  if(u){const x=HIST.find(i=>i.id==u.dataset.use);if(x){legs=[...x.legs];$('#stake').value=x.stake;render();go('calc')}}
  if(r){if(db)await sb.from('parlays').delete().eq('id',r.dataset.rm);HIST=HIST.filter(i=>i.id!=r.dataset.rm);if(!db)LS('hist',HIST);render()}};
$('#clearH').onclick=async()=>{if(user&&user.id)await sb.from('parlays').delete().gt('id',0);else LS('hist',[]);HIST=[];render()};
/* ===== TEMA (auto / claro / oscuro) ===== */
let fresh=-1,theme=LS('theme')||'auto';const mq=matchMedia('(prefers-color-scheme: light)');
function setTheme(p,save){theme=p;if(save)LS('theme',p);const r=p==='auto'?(mq.matches?'light':'dark'):p,i=['auto','light','dark'].indexOf(p);
  document.documentElement.dataset.theme=r;$('#tc').content=r==='light'?'#eaf1ec':'#050806';
  $$('.themeBtn').forEach(b=>b.textContent=r==='light'?'🌙':'☀️');
  $('#themeSeg').style.setProperty('--i',i);$$('#themeSeg button').forEach((b,j)=>b.classList.toggle('on',j===i))}
$$('.themeBtn').forEach(b=>b.onclick=()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light',1));
$$('#themeSeg button').forEach(b=>b.onclick=()=>setTheme(b.dataset.th,1));
mq.onchange=()=>theme==='auto'&&setTheme('auto');
/* ===== LOGIN SOCIAL (Google / Apple / Facebook vía Supabase) ===== */
async function social(p){
  if(!$('#age').checked){toast(t('ageReq'));return $('#age').focus()}
  if(!sbOk())return;
  const r=await sb.auth.signInWithOAuth({provider:p,options:{redirectTo:location.origin+location.pathname}});
  if(r.error)toast(errMsg(r.error.message))}
$$('[data-s]').forEach(b=>b.onclick=()=>social(b.dataset.s));
$$('#fmtSeg button').forEach(b=>b.onclick=()=>{fmtO=b.dataset.f;LS('ofmt',fmtO);render();fmtUI()});
setTheme(theme);apply();init();