"use client";
import{useEffect,useRef}from"react";
export interface FractalHeartProps{coherence?:number;className?:string;onHover?:boolean;}
export default function FractalHeart({coherence=0.4,className="",onHover=false}:FractalHeartProps){
const canvasRef=useRef<HTMLCanvasElement>(null);
const cohRef=useRef(coherence);
const hoverRef=useRef(onHover);
const hoverEnergyRef=useRef(0);
useEffect(()=>{cohRef.current=coherence;},[coherence]);
useEffect(()=>{hoverRef.current=onHover;},[onHover]);
useEffect(()=>{
const canvas=canvasRef.current;if(!canvas)return;
const ctx=canvas.getContext("2d");if(!ctx)return;
const dpr=Math.min(window.devicePixelRatio||1,2);
const S=400;
canvas.width=S*dpr;canvas.height=S*dpr;
canvas.style.width=S+"px";canvas.style.height=S+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
const cx=S/2;const cy=S/2+20;
let frameId:number;let t=0;
function hx(u:number,s:number){return s*16*Math.pow(Math.sin(u),3);}
function hy(u:number,s:number){return-s*(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u));}
function drawHeart(scale:number,alpha:number,r:number,g:number,b:number,lw:number){
ctx.beginPath();
for(let i=0;i<=120;i++){
const u=(i/120)*Math.PI*2;
const x=cx+hx(u,scale);
const y=cy+hy(u,scale);
if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
ctx.closePath();
ctx.strokeStyle="rgba("+r+","+g+","+b+","+alpha+")";
ctx.lineWidth=lw;
ctx.stroke();}
function draw(){
frameId=requestAnimationFrame(draw);t+=0.008;
const coh=cohRef.current;
const hovering=hoverRef.current;
hoverEnergyRef.current+=(( hovering?1:0)-hoverEnergyRef.current)*0.045;
const he=hoverEnergyRef.current;
const totalEnergy=coh+he*1.2;
ctx.clearRect(0,0,S,S);
const bgR=95+totalEnergy*55;
const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,bgR);
bg.addColorStop(0,"rgba(255,195,55,"+(0.28+totalEnergy*0.32)+")");
bg.addColorStop(0.28,"rgba(210,88,10,"+(0.09+totalEnergy*0.12)+")");
bg.addColorStop(0.65,"rgba(120,32,4,"+(0.04+totalEnergy*0.06)+")");
bg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=bg;ctx.beginPath();ctx.arc(cx,cy,bgR,0,Math.PI*2);ctx.fill();
const EMANATIONS=7;
for(let e=0;e<EMANATIONS;e++){
const phase=t*(0.4+he*0.3)+e*(Math.PI*2/EMANATIONS);
const prog=(Math.sin(phase)+1)/2;
const emanScale=3.5+prog*(7+totalEnergy*7);
const emanAlpha=(1-prog)*(0.14+totalEnergy*0.16);
if(emanAlpha>0.004)drawHeart(emanScale,emanAlpha,255,212,105,0.7);}
const LAYERS=6;
const maxScale=10+totalEnergy*4;
for(let l=0;l<LAYERS;l++){
const lf=l/(LAYERS-1);
const scale=(2.5+l*(maxScale/LAYERS))*(1+Math.sin(t*0.55+l*0.28)*0.016);
const breathPhase=Math.sin(t*0.65+l*0.22);
const alpha=Math.min(1,0.08+lf*0.20+totalEnergy*0.18+breathPhase*0.05);
const cr=Math.round(254-lf*10);
const cg=Math.round(244-lf*75);
const cb=Math.round(218-lf*155);
drawHeart(scale,alpha,cr,cg,cb,l===LAYERS-1?1.7:0.8);
if(l>1&&l<LAYERS-1){
const step=l===LAYERS-1?1:3;
for(let i=0;i<120;i+=step){
const u=(i/120)*Math.PI*2;
const x=cx+hx(u,scale);
const y=cy+hy(u,scale);
const pulse=Math.abs(Math.sin(t*1.3+i*0.13+l*0.5));
const da=Math.min(1,(0.20+lf*0.28+totalEnergy*0.20)*pulse);
const dr=l===LAYERS-1?5.5:1.5;
const grd=ctx.createRadialGradient(x,y,0,x,y,dr*3);
grd.addColorStop(0,"rgba("+cr+","+cg+","+cb+","+da+")");
grd.addColorStop(0.5,"rgba("+cr+","+cg+","+cb+","+(da*0.3)+")");
grd.addColorStop(1,"rgba("+cr+","+cg+","+cb+",0)");
ctx.fillStyle=grd;
ctx.beginPath();ctx.arc(x,y,dr*3,0,Math.PI*2);ctx.fill();}}}
const ghostOff={x:5,y:-4};const ghostLayers=[5,6,7];for(const gl of ghostLayers){const lf=gl/(LAYERS-1);const scale=(2.5+gl*(maxScale/LAYERS))*(1+Math.sin(t*0.55+gl*0.28)*0.016);const galpha=Math.min(0.13,0.06+lf*0.07);drawHeart(scale,galpha,254,244,218,0.6);ctx.save();ctx.translate(ghostOff.x,ghostOff.y);drawHeart(scale,galpha*0.85,254,230,180,0.5);ctx.restore();}const midR=38+totalEnergy*32;
const mg=ctx.createRadialGradient(cx,cy,0,cx,cy,midR);
mg.addColorStop(0,"rgba(255,238,125,"+(0.68+totalEnergy*0.22)+")");
mg.addColorStop(0.18,"rgba(255,188,58,"+(0.40+totalEnergy*0.18)+")");
mg.addColorStop(0.48,"rgba(220,98,20,"+(0.15+totalEnergy*0.12)+")");
mg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(cx,cy,midR,0,Math.PI*2);ctx.fill();
const coreR=11+totalEnergy*11+Math.sin(t*1.5)*2.2;
const core=ctx.createRadialGradient(cx,cy,0,cx,cy,coreR);
core.addColorStop(0,"rgba(255,255,248,1.0)");
core.addColorStop(0.12,"rgba(255,252,215,0.96)");
core.addColorStop(0.38,"rgba(255,212,78,0.70)");
core.addColorStop(0.68,"rgba(238,132,30,0.28)");
core.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,coreR,0,Math.PI*2);ctx.fill();
const sparkCount=Math.round(6+he*5);
for(let i=0;i<sparkCount;i++){
const angle=t*(0.65+he*0.7)+i*(Math.PI*2/sparkCount);
const dist=15+Math.sin(t*1.9+i*1.2)*9+totalEnergy*16;
const sx=cx+Math.cos(angle)*dist;
const sy=cy+Math.sin(angle)*dist*0.72;
const sa=Math.max(0,(Math.abs(Math.sin(t*2.1+i*1.3))-0.08)*(0.68+totalEnergy*0.32));
const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,5.5);
sg.addColorStop(0,"rgba(255,248,172,"+sa+")");
sg.addColorStop(0.45,"rgba(255,182,48,"+(sa*0.52)+")");
sg.addColorStop(1,"rgba(255,100,15,0)");
ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,5.5,0,Math.PI*2);ctx.fill();}
}
draw();return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}







