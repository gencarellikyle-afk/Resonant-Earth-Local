"use client";
import React,{useState,useEffect,useRef}from"react";
import Link from"next/link";
import{usePathname}from"next/navigation";
function useCoherence(){const[v,setV]=useState(0.4);const t=useRef(0);useEffect(()=>{const id=setInterval(()=>{t.current+=0.005;const n=0.48+Math.sin(t.current*0.2)*0.26+Math.sin(t.current*0.5)*0.1+Math.sin(t.current*1.1)*0.04;setV(Math.max(0.1,Math.min(1,n)));},50);return()=>clearInterval(id);},[]);return v;}
export default function FieldNav(){const coherence=useCoherence();const pct=Math.round(coherence*100);const pathname=usePathname();if(pathname==="/eco")return null;
const linkStyle=(path)=>({fontFamily:"monospace",fontSize:"clamp(0.52rem,0.9vw,0.62rem)",letterSpacing:"0.28em",textTransform:"uppercase",color:pathname===path?"rgba(222,188,75,0.9)":"rgba(232,221,208,0.45)",textDecoration:"none",transition:"color 0.3s ease"});
const hover=(e,path)=>e.currentTarget.style.color="rgba(222,188,75,0.9)";
const unhover=(e,path)=>e.currentTarget.style.color=pathname===path?"rgba(222,188,75,0.9)":"rgba(232,221,208,0.45)";
return(<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.7rem clamp(1rem,3vw,2.5rem)",backgroundColor:"rgba(9,7,5,0.75)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(193,68,14,0.1)"}}>
<div style={{display:"flex",alignItems:"center",gap:"clamp(0.75rem,2.5vw,1.75rem)"}}>
<Link href="/" style={linkStyle("/")} onMouseEnter={e=>hover(e,"/")} onMouseLeave={e=>unhover(e,"/")}>Field</Link>
<Link href="/what-is-this" style={linkStyle("/what-is-this")} onMouseEnter={e=>hover(e,"/what-is-this")} onMouseLeave={e=>unhover(e,"/what-is-this")}>What Is This</Link>
<Link href="/transparency" style={linkStyle("/transparency")} onMouseEnter={e=>hover(e,"/transparency")} onMouseLeave={e=>unhover(e,"/transparency")}>Transparency</Link>
<Link href="/step-into-the-system" style={linkStyle("/step-into-the-system")} onMouseEnter={e=>hover(e,"/step-into-the-system")} onMouseLeave={e=>unhover(e,"/step-into-the-system")}>Step In</Link>
<Link href="/apply" style={{...linkStyle("/apply"),color:pathname==="/apply"?"rgba(222,188,75,0.9)":"rgba(255,107,61,0.7)"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,107,61,1)"} onMouseLeave={e=>e.currentTarget.style.color=pathname==="/apply"?"rgba(222,188,75,0.9)":"rgba(255,107,61,0.7)"}>Apply</Link>
</div>
<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
<span style={{display:"inline-block",width:"5px",height:"5px",borderRadius:"9999px",backgroundColor:"#FF6B3D",animation:"pulse 2.5s infinite"}}/>
<span style={{fontFamily:"monospace",fontSize:"clamp(0.5rem,0.85vw,0.6rem)",letterSpacing:"0.2em",color:"rgba(212,160,60,"+(0.5+coherence*0.4)+")",transition:"color 1.5s ease"}}>{pct}%</span>
</div>
</nav>);}
