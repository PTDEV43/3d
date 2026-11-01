import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const $ = (s) => document.querySelector(s);
const viewport = $('#viewport'), wrap = $('#viewportWrap'), toast = $('#toast');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#111a27');
scene.fog = new THREE.Fog('#111a27', 14, 30);
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(0, 5.2, 11.8);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
viewport.appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,1.2,0); controls.enableDamping=true; controls.minDistance=6; controls.maxDistance=19;
scene.add(new THREE.HemisphereLight(0xb9d0ef,0x25202a,2));
const key = new THREE.DirectionalLight(0xffffff,3); key.position.set(-4,9,5); key.castShadow=true; scene.add(key);
const blueLight = new THREE.PointLight(0x247bff,24,12); blueLight.position.set(-4,4,-2); scene.add(blueLight);
const redLight = new THREE.PointLight(0xff4055,24,12); redLight.position.set(4,4,-2); scene.add(redLight);
const material = (c) => new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:.08});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100,100),material('#0b111a')); ground.rotation.x=-Math.PI/2; ground.position.y=-.2; ground.receiveShadow=true; scene.add(ground);
const ring = new THREE.Mesh(new THREE.BoxGeometry(9,.35,7),material('#344355')); ring.position.y=0; ring.receiveShadow=true; scene.add(ring);
const matRope=material('#8997a8'), matPost=material('#182332');
for(const x of [-4.3,4.3]) for(const z of [-3.3,3.3]) { const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,2.4,12),matPost); p.position.set(x,1.3,z); p.castShadow=true; scene.add(p); }
for(let i=0;i<3;i++){const y=.7+i*.58;for(const z of [-3.3,3.3]){const r=new THREE.Mesh(new THREE.BoxGeometry(8.6,.045,.045),matRope);r.position.set(0,y,z);scene.add(r);}for(const x of [-4.3,4.3]){const r=new THREE.Mesh(new THREE.BoxGeometry(.045,.045,6.6),matRope);r.position.set(x,y,0);scene.add(r);}}
function fighter(color,x,face){
 const root=new THREE.Group();root.position.set(x,.2,0);root.rotation.y=face;scene.add(root);
 const body=new THREE.Group();root.add(body);const skin=material('#b7c1cc'), cloth=material(color);
 function mesh(g,m,y,z=0){const o=new THREE.Mesh(g,m);o.position.set(0,y,z);o.castShadow=true;body.add(o);return o;}
 mesh(new THREE.CapsuleGeometry(.34,.72,6,12),skin,1.55).scale.set(1,1,.75);
 mesh(new THREE.SphereGeometry(.37,16,12),skin,1.85).scale.set(1.1,.72,.72);
 mesh(new THREE.SphereGeometry(.24,18,14),skin,2.35).scale.set(.9,1.05,.9);
 mesh(new THREE.BoxGeometry(.68,.4,.5),cloth,.98);
 const arms=[],legs=[];
 for(const side of [-1,1]){const shoulder=new THREE.Group();shoulder.position.set(side*.4,1.95,0);body.add(shoulder);const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.34,5,10),skin);upper.position.y=-.22;shoulder.add(upper);const elbow=new THREE.Group();elbow.position.y=-.42;shoulder.add(elbow);const fore=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.32,5,10),skin);fore.position.y=-.2;elbow.add(fore);const glove=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),cloth);glove.position.y=-.47;elbow.add(glove);arms.push({shoulder,elbow,side});
 const hip=new THREE.Group();hip.position.set(side*.2,.98,0);body.add(hip);const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.48,5,10),skin);thigh.position.y=-.3;hip.add(thigh);const knee=new THREE.Group();knee.position.y=-.6;hip.add(knee);const shin=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.48,5,10),skin);shin.position.y=-.3;knee.add(shin);const foot=new THREE.Mesh(new THREE.BoxGeometry(.22,.13,.4),skin);foot.position.set(0,-.57,.1);knee.add(foot);legs.push({hip,knee,side});}
 return {root,body,arms,legs,color:cloth};
}
const blue=fighter('#247bff',-1.65,-Math.PI/2), red=fighter('#f04452',1.65,Math.PI/2);
const clamp=THREE.MathUtils.clamp, clock=new THREE.Clock(), duration=8;
let action='idle',elapsed=0,playing=false,speed=1,loop=true,recorder=null,chunks=[];
const pulse=(a,b,t)=>Math.sin(Math.PI*clamp((t-a)/(b-a),0,1));
function reset(f){f.body.position.set(0,0,0);f.body.rotation.set(0,0,0);f.arms.forEach(a=>{a.shoulder.rotation.set(a.side*.15,0,a.side*.35);a.elbow.rotation.x=-.8;});f.legs.forEach(l=>{l.hip.rotation.set(0,0,l.side*.04);l.knee.rotation.set(0,0,0);});}
function pose(){
 reset(blue);reset(red);const p=(a,b)=>pulse(a,b,elapsed);
 if(action==='punch'){let q=p(.12,.75);blue.arms[1].shoulder.rotation.x=-1.3*q;blue.arms[1].shoulder.rotation.z=-.35*q;blue.body.rotation.y=-.25*q;red.body.position.z=-.12*q;red.body.rotation.x=-.16*q;red.arms.forEach(a=>a.shoulder.rotation.x=-1.05);}
 else if(action==='kick'){let q=p(.15,.86);blue.legs[1].hip.rotation.x=-1.8*q;blue.legs[1].knee.rotation.x=.25*q;blue.body.rotation.x=.12*q;blue.arms.forEach(a=>a.shoulder.rotation.x=-.7);red.body.position.z=-.13*q;}
 else if(action==='sweep'){let q=p(.1,.9);blue.body.position.y=-.38*q;blue.body.rotation.z=-.35*q;blue.legs[1].hip.rotation.x=-1.25*q;blue.legs[0].knee.rotation.x=.45*q;red.body.position.y=-.3*q;red.body.rotation.z=.85*q;red.arms.forEach(a=>a.shoulder.rotation.x=-1.2*q);}
 else if(action==='block'){blue.arms.forEach(a=>{a.shoulder.rotation.x=-1.25;a.elbow.rotation.x=-1.1;});red.arms.forEach(a=>{a.shoulder.rotation.x=-.95;a.elbow.rotation.x=-.9;});}
 else if(action==='dodge'){let q=p(.12,.78);blue.body.position.x=-.2*q;blue.body.rotation.z=.35*q;red.arms[1].shoulder.rotation.x=-1.2*q;}
 else {blue.body.position.y=Math.sin(elapsed*5)*.025;red.body.position.y=-blue.body.position.y;}
}
function update(){ $('#timeNow').textContent='00:'+String(Math.floor(elapsed)).padStart(2,'0')+' / 00:08';$('#timelineRange').value=elapsed;$('#playPause').textContent=playing?'Ⅱ PAUSE':'▶ PLAY';}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{action=b.dataset.action;elapsed=0;playing=true;document.querySelectorAll('.action-card').forEach(x=>x.classList.toggle('active',x===b));update();}));
$('#playPause').onclick=()=>{playing=!playing;update();};
$('#stop').onclick=()=>{playing=false;elapsed=0;update();pose();};
$('#timelineRange').oninput=e=>{elapsed=+e.target.value;playing=false;update();pose();};
$('#speedRange').oninput=e=>{speed=+e.target.value;$('#speedValue').textContent=speed.toFixed(1)+'×';};
$('#loopToggle').onchange=e=>loop=e.target.checked;
$('#labelsToggle').onchange=e=>document.querySelectorAll('.fighter-label').forEach(x=>x.hidden=!e.target.checked);
$('#blueColor').oninput=e=>blue.root.traverse(o=>{if(o.isMesh&&o.material===blue.color)o.material.color.set(e.target.value);});
$('#redColor').oninput=e=>red.root.traverse(o=>{if(o.isMesh&&o.material===red.color)o.material.color.set(e.target.value);});
$('#resetCamera').onclick=()=>{camera.position.set(0,5.2,11.8);controls.target.set(0,1.2,0);controls.update();};
$('#fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():wrap.requestFullscreen();
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
new ResizeObserver(resize).observe(viewport);resize();
function notify(s){toast.textContent=s;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
$('#record').onclick=()=>{if(!window.MediaRecorder){notify('WebM recording is not supported in this browser.');return;}if(recorder?.state==='recording'){recorder.stop();return;}chunks=[];const exportRenderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});exportRenderer.setPixelRatio(1);exportRenderer.setSize(1080,1920,false);exportRenderer.shadowMap.enabled=true;exportRenderer.outputColorSpace=THREE.SRGBColorSpace;exportRenderer.toneMapping=THREE.ACESFilmicToneMapping;const exportCamera=camera.clone();exportCamera.aspect=9/16;exportCamera.position.copy(camera.position);exportCamera.quaternion.copy(camera.quaternion);exportCamera.updateProjectionMatrix();const stream=exportRenderer.domElement.captureStream(30);const types=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];const mime=types.find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);let exportFrame;const drawExport=()=>{if(recorder?.state!=='recording')return;exportRenderer.render(scene,exportCamera);exportFrame=requestAnimationFrame(drawExport);};recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=()=>{cancelAnimationFrame(exportFrame);const url=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType||'video/webm'}));const a=document.createElement('a');a.href=url;a.download='pt-fight-'+action+'-story-1080x1920.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#record').textContent='● RECORD STORY 9:16';stream.getTracks().forEach(t=>t.stop());exportRenderer.dispose();notify('Saved vertical 1080 × 1920 WebM (9:16).');};recorder.start();drawExport();playing=true;$('#record').textContent='● STOP RECORDING';update();};
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(playing){elapsed+=dt*speed;if(elapsed>duration){if(loop)elapsed%=duration;else{elapsed=duration;playing=false;}}update();}pose();controls.update();renderer.render(scene,camera);}
animate();