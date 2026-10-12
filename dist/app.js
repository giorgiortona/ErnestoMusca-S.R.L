const products = {
 detergenza:{title:'Detergenza',number:'01',image:'01_detergenza',description:'Soluzioni per la pulizia e la cura di ogni ambiente di lavoro.',items:['Detergenti per pavimenti, superfici e vetri','Prodotti per bagno, cucine e mense','Sgrassatori e disincrostanti','Detergenti igienizzanti e concentrati','Detergenti e brillantanti per lavastoviglie']},
 carta:{title:'Carta',number:'02',image:'02_carta',description:'Una gamma completa per l’igiene quotidiana e il servizio.',items:['Carta igienica','Asciugamani piegati e in rotolo','Carta industriale e bobine','Tovaglioli']},
 monouso:{title:'Monouso',number:'03',image:'03_monouso',description:'I consumabili che rendono più semplice il tuo lavoro, ogni giorno.',items:['Guanti e copriscarpe','Bicchieri e cannucce','Shopper bio','Consumabili per la tua attività']},
 attrezzature:{title:'Attrezzature',number:'04',image:'04_attrezzature',description:'Tutto l’occorrente per prenderti cura dei tuoi spazi.',items:['Mop, frange e manici','Panni e spugne','Secchi e carrelli','Tergivetro e dispenser']},
 food:{title:'Settore food',number:'05',image:'05_food',description:'Monouso per la ristorazione, l’asporto e ogni momento di servizio.',items:['Piatti e bicchieri','Posate e contenitori in legno','Vaschette e pellicole termosaldabili','Box e vassoi']},
 imballaggi:{title:'Packaging',number:'06',image:'06_imballaggi',description:'Imballaggi e contenitori per custodire, trasportare e presentare.',items:['Scatole in cartone e per pizzerie','Imballaggi per alimenti','Contenitori in plastica','Buste e sacchetti','Film estensibile e reggette','Scatole e vassoi per dolci e pasticceria']}
};
const loader=document.querySelector('.loader');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let introAnimations=[],introTimer;
function finishIntro(){clearTimeout(introTimer);loader.hidden=true;introAnimations.forEach(a=>a.cancel());introAnimations=[]}
function playIntro(){
 finishIntro();if(reduceMotion.matches)return;
 loader.hidden=false;
 const ease='cubic-bezier(.65,0,.25,1)';
 const animate=(element,frames,options)=>{const animation=element.animate(frames,{fill:'both',easing:ease,...options});introAnimations.push(animation);return animation};
 const name=loader.querySelector('.intro-name'),logo=loader.querySelector('.composed-logo');
 const e=loader.querySelector('.initial-e'),m=loader.querySelector('.initial-m');
 const box=logo.getBoundingClientRect();
 animate(name,[{opacity:0},{opacity:1}],{duration:400});
 loader.querySelectorAll('.name-rest,.name-space').forEach(el=>animate(el,[{opacity:1,filter:'blur(0px)'},{opacity:0,filter:'blur(6px)'}],{delay:600,duration:450}));
 for(const [letter,x,y,scale] of [[e,.63,.62,.85],[m,.5,.37,1.65]]){
  const rect=letter.getBoundingClientRect();const dx=box.left+box.width*x-(rect.left+rect.width/2),dy=box.top+box.height*y-(rect.top+rect.height/2);
  animate(letter,[{transform:'translate(0,0) scale(1)',opacity:1,offset:0},{transform:`translate(${dx}px,${dy}px) scale(${scale})`,opacity:1,offset:.74},{transform:`translate(${dx}px,${dy}px) scale(${scale})`,opacity:0,offset:1}],{delay:800,duration:1000});
 }
 const pieces=[['.piece-left',-22,-12,1300],['.piece-right',22,-12,1370],['.piece-bottom',0,24,1440],['.piece-e',0,0,1490]];
 pieces.forEach(([selector,x,y,delay])=>animate(loader.querySelector(selector),[{opacity:0,transform:`translate(${x}px,${y}px) scale(.92)`},{opacity:1,transform:'translate(0,0) scale(1)'}],{delay,duration:580}));
 animate(loader.querySelector('.logo-whole'),[{opacity:0},{opacity:1}],{delay:2050,duration:120});
 animate(loader.querySelector('.intro-signature'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{delay:1850,duration:450});
 const exit=animate(loader,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-30px)'}],{delay:2550,duration:500});
 exit.finished.then(finishIntro).catch(()=>{});
 introTimer=setTimeout(finishIntro,3400);
}
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches)finishIntro()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')finishIntro()});
document.querySelector('#replay-intro').addEventListener('click',playIntro);
playIntro();
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
const dialog=document.querySelector('#product-dialog');let currentProduct;
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{currentProduct=products[button.dataset.product];document.querySelector('#dialog-title').textContent=currentProduct.title;document.querySelector('#dialog-number').textContent='Linea '+currentProduct.number;document.querySelector('#dialog-description').textContent=currentProduct.description;const img=document.querySelector('#dialog-image');img.src='assets/'+currentProduct.image+'.webp';img.alt=currentProduct.title;document.querySelector('#dialog-products').replaceChildren(...currentProduct.items.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));dialog.showModal()}));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelector('#product-inquiry').addEventListener('click',()=>{document.querySelector('#category').value=currentProduct.title;dialog.close();document.querySelector('#contatti').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('[name="name"]').focus({preventScroll:true})});
document.querySelector('#privacy-button').addEventListener('click',()=>document.querySelector('#privacy-dialog').showModal());
document.querySelector('#request-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const subject='Richiesta informazioni — '+data.get('category');const body=`Buongiorno,\n\nsono ${data.get('name')}${data.get('company')?' di '+data.get('company'):''}.\nSono interessato/a a: ${data.get('category')}.\n\n${data.get('message')}\n\nEmail: ${data.get('email')}\n\nGrazie,\n${data.get('name')}`;window.location.href='mailto:info@ernestomusca.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.querySelector('#form-status').textContent='Richiesta preparata. Completa l’invio nella tua app email. Se non si apre, scrivici su WhatsApp.'});
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.07});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
