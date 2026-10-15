const products = {
  "detergenza": {
    "title": "Detergenza professionale",
    "number": "01",
    "image": "01_detergenza",
    "description": "Dai pavimenti ai vetri, dalle superfici lavabili al bagno: una linea dedicata alla pulizia professionale. Comprende prodotti per cucine e mense, detergenti concentrati e soluzioni specifiche per lavastoviglie.",
    "items": [
      "Detergente pavimenti",
      "Detergente superfici",
      "Detergente vetri",
      "Detergente bagno",
      "Disincrostante",
      "Sgrassatore",
      "Detergente igienizzante",
      "Detergente per superfici lavabili",
      "Detergente per cucine e mense",
      "Detergenti professionali concentrati",
      "Brillantante lavastoviglie",
      "Detergente lavastoviglie",
      "Disincrostante lavastoviglie"
    ]
  },
  "carta": {
    "title": "Carta",
    "number": "02",
    "image": "02_carta",
    "description": "Carta per l’igiene, l’asciugatura e il servizio. Dalla carta igienica ai tovaglioli, dagli asciugamani alla carta industriale: formati diversi per le esigenze quotidiane della tua attività.",
    "items": [
      "Carta igienica",
      "Asciugamani piegati",
      "Asciugamani in rotolo",
      "Carta industriale",
      "Bobine",
      "Tovaglioli"
    ]
  },
  "monouso": {
    "title": "Monouso",
    "number": "03",
    "image": "03_monouso",
    "description": "Una linea di prodotti monouso e consumabili per il lavoro di ogni giorno. Guanti e copriscarpe, bicchieri e cannucce, fino alle shopper bio.",
    "items": [
      "Guanti",
      "Bicchieri",
      "Cannucce",
      "Copriscarpe",
      "Shopper bio",
      "Altri consumabili"
    ]
  },
  "attrezzature": {
    "title": "Attrezzature",
    "number": "04",
    "image": "04_attrezzature",
    "description": "Gli strumenti per le operazioni di pulizia: mop, frange e manici, insieme a panni e spugne. La linea comprende anche secchi, carrelli, tergivetro e dispenser.",
    "items": [
      "Mop",
      "Frange",
      "Manici",
      "Panni",
      "Spugne",
      "Secchi",
      "Carrelli",
      "Tergivetro",
      "Dispenser"
    ]
  },
  "food": {
    "title": "Monouso per il settore food",
    "number": "05",
    "image": "05_food",
    "description": "Prodotti monouso dedicati al settore alimentare: piatti e bicchieri, posate e contenitori in legno. Completano la linea vaschette e pellicole termosaldabili, box e vassoi.",
    "items": [
      "Piatti e bicchieri",
      "Posate in legno",
      "Contenitori in legno",
      "Vaschette termosaldabili",
      "Pellicole termosaldabili",
      "Box e vassoi"
    ]
  },
  "imballaggi": {
    "title": "Imballaggi e contenitori",
    "number": "06",
    "image": "06_imballaggi",
    "description": "Scatole, contenitori e materiali da imballaggio per la tua attività. La proposta include imballaggi per alimenti, scatole in cartone per pizzerie e scatole e vassoi per dolci e pasticceria.",
    "items": [
      "Scatole in cartone",
      "Imballaggi per alimenti",
      "Contenitori in plastica",
      "Buste e sacchetti",
      "Film estensibile",
      "Reggette",
      "Scatole in cartone per pizzerie",
      "Scatole e vassoi per dolci e pasticceria"
    ]
  }
};
const loader=document.querySelector('.loader');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
function finishIntro(){
 clearTimeout(introTimer);
 loader.hidden=true;
 loader.classList.remove('is-playing');
}
function playIntro(){
 finishIntro();
 if(reduceMotion.matches)return;
 // Arm the escape timer before showing anything; CSS also closes independently.
 introTimer=setTimeout(finishIntro,3200);
 try{
  if(!loader.querySelector('.brand-intro-mark')||!loader.querySelector('.brand-intro-name'))return finishIntro();
  loader.hidden=false;
  void loader.offsetWidth;
  loader.classList.add('is-playing');
 }catch(error){finishIntro()}
}
loader.addEventListener('animationend',e=>{if(e.target===loader&&e.animationName==='intro-dismiss')finishIntro()});
if(reduceMotion.addEventListener)reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches)finishIntro()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')finishIntro()});
window.addEventListener('pagehide',finishIntro);
window.addEventListener('pageshow',e=>{if(e.persisted)finishIntro()});
// Defer the decorative intro until the rest of the page is initialized.
setTimeout(playIntro,0);
const menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.innerHTML='Menu <span aria-hidden="true">＋</span>'}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.innerHTML=open?'Chiudi <span aria-hidden="true">−</span>':'Menu <span aria-hidden="true">＋</span>'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
const header=document.querySelector('.site-header');
let lastScroll=window.scrollY,travel=0,lastDirection=0,scrollQueued=false;
function updateHeader(){
 const y=Math.max(0,window.scrollY),delta=y-lastScroll,direction=Math.sign(delta);
 if(direction!==lastDirection)travel=0;
 travel+=delta;
 header.classList.toggle('scrolled',y>12);
 if(y<100||nav.classList.contains('open'))header.classList.remove('header-away');
 else if(travel < -7)header.classList.remove('header-away');
 else if(travel > 35&&y>180&&!header.contains(document.activeElement))header.classList.add('header-away');
 lastScroll=y;if(direction)lastDirection=direction;scrollQueued=false;
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateHeader)}},{passive:true});
header.addEventListener('focusin',()=>header.classList.remove('header-away'));
menu.addEventListener('click',()=>header.classList.remove('header-away'));
updateHeader();
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelector('#privacy-button').addEventListener('click',()=>document.querySelector('#privacy-dialog').showModal());
document.querySelector('#request-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const subject='Richiesta informazioni — '+data.get('category');const body=`Buongiorno,\n\nsono ${data.get('name')}${data.get('company')?' di '+data.get('company'):''}.\nSono interessato/a a: ${data.get('category')}.\n\n${data.get('message')}\n\nEmail: ${data.get('email')}\n\nGrazie,\n${data.get('name')}`;window.location.href='mailto:info@ernestomusca.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.querySelector('#form-status').textContent='Richiesta preparata. Completa l’invio nella tua app email. Se non si apre, scrivi a info@ernestomusca.com.'});
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.07});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

// Native page scrolling controls the image; content stays readable without JavaScript.
const stories=[...document.querySelectorAll('.line-story')];
const visuals=[...document.querySelectorAll('.line-visual')];
const progress=[...document.querySelectorAll('.line-progress span')];
let activeLine=-1,lineFrame=0;
function syncLineImage(){
 lineFrame=0;
 const anchor=window.innerHeight*.45;
 let next=0;
 stories.forEach((story,i)=>{if(story.getBoundingClientRect().top<=anchor)next=i});
 if(next===activeLine)return;
 activeLine=next;
 visuals.forEach((visual,i)=>visual.classList.toggle('is-active',i===next));
 progress.forEach((item,i)=>item.classList.toggle('is-active',i===next));
}
function queueLineSync(){if(!lineFrame)lineFrame=requestAnimationFrame(syncLineImage)}
window.addEventListener('scroll',queueLineSync,{passive:true});
window.addEventListener('resize',queueLineSync);
window.addEventListener('pageshow',queueLineSync);
syncLineImage();
document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{
 document.querySelector('#category').value=products[link.dataset.inquiry].title;
}));
