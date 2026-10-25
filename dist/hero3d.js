/* Ernesto Musca — scena 3D dell'hero: il marchio estruso e i prodotti che gli girano intorno.
   Lo scroll apre la scatola e allarga la composizione; il mouse la inclina appena. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.querySelector('.hero-canvas');
const hero = document.querySelector('.hero');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function fail() { document.documentElement.classList.add('no-webgl'); if (canvas) canvas.remove(); }

async function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return fail(); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x15120f, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x15120f, 16, 30);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const key = new THREE.DirectionalLight(0xfff1e0, 2.2); key.position.set(-5, 7, 8); scene.add(key);
  const rim = new THREE.PointLight(0xe5452f, 60, 18, 1.6); rim.position.set(5, -1, -3); scene.add(rim);
  const fill = new THREE.PointLight(0xb88a57, 25, 16, 1.6); fill.position.set(-4, -4, 4); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const canvasTex = (w, h, draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
    return t;
  };
  const markImg = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'assets/mark.svg'; });
  try { await document.fonts.ready; } catch (e) {}
  const SANS = '"Hanken Grotesk", Arial, sans-serif';
  const SERIF = '"Instrument Serif", Georgia, serif';

  const fibres = (g, w, h, base, n, alpha) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
      g.fillStyle = `rgba(${Math.random() < .5 ? '255,240,220' : '60,35,15'},${Math.random() * alpha})`;
      g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
    }
  };

  /* Materiali */
  const kraftTex = canvasTex(1024, 768, (g, w, h) => {
    fibres(g, w, h, '#b9895a', 9000, .16);
    if (markImg) { g.globalAlpha = .9; g.drawImage(markImg, w * .1, h * .22, 150, 155); g.globalAlpha = 1; }
    g.fillStyle = '#2a1d12'; g.font = `500 64px ${SANS}`; g.fillText('Ernesto Musca', w * .1 + 180, h * .22 + 70);
    g.font = `italic 46px ${SERIF}`; g.fillText('sempre con te.', w * .1 + 182, h * .22 + 128);
    g.fillStyle = 'rgba(42,29,18,.65)'; g.font = `500 22px ${SANS}`;
    g.fillText('↑ ALTO    ·    FRAGILE    ·    GALATONE (LE)', w * .1, h * .82);
  });
  const kraftPlain = canvasTex(512, 512, (g, w, h) => fibres(g, w, h, '#b48452', 4000, .16));
  const kraft = new THREE.MeshStandardMaterial({ map: kraftTex, roughness: .88 });
  const kraftSide = new THREE.MeshStandardMaterial({ map: kraftPlain, roughness: .9 });
  const red = new THREE.MeshPhysicalMaterial({ color: 0x9e1a14, roughness: .38, metalness: 0, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: .7 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xf3eee6, roughness: .78 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x1d1915, roughness: .45 });
  const wood = new THREE.MeshStandardMaterial({ color: 0xd8b98f, roughness: .7 });

  const cluster = new THREE.Group(); scene.add(cluster);
  const items = [];
  const add = (obj, pos, rot, float = 1) => {
    obj.position.copy(pos); obj.rotation.set(rot.x, rot.y, rot.z);
    obj.userData = { base: pos.clone(), rot: rot.clone(), phase: Math.random() * Math.PI * 2, float, spin: (Math.random() - .5) * .25 };
    cluster.add(obj); items.push(obj); return obj;
  };

  /* 1 · Il marchio, estruso dall'SVG */
  const mark = new THREE.Group();
  try {
    const svgText = await fetch('assets/mark.svg').then(r => r.text());
    const svg = new SVGLoader().parse(svgText);
    const shapes = [];
    svg.paths.forEach(p => SVGLoader.createShapes(p).forEach(s => {
      const pts = s.extractPoints(1);
      const flip = arr => arr.map(v => new THREE.Vector2(v.x, -v.y));
      const shape = new THREE.Shape(flip(pts.shape));
      pts.holes.forEach(hp => shape.holes.push(new THREE.Path(flip(hp))));
      shapes.push(shape);
    }));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 70, bevelEnabled: true, bevelThickness: 8, bevelSize: 5, bevelSegments: 3, curveSegments: 1 });
    geo.center();
    const s = 2.7 / 734; geo.scale(s, s, s);
    geo.computeVertexNormals();
    mark.add(new THREE.Mesh(geo, red));
  } catch (e) { /* senza marchio la scena resta comunque valida */ }
  add(mark, new THREE.Vector3(0, .15, 0), new THREE.Euler(-.08, -.42, .04), .5);

  /* 2 · Scatola in cartone con le alette che si aprono */
  const box = new THREE.Group();
  const BW = 1.9, BH = 1.35, BD = 1.45;
  const body = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, BD), [kraftSide, kraftSide, kraftSide, kraftSide, kraft, kraftSide]);
  box.add(body);
  const flaps = [];
  const makeFlap = (w, d, pivot, axis, dir, dy) => {
    const g = new THREE.BoxGeometry(axis === 'x' ? w : d, .018, axis === 'x' ? d : w);
    if (axis === 'x') g.translate(0, 0, -dir * d / 2); else g.translate(-dir * d / 2, 0, 0);
    const m = new THREE.Mesh(g, kraftSide);
    const p = new THREE.Group(); p.position.set(pivot.x, pivot.y + dy, pivot.z); p.add(m); box.add(p);
    flaps.push({ p, axis, dir }); return p;
  };
  makeFlap(BW, BD / 2, new THREE.Vector3(0, BH / 2, BD / 2), 'x', 1, .012);
  makeFlap(BW, BD / 2, new THREE.Vector3(0, BH / 2, -BD / 2), 'x', -1, .012);
  makeFlap(BD, BW / 2 - .05, new THREE.Vector3(BW / 2, BH / 2, 0), 'z', 1, 0);
  makeFlap(BD, BW / 2 - .05, new THREE.Vector3(-BW / 2, BH / 2, 0), 'z', -1, 0);
  // nastro rosso sul fronte
  const tape = new THREE.Mesh(new THREE.BoxGeometry(.32, BH + .004, .004), red); tape.position.z = BD / 2 + .002; box.add(tape);
  add(box, new THREE.Vector3(2.35, -1.55, -.9), new THREE.Euler(.32, -.55, .06));

  /* 3 · Bicchieri in carta impilati */
  const cupTex = canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = '#f6f2ea'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c52d25'; g.fillRect(0, h * .62, w, h * .14);
    if (markImg) for (let i = 0; i < 3; i++) g.drawImage(markImg, w * (.12 + i * .333), h * .18, 70, 72);
  });
  const cupOuter = new THREE.MeshStandardMaterial({ map: cupTex, roughness: .6 });
  const cupInner = new THREE.MeshStandardMaterial({ color: 0xece5da, roughness: .7, side: THREE.BackSide });
  const makeCup = () => {
    const c = new THREE.Group();
    const geo = new THREE.CylinderGeometry(.46, .33, 1.15, 48, 1, true);
    c.add(new THREE.Mesh(geo, cupOuter), new THREE.Mesh(geo, cupInner));
    const rimR = new THREE.Mesh(new THREE.TorusGeometry(.46, .022, 10, 48), paper); rimR.rotation.x = Math.PI / 2; rimR.position.y = .575; c.add(rimR);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(.33, 32), paper); bottom.rotation.x = -Math.PI / 2; bottom.position.y = -.56; c.add(bottom);
    return c;
  };
  const cups = new THREE.Group();
  for (let i = 0; i < 3; i++) { const c = makeCup(); c.position.y = i * .2; cups.add(c); }
  add(cups, new THREE.Vector3(-2.05, 1.35, .5), new THREE.Euler(.25, .3, -.32));

  /* 4 · Flacone di detergente */
  const bottle = new THREE.Group();
  const prof = [[0, 0], [.4, 0], [.46, .06], [.47, .2], [.47, 1.25], [.44, 1.4], [.3, 1.56], [.2, 1.64], [.2, 1.72], [0, 1.72]].map(p => new THREE.Vector2(p[0], p[1]));
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 64), new THREE.MeshPhysicalMaterial({ color: 0xefe9de, roughness: .38, clearcoat: .5, clearcoatRoughness: .3 })));
  const labelTex = canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#15120f'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c52d25'; g.fillRect(0, h - 26, w, 26);
    g.fillStyle = '#f4f0e8'; g.font = `500 66px ${SANS}`; g.fillText('Detergenza', 300, 190);
    g.font = `italic 58px ${SERIF}`; g.fillStyle = '#e5452f'; g.fillText('professionale', 300, 262);
    g.fillStyle = 'rgba(244,240,232,.55)'; g.font = `500 22px ${SANS}`; g.fillText('SUPERFICI  ·  CUCINE  ·  BAGNI', 302, 330);
  });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(.475, .475, .78, 64, 1, true), new THREE.MeshStandardMaterial({ map: labelTex, roughness: .5 }));
  label.position.y = .68; bottle.add(label);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.23, .24, .36, 40), red); cap.position.y = 1.86; bottle.add(cap);
  add(bottle, new THREE.Vector3(2.15, 1.25, -.6), new THREE.Euler(-.1, -.9, .22));

  /* 5 · Rotolo di carta */
  const roll = new THREE.Group();
  const rollTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#f7f3ec'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(120,100,80,.12)';
    for (let x = 6; x < w; x += 14) for (let y = 6; y < h; y += 14) { g.beginPath(); g.arc(x + (y / 14 % 2) * 7, y, 2.2, 0, 7); g.fill(); }
  });
  rollTex.wrapS = rollTex.wrapT = THREE.RepeatWrapping; rollTex.repeat.set(3, 2);
  roll.add(new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 1.05, 64, 1, true), new THREE.MeshStandardMaterial({ map: rollTex, roughness: .85 })));
  const endTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#f1ebe1'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(110,90,70,.18)';
    for (let r = 84; r < 256; r += 4) { g.lineWidth = Math.random() * 1.4 + .3; g.beginPath(); g.arc(256, 256, r, 0, 7); g.stroke(); }
  });
  const ends = new THREE.MeshStandardMaterial({ map: endTex, roughness: .9, side: THREE.DoubleSide });
  [-1, 1].forEach(sg => { const e = new THREE.Mesh(new THREE.RingGeometry(.2, .62, 64), ends); e.rotation.x = sg * Math.PI / 2; e.position.y = sg * .525; roll.add(e); });
  roll.add(new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 1.05, 32, 1, true), new THREE.MeshStandardMaterial({ map: kraftPlain, roughness: .9, side: THREE.BackSide })));
  add(roll, new THREE.Vector3(.15, -2.45, 1.1), new THREE.Euler(1.2, .2, .5));

  /* 6 · Cartone pizza con il marchio sul coperchio */
  const lidTex = canvasTex(1024, 1024, (g, w, h) => {
    fibres(g, w, h, '#f1ebe0', 6000, .07);
    g.strokeStyle = '#c52d25'; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2, 360, 0, 7); g.stroke();
    if (markImg) g.drawImage(markImg, w / 2 - 110, h / 2 - 150, 220, 226);
    g.fillStyle = '#15120f'; g.textAlign = 'center'; g.font = `italic 64px ${SERIF}`; g.fillText('buon appetito', w / 2, h / 2 + 150);
  });
  const pizza = new THREE.Mesh(new THREE.BoxGeometry(2.1, .3, 2.1), [paper, paper, new THREE.MeshStandardMaterial({ map: lidTex, roughness: .8 }), paper, paper, paper]);
  add(pizza, new THREE.Vector3(-2.2, -1.7, -1.6), new THREE.Euler(.95, .45, -.15), .7);

  /* 7 · Cucchiaio in legno */
  const spoon = new THREE.Group();
  const headShape = new THREE.Shape(); headShape.absellipse(0, 0, .24, .34, 0, Math.PI * 2);
  const head = new THREE.Mesh(new THREE.ExtrudeGeometry(headShape, { depth: .04, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 2, curveSegments: 32 }), wood);
  head.position.y = .62; spoon.add(head);
  const handle = new THREE.Mesh(new RoundedBoxGeometry(.11, 1.2, .05, 3, .02), wood); handle.position.set(0, -.25, .02); spoon.add(handle);
  spoon.scale.setScalar(.85);
  add(spoon, new THREE.Vector3(-1.75, -.55, 1.7), new THREE.Euler(.4, .5, -1.1), 1.2);

  /* 8 · Piccoli cubetti di carta/sapone per profondità */
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(new RoundedBoxGeometry(.22, .22, .22, 2, .05), i % 3 ? paper : red);
    const a = i / 7 * Math.PI * 2;
    add(m, new THREE.Vector3(Math.cos(a) * 3.6, Math.sin(a) * 2.6, -2.5 + Math.random() * 2), new THREE.Euler(Math.random() * 3, Math.random() * 3, 0), 1.6);
  }

  /* Layout reattivo */
  let layout = { x: 3.3, y: 0, s: .95 };
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const visW = visH * camera.aspect;
    if (camera.aspect > 1.15) layout = { x: visW * .23, y: -.1, s: Math.min(1, visW / 15) };
    else layout = { x: 0, y: visH * .3, s: Math.min(.72, visW / 9) };
  }
  window.addEventListener('resize', resize); resize();

  /* Input */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; }, { passive: true });

  let visible = true, running = false, t0 = performance.now(), appear = reduced ? 1 : 0;
  const startDelay = document.documentElement.classList.contains('js-intro') ? 1.5 : .1;
  const ease = k => 1 - Math.pow(1 - k, 3);
  let sp = 0;

  function render(now) {
    const t = (now - t0) / 1000;
    const p = window.EMheroProgress || 0;
    sp += (p - sp) * (reduced ? 1 : .08);
    if (!reduced) appear = Math.min(1, Math.max(0, (t - startDelay) / 1.6));
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;

    const spread = 1 + ease(Math.min(1, sp * 1.6)) * .55;
    cluster.position.set(layout.x + sp * layout.x * .18, layout.y + sp * (layout.x ? .4 : 1.2), -sp * 2);
    cluster.scale.setScalar(layout.s * (.85 + .15 * ease(appear)));
    cluster.rotation.set(.08 + mouse.y * .18 + sp * .25, -.15 + mouse.x * .35 + sp * 1.4, 0);

    items.forEach((o, i) => {
      const u = o.userData;
      const local = Math.min(1, Math.max(0, appear * 1.6 - i * .06));
      const k = ease(local);
      const fl = reduced ? 0 : Math.sin(t * .8 + u.phase) * .12 * u.float;
      o.position.set(u.base.x * spread, u.base.y * spread + fl - (1 - k) * 1.5, u.base.z * spread);
      o.scale.setScalar(Math.max(.001, k));
      o.rotation.set(u.rot.x + (reduced ? 0 : Math.sin(t * .5 + u.phase) * .06), u.rot.y + (reduced ? 0 : t * u.spin * .4) + sp * u.spin * 4, u.rot.z);
    });
    mark.rotation.y = -.42 + (reduced ? 0 : Math.sin(t * .4) * .12) + sp * .9;

    // le alette si aprono tra il 5% e il 45% dello scroll dell'hero
    const open = ease(Math.min(1, Math.max(0, (sp - .05) / .4)));
    flaps.forEach((f, i) => {
      const a = .12 + open * (i < 2 ? 2.15 : 1.95);
      if (f.axis === 'x') f.p.rotation.x = f.dir * a; else f.p.rotation.z = -f.dir * a;
    });

    renderer.render(scene, camera);
  }
  function loop(now) { if (!visible) { running = false; return; } render(now); requestAnimationFrame(loop); }
  function start() { if (!running && visible) { running = true; requestAnimationFrame(loop); } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }).observe(hero);
  }
  if (reduced) {
    const once = () => render(performance.now());
    window.addEventListener('scroll', () => requestAnimationFrame(once), { passive: true });
    window.addEventListener('resize', once);
    once();
  } else start();
  canvas.classList.add('is-on');
}

if (canvas && hero) init().catch(err => { console.warn('Hero 3D non disponibile:', err); fail(); });
