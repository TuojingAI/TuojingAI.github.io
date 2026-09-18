import * as THREE from 'three';
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
const root='./assets/robots/';
async function json(file){const r=await fetch(root+file);if(!r.ok)throw new Error('Robot asset unavailable: '+file);return r.json();}
const origin=(g,o)=>{g.position.fromArray(o.xyz);g.rotation.set(...o.rpy,'ZYX');};
export async function addRobots({world,deskTop,asset,group,box,cylinder,bar,rounded,mat}){
 const [parts,response,handData]=await Promise.all([json('franka.json'),fetch(root+'franka.bin'),json('wave.json')]);if(!response.ok)throw new Error('Franka mesh unavailable');const binary=await response.arrayBuffer();
 const stl=new STLLoader(),meshCache={};await Promise.all([...new Set(handData.links.flatMap(l=>l.visuals.map(v=>v.file)))].map(async f=>{meshCache[f]=await stl.loadAsync(root+f);}));
 function hand(parent){
  const links={},joints=[];const g=group(parent);
  for(const l of handData.links){const n=new THREE.Group();n.name=l.name;links[l.name]=n;for(const v of l.visuals){const c=new THREE.Color().setRGB(...v.color.slice(0,3));const m=new THREE.MeshStandardMaterial({color:c,metalness:.45,roughness:.4});const mesh=new THREE.Mesh(meshCache[v.file],m);origin(mesh,v);mesh.castShadow=true;mesh.receiveShadow=true;n.add(mesh);}}
  const child=new Set();for(const j of handData.joints){const base=group(links[j.parent]);origin(base,j);const pivot=group(base);pivot.add(links[j.child]);child.add(j.child);joints.push({...j,pivot});}for(const l of handData.links)if(!child.has(l.name))g.add(links[l.name]);
  return {g,close(v){for(const j of joints){if(j.type!=='revolute')continue;let angle=0;if(/FE$|PIP$|DIP$|_IP$/.test(j.name))angle=Math.min(j.upper*.62,1.05)*v;if(/pinky_CMC$/.test(j.name))angle=.16*v;j.pivot.quaternion.setFromAxisAngle(new THREE.Vector3(...j.axis).normalize(),angle);}}};
 }
 const robot=group(deskTop,0,1.026,-.57);robot.rotation.y=-Math.PI/2;
 const black=mat('#28303a',.4,.4),steel=mat('#d4dbe3',.28,.65),shell=mat('#e8edf3',.34,.2),blue=mat('#5ca5f3',.3,.2);
 box(robot,.23,.012,.23,0,.006,0,steel);for(const x of [-.087,.087])for(const z of [-.087,.087])cylinder(robot,.009,.013,x,.014,z,black);
 const ros=group(robot,0,.014,0);ros.rotation.x=-Math.PI/2;
 const links=Array.from({length:8},()=>new THREE.Group());
 for(let i=0;i<8;i++)for(const p of parts[i]){const g=new THREE.BufferGeometry(),buf=new THREE.InterleavedBuffer(new Float32Array(binary,p.offset,p.count*6),6);g.setAttribute('position',new THREE.InterleavedBufferAttribute(buf,3,0));g.setAttribute('normal',new THREE.InterleavedBufferAttribute(buf,3,3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(binary,p.indexOffset,p.indexCount),1));const col=new THREE.Color().setRGB(...p.color.slice(0,3));const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:col,roughness:.37,metalness:.15}));mesh.castShadow=true;mesh.receiveShadow=true;links[i].add(mesh);}
 ros.add(links[0]);const kin=[[[0,0,.333],[0,0,0]],[[0,0,0],[-Math.PI/2,0,0]],[[0,-.316,0],[Math.PI/2,0,0]],[[.0825,0,0],[Math.PI/2,0,0]],[[-.0825,.384,0],[-Math.PI/2,0,0]],[[0,0,0],[Math.PI/2,0,0]],[[.088,0,0],[Math.PI/2,0,0]]],pivots=[];
 for(let i=0;i<7;i++){const b=group(links[i]);origin(b,{xyz:kin[i][0],rpy:kin[i][1]});const pivot=group(b);pivot.add(links[i+1]);pivots.push(pivot);}
 const tool=group(links[7],0,0,.107);const mountedHand=hand(tool);
 const rest=[0,-.45,0,-2.05,0,1.65,.78],reach=[.25,-.22,.1,-1.7,-.1,1.5,.78];
 asset('franka','Franka FR3','Franka 官方几何，末端装配 Wave 灵巧手。点击切换机械臂姿态。','伸展机械臂','收回机械臂',robot,v=>pivots.forEach((j,i)=>j.rotation.z=THREE.MathUtils.lerp(rest[i],reach[i],v)));
 asset('wave','Sharpa Wave 手','Sharpa 官方五指手模型，按原始关节层级装配；演示手指张合。','合拢手指','张开手指',mountedHand.g,v=>mountedHand.close(v));
 const red=mat('#e32735',.35,.05),objects=group(deskTop,0,1.026,0);const items=[];
 for(const [x,z,r]of [[-.22,-.05,.044],[.02,.16,.039],[.24,.43,.047]]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,18),red);m.position.set(x,r,z);m.castShadow=true;m.receiveShadow=true;objects.add(m);items.push(m);}
 items.push(cylinder(objects,.038,.10,-.19,.05,.34,red));items.push(cylinder(objects,.035,.13,.2,.065,.09,red));items.push(rounded(objects,.088,.088,.088,.006,-.04,.044,.55,red));items.push(rounded(objects,.074,.074,.074,.005,.17,.037,.66,red));
 asset('objects','红色操作物体','3 个小球、2 个圆柱、2 个立方体，均放在桌面上。点击查看形状转动。','转动物体','恢复摆放',objects,v=>items.forEach((m,i)=>m.rotation.y=v*Math.PI*(i%2?1:-1)));
 // North body is an authored visual proxy based on official reference images; Wave hands use official meshes.
 const north=group(world,-.93,0,1.52);north.rotation.y=.22;
 rounded(north,.63,.12,.61,.13,0,.12,0,shell);rounded(north,.65,.045,.63,.13,0,.057,0,black);for(const x of [-.24,.24])for(const z of [-.22,.22]){const w=cylinder(north,.064,.047,x,.067,z,black);w.rotation.z=Math.PI/2;}
 cylinder(north,.115,.63,0,.49,.04,shell,.22);cylinder(north,.105,.11,0,.86,.02,black);cylinder(north,.15,.09,0,.9,.02,steel);
 const torso=group(north,0,.94,0);rounded(torso,.36,.20,.23,.075,0,.075,0,shell);rounded(torso,.46,.34,.27,.09,0,.32,0,shell);
 rounded(torso,.23,.075,.015,.026,0,.04,-.127,black).rotation.x=Math.PI/2;for(let x=-.085;x<.1;x+=.02)bar(torso,[x,.01,-.143],[x,.075,-.143],.002,steel);
 const textCanvas=document.createElement('canvas');textCanvas.width=512;textCanvas.height=128;const ctx=textCanvas.getContext('2d');ctx.clearRect(0,0,512,128);ctx.fillStyle='#455666';ctx.font='bold 56px Arial';ctx.textAlign='center';ctx.fillText('sharpa',256,82);const label=new THREE.CanvasTexture(textCanvas);label.colorSpace=THREE.SRGBColorSpace;const plate=new THREE.Mesh(new THREE.PlaneGeometry(.20,.05),new THREE.MeshBasicMaterial({map:label,transparent:true,depthWrite:false}));plate.position.set(0,.21,-.143);plate.rotation.y=Math.PI;torso.add(plate);
 cylinder(torso,.065,.12,0,.55,0,black);const head=group(torso,0,.68,0);const dome=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),shell);dome.scale.set(.158,.111,.117);head.add(dome);dome.castShadow=true;rounded(head,.238,.082,.018,.032,0,.003,-.105,black);for(const x of [-.065,.065]){const lens=cylinder(head,.022,.013,x,.006,-.122,steel);lens.rotation.x=Math.PI/2;const pupil=cylinder(head,.014,.015,x,.006,-.13,black);pupil.rotation.x=Math.PI/2;}box(head,.035,.007,.009,0,-.045,-.118,blue);
 const arms=[];for(const sign of [-1,1]){const shoulder=group(torso,sign*.29,.41,0);const joint=cylinder(shoulder,.086,.13,0,0,0,steel);joint.rotation.z=Math.PI/2;rounded(shoulder,.145,.16,.18,.055,sign*.025,.005,0,shell);const upper=group(shoulder);bar(upper,[0,-.06,0],[sign*.04,-.28,-.025],.056,shell);const elbow=group(upper,sign*.04,-.31,-.025);cylinder(elbow,.059,.13,0,0,0,steel).rotation.z=Math.PI/2;const lower=group(elbow);bar(lower,[0,-.02,0],[0,-.19,-.10],.052,shell);const wrist=group(lower,0,-.21,-.11);wrist.rotation.x=Math.PI*.67;const h=hand(wrist);if(sign<0)h.g.scale.x=-1;h.close(.25);arms.push({shoulder,upper,lower,h});}
 asset('north','Sharpa North','North 外观示意模型，配官方 Wave 手几何。公开资源中暂未找到 North 整机模型。','抬手示意','手臂归位',north,v=>{arms[1].upper.rotation.x=v*1.05;arms[1].upper.rotation.z=v*.24;arms[1].lower.rotation.x=v*.6;arms[1].h.close(.25*(1-v));head.rotation.y=v*.18;});
 return {official:['Franka FR3','Sharpa Wave'],proxy:['Sharpa North body']};
}
