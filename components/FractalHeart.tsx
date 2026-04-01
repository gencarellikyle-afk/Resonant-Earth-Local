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
const cx=S/2;const cy=S/2+18;
let frameId:number;let t=0;
function heartX(u:number){return 16*Math.pow(Math.sin(u),3);}
function heartY(u:number){return-(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u));}
function draw(){
frameId=requestAnimationFrame(draw);t+=0.008;
const coh=cohRef.current;
const hovering=hoverRef.current;
ctx.clearRect(0,0,S,S);
const hoverPulse=hovering?1+Math.sin(t*2.2)*0.06:0;
const breathe=1+Math.sin(t*0.55)*0.025*(0.5+coh*0.5)+hoverPulse;
const outerGlowR=hovering?130+coh*50:100+coh*35;
const og=ctx.createRadialGradient(cx,cy,0,cx,cy,outerGlowR);
og.addColorStop(0,"rgba(255,190,50,"+(0.28+coh*0.20+(hovering?0.12:0))+")");
og.addColorStop(0.25,"rgba(220,100,15,"+(0.16+coh*0.12)+")");
og.addColorStop(0.6,"rgba(150,45,5,"+(0.06+coh*0.06)+")");
og.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=og;ctx.beginPath();ctx.arc(cx,cy,outerGlowR,0,Math.PI*2);ctx.fill();
const LAYERS=8;
for(let l=0;l<LAYERS;l++){
const lf=l/(LAYERS-1);
const baseScale=9+l*7.5;
const scale=baseScale*breathe*(1+Math.sin(t*0.4+l*0.28)*0.015);
const wobble=Math.sin(t*0.9+l*0.44)*0.8;
const lineAlpha=Math.min(1,0.06+lf*0.16+coh*0.14+Math.abs(Math.sin(t*0.4+l*0.5))*0.06+(hovering?0.08:0));
const dotAlpha=Math.min(1,0.18+lf*0.20+coh*0.16+Math.abs(Math.sin(t*0.6+l*0.3))*0.10+(hovering?0.10:0));
const warmth=lf;
const cr=Math.round(252-warmth*8);
const cg=Math.round(240-warmth*72);
const cb=Math.round(218-warmth*148);
const pts:number[][]=[];
for(let i=0;i<=160;i++){
const u=(i/160)*Math.PI*2;
const s=scale+wobble;
const x=cx+heartX(u)*s;
const y=cy+heartY(u)*s;
pts.push([x,y]);}
ctx.beginPath();
pts.forEach(([x,y],i)=>{if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
ctx.closePath();
ctx.strokeStyle="rgba("+cr+","+cg+","+cb+","+lineAlpha+")";
ctx.lineWidth=l===LAYERS-1?1.8:0.85;
ctx.stroke();
const step=l<3?5:l<6?3:2;
for(let i=0;i<pts.length-1;i+=step){
const[x,y]=pts[i];
const pulse=Math.abs(Math.sin(t*1.4+i*0.12+l*0.6));
const da=Math.min(1,dotAlpha*(0.7+pulse*0.5));
const dr=l===LAYERS-1?2.8:l>4?2.0:1.3;
const grd=ctx.createRadialGradient(x,y,0,x,y,dr*3);
grd.addColorStop(0,"rgba("+cr+","+cg+","+cb+","+da+")");
grd.addColorStop(0.5,"rgba("+cr+","+cg+","+cb+","+(da*0.4)+")");
grd.addColorStop(1,"rgba("+cr+","+cg+","+cb+",0)");
ctx.fillStyle=grd;
ctx.beginPath();ctx.arc(x,y,dr*3,0,Math.PI*2);ctx.fill();}}
const midR=50+coh*22+(hovering?15:0);
const mg=ctx.createRadialGradient(cx,cy-4,0,cx,cy-4,midR);
mg.addColorStop(0,"rgba(255,228,110,"+(0.62+coh*0.28+(hovering?0.15:0))+")");
mg.addColorStop(0.18,"rgba(255,185,55,"+(0.38+coh*0.20)+")");
mg.addColorStop(0.45,"rgba(220,105,22,"+(0.16+coh*0.12)+")");
mg.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=mg;ctx.beginPath();ctx.arc(cx,cy-4,midR,0,Math.PI*2);ctx.fill();
const coreR=13+coh*9+Math.sin(t*1.3)*2.5+(hovering?4:0);
const core=ctx.createRadialGradient(cx,cy-4,0,cx,cy-4,coreR);
core.addColorStop(0,"rgba(255,255,245,1.0)");
core.addColorStop(0.12,"rgba(255,252,210,0.96)");
core.addColorStop(0.35,"rgba(255,215,85,0.72)");
core.addColorStop(0.65,"rgba(240,145,32,0.32)");
core.addColorStop(1,"rgba(10,4,1,0)");
ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy-4,coreR,0,Math.PI*2);ctx.fill();
const sparkCount=8;
for(let i=0;i<sparkCount;i++){
const angle=t*0.7+i*(Math.PI*2/sparkCount)+(hovering?t*0.4:0);
const dist=20+Math.sin(t*1.6+i*1.3)*10+coh*12+(hovering?8:0);
const sx=cx+Math.cos(angle)*dist;
const sy=(cy-4)+Math.sin(angle)*dist*0.75;
const sa=Math.max(0,(Math.abs(Math.sin(t*1.8+i*1.2))-0.15)*(0.6+coh*0.4+(hovering?0.2:0)));
const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,6);
sg.addColorStop(0,"rgba(255,245,165,"+sa+")");
sg.addColorStop(0.5,"rgba(255,185,50,"+(sa*0.5)+")");
sg.addColorStop(1,"rgba(255,120,20,0)");
ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,6,0,Math.PI*2);ctx.fill();}
}
draw();return()=>cancelAnimationFrame(frameId);
},[]);
return<canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%",display:"block"}}/>;
}
