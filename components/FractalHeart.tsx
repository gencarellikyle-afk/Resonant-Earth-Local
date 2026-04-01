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
const cx=S/2;const cy=S/2+10;
let frameId:number;let t=0;
function heartPoint(u:number,scale:number){return{x:scale*16*Math.pow(Math.sin(u),3),y:-scale*(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u))}}
function draw(){
frameId=requestAnimationFrame(draw);t+=0.014;
const coh=cohRef.current;
ctx.clearRect(0,0,S,S);
const breathe=1+Math.sin(t*0.76)*0.028*(0.5+coh*0.5);
for(let layer=0;layer<7;layer++){
const layerFrac=layer/6;
const scale=(14+layer*5)*breathe;
const opacity=0.18+layerFrac*0.18+coh*0.14;
const dotOpacity=0.38+layerFrac*0.18+coh*0.14;
ctx.strokeStyle="rgba(252,244,226,"+Math.min(1,opacity)+")";
ctx.lineWidth=layer===6?1.8:1.1;
ctx.beginPath();
for(let i=0;i<=90;i++){const u=(i/90)*Math.PI*2;const p=heartPoint(u,scale);const x=cx+p.x;const y=cy+p.y;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
ctx.closePath();ctx.stroke();
for(let i=0;i<90;i+=3){const u=(i/90)*Math.PI*2;const p=heartPoint(u,scale);const x=cx+p.x;const y=cy+p.y;const pulse=0.18+Math.abs(Math.sin(t*1.08+i*0.21+layer))*0.16;ctx.beginPath();ctx.arc(x,y,layer===6?2.1:1.4,0,Math.PI*2);ctx.fillStyle="rgba(252,244,226,"+Math.min(1,dotOpacity*pulse)+")";ctx.fill();}}
const glowR=80+coh*30;
const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,glowR);
glow.addColorStop(0,"rgba(255,244,200,0.78)");glow.addColorStop(0.25,"rgba(255,206,96,0.28)");glow.addColorStop(0.65,"rgba(220,118,22,0.10)");glow.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,glowR,0,Math.PI*2);ctx.fill();
const coreR=12+coh*6;
const core=ctx.createRadialGradient(cx,cy,0,cx,cy,coreR);
core.addColorStop(0,"rgba(255,252,220,0.96)");core.addColorStop(0.35,"rgba(255,214,96,0.55)");core.addColorStop(1,"rgba(255,140,24,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,coreR,0,Math.PI*2);ctx.fill();}
draw();return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}
