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
canvas.style.width="100%";canvas.style.height="100%";
ctx.scale(dpr,dpr);
const cx=S/2,cy=S/2+18;
const LAYERS=7;
const PTS_PER_LAYER=120;
let frameId:number;
let t=0;
function heartX(u:number,scale:number){return scale*16*Math.pow(Math.sin(u),3);}
function heartY(u:number,scale:number){return-scale*(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u));}
function draw(){
frameId=requestAnimationFrame(draw);
t+=0.012;
const coh=cohRef.current;
ctx.clearRect(0,0,S,S);
const breathe=1+Math.sin(t*0.7)*0.022*(0.5+coh*0.5);
for(let l=0;l<LAYERS;l++){
const layerFrac=l/(LAYERS-1);
const scale=(48+l*11)*breathe;
const pulse=Math.abs(Math.sin(t*0.9+l*0.38))*0.18;
const baseOpacity=0.12+layerFrac*0.22+coh*0.18+pulse;
const r=Math.round(255);
const g=Math.round(245-layerFrac*80);
const b=Math.round(200-layerFrac*140);
ctx.beginPath();
for(let i=0;i<=PTS_PER_LAYER;i++){
const u=(i/PTS_PER_LAYER)*Math.PI*2;
const px=cx+heartX(u,scale);
const py=cy+heartY(u,scale);
if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
ctx.closePath();
ctx.strokeStyle=`rgba(${r},${g},${b},${Math.min(1,baseOpacity)})`;
ctx.lineWidth=l===LAYERS-1?1.8:1.1;
ctx.stroke();
for(let i=0;i<PTS_PER_LAYER;i+=3){
const u=(i/PTS_PER_LAYER)*Math.PI*2;
const px=cx+heartX(u,scale);
const py=cy+heartY(u,scale);
const dotAlpha=Math.min(1,baseOpacity*1.6+Math.abs(Math.sin(t*1.1+i*0.18+l))*0.22);
const dotR=l===LAYERS-1?2.2:1.4;
ctx.beginPath();ctx.arc(px,py,dotR,0,Math.PI*2);
ctx.fillStyle=`rgba(${r},${g},${b},${dotAlpha})`;
ctx.fill();}}
const glowR=60+coh*40;
const glow=ctx.createRadialGradient(cx,cy+10,0,cx,cy+10,glowR);
glow.addColorStop(0,`rgba(255,240,160,${0.55+coh*0.30})`);
glow.addColorStop(0.25,`rgba(248,200,80,${0.28+coh*0.18})`);
glow.addColorStop(0.55,`rgba(220,120,20,${0.10+coh*0.08})`);
glow.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy+10,glowR,0,Math.PI*2);ctx.fill();
const coreR=8+coh*6;
const core=ctx.createRadialGradient(cx,cy+10,0,cx,cy+10,coreR);
core.addColorStop(0,`rgba(255,252,220,${0.90+coh*0.10})`);
core.addColorStop(0.4,`rgba(255,220,100,${0.60+coh*0.20})`);
core.addColorStop(1,"rgba(255,160,30,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy+10,coreR,0,Math.PI*2);ctx.fill();}
draw();
return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}


