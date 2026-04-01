"use client";
import{useEffect,useRef}from"react";
export interface FractalHeartProps{coherence?:number;className?:string;onHover?:boolean;}
export default function FractalHeart({coherence=0.4,className="",onHover=false}:FractalHeartProps){
const canvasRef=useRef<HTMLCanvasElement>(null);
const cohRef=useRef(coherence);
const hoverRef=useRef(onHover);
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
function drawHeart(scale:number,alpha:number,r:number,g:number,b:number,lw:number,pts:number=120){
ctx.beginPath();
for(let i=0;i<=pts;i++){
const u=(i/pts)*Math.PI*2;
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
const hBoost=hovering?0.4:0;
const totalEnergy=coh+hBoost;
ctx.clearRect(0,0,S,S);
const bgR=hovering?140+coh*40:100+coh*30;
const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,bgR);
bg.addColorStop(0,"rgba(255,200,60,"+(0.20+totalEnergy*0.18)+")");
bg.addColorStop(0.3,"rgba(210,90,10,"+(0.10+totalEnergy*0.10)+")");
bg.addColorStop(0.7,"rgba(120,35,4,"+(0.04+totalEnergy*0.05)+")");
bg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=bg;ctx.beginPath();ctx.arc(cx,cy,bgR,0,Math.PI*2);ctx.fill();
const EMANATIONS=6;
for(let e=0;e<EMANATIONS;e++){
const phase=t*0.5+e*(Math.PI*2/EMANATIONS);
const prog=(Math.sin(phase)+1)/2;
const emanScale=4+prog*(8+totalEnergy*6);
const emanAlpha=(1-prog)*(0.18+totalEnergy*0.14);
if(emanAlpha>0.005){drawHeart(emanScale,emanAlpha,255,210,100,0.8);}}
const LAYERS=7;
const maxScale=11+totalEnergy*3;
for(let l=0;l<LAYERS;l++){
const lf=l/(LAYERS-1);
const scale=(3+l*(maxScale/LAYERS))*(1+Math.sin(t*0.6+l*0.3)*0.018);
const breathPhase=Math.sin(t*0.7+l*0.25);
const alpha=Math.min(1,0.10+lf*0.22+totalEnergy*0.16+breathPhase*0.06);
const cr=Math.round(255-lf*12);
const cg=Math.round(245-lf*80);
const cb=Math.round(220-lf*160);
drawHeart(scale,alpha,cr,cg,cb,l===LAYERS-1?1.6:0.8);
if(l>2){
const step=l===LAYERS-1?2:4;
for(let i=0;i<120;i+=step){
const u=(i/120)*Math.PI*2;
const x=cx+hx(u,scale);
const y=cy+hy(u,scale);
const pulse=Math.abs(Math.sin(t*1.2+i*0.14+l*0.5));
const da=Math.min(1,(0.25+lf*0.25+totalEnergy*0.18)*pulse);
const dr=l===LAYERS-1?2.2:1.4;
const grd=ctx.createRadialGradient(x,y,0,x,y,dr*2.8);
grd.addColorStop(0,"rgba("+cr+","+cg+","+cb+","+da+")");
grd.addColorStop(1,"rgba("+cr+","+cg+","+cb+",0)");
ctx.fillStyle=grd;
ctx.beginPath();ctx.arc(x,y,dr*2.8,0,Math.PI*2);ctx.fill();}}}
const midR=40+totalEnergy*28+(hovering?12:0);
const mg=ctx.createRadialGradient(cx,cy,0,cx,cy,midR);
mg.addColorStop(0,"rgba(255,235,120,"+(0.65+totalEnergy*0.25)+")");
mg.addColorStop(0.2,"rgba(255,185,55,"+(0.38+totalEnergy*0.18)+")");
mg.addColorStop(0.5,"rgba(220,95,18,"+(0.14+totalEnergy*0.10)+")");
mg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(cx,cy,midR,0,Math.PI*2);ctx.fill();
const coreR=10+totalEnergy*10+Math.sin(t*1.4)*2.5;
const core=ctx.createRadialGradient(cx,cy,0,cx,cy,coreR);
core.addColorStop(0,"rgba(255,255,250,1.0)");
core.addColorStop(0.15,"rgba(255,250,210,0.95)");
core.addColorStop(0.4,"rgba(255,210,75,0.68)");
core.addColorStop(0.7,"rgba(238,130,28,0.28)");
core.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,coreR,0,Math.PI*2);ctx.fill();
const sparkCount=hovering?10:6;
for(let i=0;i<sparkCount;i++){
const angle=t*(hovering?1.2:0.7)+i*(Math.PI*2/sparkCount);
const dist=16+Math.sin(t*1.8+i*1.1)*9+totalEnergy*14;
const sx=cx+Math.cos(angle)*dist;
const sy=cy+Math.sin(angle)*dist*0.72;
const sa=Math.max(0,(Math.abs(Math.sin(t*2.0+i*1.3))-0.1)*(0.65+totalEnergy*0.35));
const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,5.5);
sg.addColorStop(0,"rgba(255,248,170,"+sa+")");
sg.addColorStop(0.45,"rgba(255,180,45,"+(sa*0.55)+")");
sg.addColorStop(1,"rgba(255,100,15,0)");
ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,5.5,0,Math.PI*2);ctx.fill();}
}
draw();return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}
