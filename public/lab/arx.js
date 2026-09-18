import * as THREE from 'three';
import {MeshoptDecoder} from './vendor/meshopt_decoder.mjs';

const base='./assets/arx/';
export const armOptions=[
 {id:'r5a',title:'ARX R5 · 单臂',placement:'desk'},
 {id:'r5a_dual',title:'ARX R5 · 双臂',placement:'desk'},
 {id:'franka',title:'Franka FR3 + Wave',placement:'desk'},
 ...[['a5','A5'],['x5a','X5 / X5A'],['x5_2025','X5 2025'],['ac_one','AC one'],['ac_one_without_handle','AC one 无手柄版'],['x7','X7'],['x7s','X7s'],['lift','LIFT'],['lift_mini','LIFT-mini']].map(([id,title])=>({id,title:'ARX '+title,placement:['x7','x7s','lift','lift_mini'].includes(id)?'floor':'desk'}))
];
async function geometry(file){
 const response=await fetch(base+file+'?v=4');if(!response.ok)throw new Error('网格加载失败');
 // Some hosts send .gz files with Content-Encoding, so fetch already decompresses them.
 const downloaded=await response.arrayBuffer(),signature=new Uint8Array(downloaded,0,Math.min(2,downloaded.byteLength));
 const buf=signature[0]===0x1f&&signature[1]===0x8b
  ?await new Response(new Blob([downloaded]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
  :downloaded;
 const header=new Uint32Array(buf,0,5),v=header[1],n=header[2];
 if(header[0]!==0x33585241||buf.byteLength!==44+header[3]+header[4])throw new Error('网格数据不完整');
 await MeshoptDecoder.ready;const vertex=new Uint8Array(v*12),indices=new Uint8Array(n*4);
 MeshoptDecoder.decodeVertexBuffer(vertex,v,12,new Uint8Array(buf,44,header[3]));MeshoptDecoder.decodeIndexBuffer(indices,n,4,new Uint8Array(buf,44+header[3],header[4]));
 const bounds=new Float32Array(buf,20,6),q=new Uint16Array(vertex.buffer),signed=new Int8Array(vertex.buffer),positions=new Float32Array(v*3),normals=new Int8Array(v*3);
 for(let i=0;i<v;i++)for(let k=0;k<3;k++){positions[i*3+k]=bounds[k]+q[i*6+k]/65535*bounds[3+k];normals[i*3+k]=signed[i*12+6+k];}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('normal',new THREE.BufferAttribute(normals,3,true));
 g.setIndex(new THREE.BufferAttribute(new Uint32Array(indices.buffer),1));g.computeBoundingBox();return g;
}
// Two independent R5 instances share geometry; no mirroring or factory dual-arm claim.
function pairedR5(source){
 const d={...source,links:[{name:'pair_mount',visuals:[]}],joints:[],mountRoots:[]};
 const children=new Set(source.joints.map(j=>j.child)),root=source.links.find(l=>!children.has(l.name)).name;
 for(const [side,offset,yaw,label] of [['left',-.58,0,'左臂'],['right',.58,Math.PI,'右臂']]){
  const prefix=side+'_';d.mountRoots.push(prefix+root);
  for(const l of source.links)d.links.push({...l,name:prefix+l.name});
  d.joints.push({name:prefix+'mount',type:'fixed',parent:'pair_mount',child:prefix+root,xyz:[offset,0,0],rpy:[0,0,yaw],axis:[0,0,1],lower:0,upper:0});
  for(const j of source.joints)d.joints.push({...j,name:prefix+j.name,label:label+' · '+j.name,parent:prefix+j.parent,child:prefix+j.child,mimic:j.mimic?{...j.mimic,joint:prefix+j.mimic.joint}:null});
 }
 return d;
}
const setOrigin=(g,o)=>{g.position.fromArray(o.xyz);g.rotation.set(...o.rpy,'ZYX');};
export function createArmSelector({world,deskTop,assets,asset}){
 const slot=new THREE.Group();world.add(slot);slot.visible=false;
 let current=null,modelId='franka',busy=false;
 const propPositions=assets.objects.g.children.map(o=>o.position.clone());
 function arrangeProps(dual){assets.objects.g.children.forEach((o,i)=>{o.position.copy(propPositions[i]);if(dual)o.position.z=(o.position.z-.305)*.62;});}
 const a=asset('arx','方舟机械臂','保留官方几何和关节层级。选择一个关节，再拖动滑块。','调至上限','调至下限',slot,v=>{if(current)current.setNormalized(v);});
 function dispose(m){if(!m)return;m.g.removeFromParent();for(const g of m.geometries)g.dispose();for(const mat of m.materials)mat.dispose();}
 async function load(id){
  const option=armOptions.find(o=>o.id===id);if(!option)throw new Error('未知型号');if(busy)throw new Error('请等待当前模型加载完成');
  if(id===modelId)return;busy=true;
  try{
   if(id==='franka'){dispose(current);current=null;slot.visible=false;assets.franka.g.visible=true;arrangeProps(false);modelId=id;return;}
   const res=await fetch(base+(id==='r5a_dual'?'r5a':id)+'.json');if(!res.ok)throw new Error('型号文件加载失败');const source=await res.json(),d=id==='r5a_dual'?pairedR5(source):source;
   const files=[...new Set(d.links.flatMap(l=>l.visuals.map(v=>v.mesh.file)))];const meshes={};
   // Settle all requests before cleanup so failed switches cannot leak GPU resources.
   const results=await Promise.allSettled(files.map(async f=>{meshes[f]=await geometry(f);}));
   if(results.some(r=>r.status==='rejected')){Object.values(meshes).forEach(g=>g.dispose());throw new Error('模型下载未完成，请重新选择');}
   const g=new THREE.Group(),ros=new THREE.Group();ros.rotation.x=-Math.PI/2;g.add(ros);const links={},materials=[];
   for(const l of d.links){const n=new THREE.Group();n.name=l.name;links[l.name]=n;for(const v of l.visuals){const c=new THREE.Color().setRGB(...v.color.slice(0,3));const mat=new THREE.MeshStandardMaterial({color:c,metalness:.2,roughness:.43});materials.push(mat);const m=new THREE.Mesh(meshes[v.mesh.file],mat);setOrigin(m,v);m.scale.fromArray(v.scale);m.castShadow=m.receiveShadow=true;n.add(m);}}
   const children=new Set(),joints=[];
   for(const j of d.joints){const fixed=new THREE.Group();setOrigin(fixed,j);links[j.parent].add(fixed);const pivot=new THREE.Group();fixed.add(pivot);pivot.add(links[j.child]);children.add(j.child);joints.push({...j,pivot,axisV:new THREE.Vector3(...j.axis).normalize(),value:THREE.MathUtils.clamp(0,j.lower,j.upper)});}
   for(const l of d.links)if(!children.has(l.name))ros.add(links[l.name]);
   if(id==='r5a'||id==='r5a_dual')for(const j of joints){if(/(^|_)joint2$/.test(j.name))j.value=.75;if(/(^|_)joint3$/.test(j.name))j.value=1.1;}
   for(const j of joints)j.home=j.value;
   const adjustable=joints.filter(j=>j.type!=='fixed'&&!j.mimic&&j.upper>j.lower);
   // Prefer the arm / lift over a drive wheel when the model opens.
   const first=adjustable.findIndex(j=>j.type==='prismatic'&&!/catch|joint[78]$|joint1[78]$/.test(j.name));
   const m={g,geometries:Object.values(meshes),materials,joints,adjustable,index:first>=0&&option.placement==='floor'?first:0,
    update(){for(const j of joints){let value=j.value;if(j.mimic){const source=joints.find(x=>x.name===j.mimic.joint);value=(source?.value||0)*j.mimic.multiplier+j.mimic.offset;}if(j.type==='prismatic')j.pivot.position.copy(j.axisV).multiplyScalar(value);else if(j.type==='revolute'||j.type==='continuous')j.pivot.quaternion.setFromAxisAngle(j.axisV,value);}},
    setNormalized(v){const j=adjustable[this.index];if(j){j.value=THREE.MathUtils.lerp(j.lower,j.upper,v);this.update();}},
    normalized(){const j=adjustable[this.index];return j?(j.value-j.lower)/(j.upper-j.lower):0;},
    reset(){joints.forEach(j=>j.value=j.home);this.update();}
   };m.update();g.rotation.y=-Math.PI/2;g.updateMatrixWorld(true);
   const bounds=new THREE.Box3().setFromObject(g);
   // Preserve scale. Ground full mobile robots; mount arms by their root-link footprint.
   const roots=d.links.filter(l=>d.mountRoots?d.mountRoots.includes(l.name):!children.has(l.name));const rootBounds=new THREE.Box3();for(const l of roots)if(l.visuals.length)rootBounds.union(new THREE.Box3().setFromObject(links[l.name]));
   const mountBounds=rootBounds.isEmpty()?bounds:rootBounds;const center=mountBounds.getCenter(new THREE.Vector3());
   g.position.set(-center.x,-(option.placement==='floor'?bounds.min.y:mountBounds.min.y),-center.z);
   // Swap only once the new model is complete; the old model survives a failed load.
   dispose(current);current=m;slot.clear();slot.add(g);(option.placement==='floor'?world:deskTop).add(slot);
   slot.position.set(option.placement==='floor'?0:0,option.placement==='floor'?.02:1.026,option.placement==='floor'?.4:id==='r5a_dual'?0:-.52);
   slot.visible=true;assets.franka.g.visible=false;arrangeProps(id==='r5a_dual');modelId=id;a.title=option.title;
   a.desc=`${option.placement==='floor'?'落地整机':'桌面模型'} · 官方模型的网页轻量版。选择关节调整；不含碰撞或动力学仿真。`;
   if(id==='r5a_dual')a.desc='两台官方 R5 模型组合，左右臂独立调节，中央留出操作区。双臂间距与姿态为网页演示设置。';
   a.t=a.v=m.normalized();
  }finally{busy=false;}
 }
 return {load,options:armOptions,get id(){return modelId;},get busy(){return busy;},get joints(){return current?.adjustable||[];},get joint(){return current?.adjustable[current.index];},
  selectJoint(name){if(!current)throw new Error('请先选择方舟型号');const i=current.adjustable.findIndex(j=>j.name===name);if(i<0)throw new Error('未知关节');current.index=i;a.t=a.v=current.normalized();},
  reset(){if(current){current.reset();a.t=a.v=current.normalized();}},
  format(){const j=this.joint;return !j?'':j.type==='prismatic'?(j.value*1000).toFixed(1)+' mm':THREE.MathUtils.radToDeg(j.value).toFixed(1)+'°';},
  focus(){return new THREE.Box3().setFromObject(slot);},
  state(){return {model:modelId,loading:busy,placement:armOptions.find(o=>o.id===modelId).placement,joint:this.joint?.name,joints:this.joints.map(j=>({name:j.name,type:j.type,value:j.value,lower:j.lower,upper:j.upper}))};}
 };
}
