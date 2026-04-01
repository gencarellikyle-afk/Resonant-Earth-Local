"use client";
import{useEffect,useRef}from"react";
export interface FractalHeartProps{coherence?:number;className?:string;}
export default function FractalHeart({coherence=0.4,className=""}:FractalHeartProps){
const canvasRef=useRef<HTMLCanvasElement>(null);
const cohRef=useRef(coherence);
useEffect(()=>{cohRef.current=coherence;},[coherence]);
useEffect(()=>{
const canvas=canvasRef.current;if(!canvas)return;
const ctx=canvas.getContext("2d");if(!ctx)return;
const dpr=Math.min(window.devicePixelRatio||1,2);
const S=400;
canvas.width=S*dpr;canvas.height=S*dpr;
canvas.style.width=S+"px";canvas.style.height=S+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
const cx=S/2;const cy=S/2+12;
let frameId:number;let t=0;
function hx(u:number,s:number){return s*16*Math.pow(Math.sin(u),3);}
function hy(u:number,s:number){return-s*(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u));}
function draw(){
frameId=requestAnimationFrame(draw);t+=0.010;
const coh=cohRef.current;
ctx.clearRect(0,0,S,S);
const breathe=1+Math.sin(t*0.65)*0.032*(0.4+coh*0.6);
const outerGlowR=110+coh*40;
const og=ctx.createRadialGradient(cx,cy+8,0,cx,cy+8,outerGlowR);
og.addColorStop(0,"rgba(255,180,40,"+(0.22+coh*0.18)+")");
og.addColorStop(0.3,"rgba(220,100,15,"+(0.12+coh*0.10)+")");
og.addColorStop(0.65,"rgba(160,50,5,"+(0.05+coh*0.05)+")");
og.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=og;ctx.beginPath();ctx.arc(cx,cy+8,outerGlowR,0,Math.PI*2);ctx.fill();
const LAYERS=7;
for(let l=0;l<LAYERS;l++){
const lf=l/(LAYERS-1);
const scale=(10+l*6)*breathe;
const breatheOffset=Math.sin(t*0.82+l*0.22)*1.8*(0.5+coh*0.5);
const scaleB=scale+breatheOffset;
const lineAlpha=Math.min(1,0.08+lf*0.20+coh*0.16+Math.abs(Math.sin(t*0.5+l*0.4))*0.08);
const dotAlpha=Math.min(1,0.22+lf*0.22+coh*0.18+Math.abs(Math.sin(t*0.7+l*0.3))*0.12);
const cr=Math.round(248+lf*4);
const cg=Math.round(232-lf*60);
const cb=Math.round(210-lf*120);
ctx.beginPath();
for(let i=0;i<=120;i++){
const u=(i/120)*Math.PI*2;
const x=cx+hx(u,scaleB);const y=cy+hy(u,scaleB);
if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
ctx.closePath();
ctx.strokeStyle="rgba("+cr+","+cg+","+cb+","+lineAlpha+")";
ctx.lineWidth=l===LAYERS-1?1.6:0.9;
ctx.stroke();
const dotStep=l===LAYERS-1?2:3;
for(let i=0;i<120;i+=dotStep){
const u=(i/120)*Math.PI*2;
const x=cx+hx(u,scaleB);const y=cy+hy(u,scaleB);
const pulse=Math.abs(Math.sin(t*1.2+i*0.15+l*0.5))*0.3;
const da=Math.min(1,dotAlpha+pulse);
const dr=l===LAYERS-1?2.4:1.5;
const grad=ctx.createRadialGradient(x,y,0,x,y,dr*2.5);
grad.addColorStop(0,"rgba("+cr+","+cg+","+cb+","+da+")");
grad.addColorStop(1,"rgba("+cr+","+cg+","+cb+",0)");
ctx.fillStyle=grad;
ctx.beginPath();ctx.arc(x,y,dr*2.5,0,Math.PI*2);ctx.fill();}}
const midGlowR=55+coh*25;
const mg=ctx.createRadialGradient(cx,cy+6,0,cx,cy+6,midGlowR);
mg.addColorStop(0,"rgba(255,222,100,"+(0.55+coh*0.25)+")");
mg.addColorStop(0.2,"rgba(255,180,50,"+(0.32+coh*0.18)+")");
mg.addColorStop(0.5,"rgba(220,100,20,"+(0.14+coh*0.10)+")");
mg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(cx,cy+6,midGlowR,0,Math.PI*2);ctx.fill();
const coreR=14+coh*8+Math.sin(t*1.1)*2;
const core=ctx.createRadialGradient(cx,cy+6,0,cx,cy+6,coreR);
core.addColorStop(0,"rgba(255,255,235,1.0)");
core.addColorStop(0.15,"rgba(255,248,200,0.95)");
core.addColorStop(0.4,"rgba(255,210,80,0.70)");
core.addColorStop(0.7,"rgba(240,140,30,0.30)");
core.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy+6,coreR,0,Math.PI*2);ctx.fill();
const sparkCount=6;
for(let i=0;i<sparkCount;i++){
const angle=t*0.8+i*(Math.PI*2/sparkCount);
const dist=18+Math.sin(t*1.4+i)*8+coh*10;
const sx=cx+Math.cos(angle)*dist;
const sy=(cy+6)+Math.sin(angle)*dist*0.7;
const sa=Math.max(0,Math.abs(Math.sin(t*1.6+i*1.1))-0.2)*(0.5+coh*0.4);
const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,5);
sg.addColorStop(0,"rgba(255,240,160,"+sa+")");
sg.addColorStop(1,"rgba(255,160,40,0)");
ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.fill();}
}
draw();return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}
