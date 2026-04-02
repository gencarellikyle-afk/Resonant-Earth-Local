"use client";
import{useState,useEffect}from"react";
import Link from"next/link";
import{usePathname}from"next/navigation";
import{createClient}from"@supabase/supabase-js";
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function FieldNav(){const[coherence,setCoherence]=useState(0.4);const[scrolled,setScrolled]=useState(false);const pathname=usePathname();useEffect(()=>{fetch("/api/coherence/latest").then(r=>r.json()).then(d=>{if(d.score)setCoherence(d.score);}).catch(()=>{});const interval=setInterval(()=>{fetch("/api/coherence/latest").then(r=>r.json()).then(d=>{if(d.score)setCoherence(d.score);}).catch(()=>{});},5*60*1000);return()=>clearInterval(interval);},[]);useEffect(()=>{function onScroll(){setScrolled(window.scrollY>20);}window.addEventListener("scroll",onScroll);return()=>window.removeEventListener("scroll",onScroll);},[]);if(pathname==="/eco")return null;const pct=Math.round(coherence*100);const stateLabel=coherence<=0.25?"Quiet":coherence<=0.40?"Settling":coherence<=0.55?"Alive":coherence<=0.70?"Resonant":coherence<=0.85?"High Coherence":"Peak Coherence";const navLinks=[{href:"/",label:"Field"},{href:"/what-is-this",label:"What Is This"},{href:"/transparency",label:"Transparency"},{href:"/step-into-the-system",label:"Step In"}];
return(<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,borderBottom:"none",backgroundColor:scrolled?"rgba(4,2,12,0.88)":"rgba(8,4,20,0.35)",backdropFilter:"blur(18px)",transition:"all 0.4s ease",padding:"0 2rem",boxShadow:scrolled?"0 1px 30px rgba(100,60,200,0.22)":"none"}}><div style={{position:"absolute",bottom:0,left:0,height:"1px",width:pct+"%",background:"linear-gradient(to right, rgba(180,140,20,0.7), rgba(212,175,55,1.0), rgba(0,168,132,0.9), rgba(79,195,247,0.6))",transition:"width 1.4s ease",boxShadow:"0 0 8px rgba(79,195,247,0.5)"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,height:"1px",backgroundColor:"rgba(13,71,161,0.10)"}}/>
<div style={{maxWidth:"1400px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:"54px"}}>
<div style={{display:"flex",alignItems:"center",gap:"2.4rem"}}>
{navLinks.map(({href,label})=>{const active=pathname===href;return(<Link key={href} href={href} style={{fontFamily:"monospace",fontSize:"0.75rem",letterSpacing:"0.22em",textTransform:"uppercase",color:active?"#4FC3F7":"#E8F4FD",opacity:active?1:0.82,textDecoration:"none",transition:"all 0.3s ease",textShadow:active?"0 0 20px rgba(79,195,247,0.6)":"none",cursor:"crosshair"}} onMouseEnter={e=>{e.currentTarget.style.color="#4FC3F7";e.currentTarget.style.opacity="1";e.currentTarget.style.textShadow="0 0 18px rgba(79,195,247,0.45)";}} onMouseLeave={e=>{e.currentTarget.style.color=active?"#4FC3F7":"#E8F4FD";e.currentTarget.style.opacity=active?"1":"0.82";e.currentTarget.style.textShadow=active?"0 0 20px rgba(79,195,247,0.6)":"none";}}>{label}</Link>);})}
</div>
<div style={{display:"flex",alignItems:"center",gap:"1.6rem"}}>
<div style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
<span style={{width:"6px",height:"6px",borderRadius:"9999px",backgroundColor:"#00BCD4",display:"inline-block",boxShadow:"0 0 10px rgba(0,188,212,0.9)"}}/>
<span style={{fontFamily:"monospace",fontSize:"0.72rem",color:"#4FC3F7",letterSpacing:"0.12em",opacity:1,textShadow:"0 0 18px rgba(79,195,247,0.55)"}}>{pct}% &middot; {stateLabel}</span>
</div>
<Link href="/apply" style={{padding:"0.48rem 1.3rem",border:"1px solid rgba(0,188,212,0.75)",backgroundColor:"rgba(0,188,212,0.12)",color:"#00BCD4",fontFamily:"monospace",fontSize:"0.72rem",letterSpacing:"0.2em",textTransform:"uppercase",textDecoration:"none",transition:"all 0.3s ease",backdropFilter:"blur(4px)",cursor:"crosshair"}} onMouseEnter={e=>{e.currentTarget.style.backgroundColor="rgba(0,188,212,0.25)";e.currentTarget.style.borderColor="#00BCD4";e.currentTarget.style.color="#E8F4FD";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="rgba(0,188,212,0.12)";e.currentTarget.style.borderColor="rgba(0,188,212,0.75)";e.currentTarget.style.color="#00BCD4";}}>Apply</Link>
</div>
</div>
</nav>);}
















