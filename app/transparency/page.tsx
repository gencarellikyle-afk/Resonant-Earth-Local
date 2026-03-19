"use client";
import React,{useState,useEffect}from"react";
import Link from"next/link";
import{createClient}from"@supabase/supabase-js";
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function TransparencyPage(){const[loaded,setLoaded]=useState(false);const[pool,setPool]=useState({balance:0,totalSwept:0,totalGranted:0,pending:0});const[sweeps,setSweeps]=useState([]);const[grants,setGrants]=useState([]);const[stats,setStats]=useState({signals:0,countries:0,waitlist:0});
useEffect(()=>{async function load(){const[sweepData,grantData,sigData,waitData]=await Promise.all([supabase.from("sweep_events").select("*").order("created_at",{ascending:false}),supabase.from("grants").select("id,grant_type,amount_approved,status,created_at").order("created_at",{ascending:false}),supabase.from("signals").select("id,country").limit(1000),supabase.from("waitlist").select("id").limit(1000)]);const sd=sweepData.data||[];const gd=grantData.data||[];const sigd=sigData.data||[];const balance=sd.length>0?sd[0].grant_pool_balance:0;const totalSwept=sd.reduce((a,s)=>a+(s.sweep_amount||0),0);const totalGranted=gd.filter(g=>g.status==="approved").reduce((a,g)=>a+(g.amount_approved||0),0);const pending=gd.filter(g=>g.status==="pending").length;const countries=new Set(sigd.map(s=>s.country).filter(Boolean)).size;setSweeps(sd);setGrants(gd);setPool({balance,totalSwept,totalGranted,pending});setStats({signals:sigd.length,countries,waitlist:(waitData.data||[]).length});setTimeout(()=>setLoaded(true),200);}load();},[]);
const typeColor=(t)=>t==="creation"?"rgba(222,188,75,0.85)":t==="relief"?"rgba(193,68,14,0.85)":"rgba(60,160,120,0.85)";
return(<div style={{backgroundColor:"#090705",minHeight:"100vh",width:"100%",position:"relative",overflowX:"hidden"}}>
<div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(120,45,8,0.1) 0%,rgba(9,7,5,0) 70%)"}}/>
<div style={{position:"relative",zIndex:10,width:"100%",maxWidth:"min(820px,92vw)",margin:"0 auto",padding:"clamp(5rem,10vh,8rem) 1.5rem clamp(3rem,8vh,6rem)"}}>
<Link href="/" style={{display:"block",fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(212,160,60,0.75)",textDecoration:"none",marginBottom:"clamp(2rem,5vh,4rem)"}}>Back to the field</Link>
<header style={{marginBottom:"clamp(2rem,5vh,4rem)",opacity:loaded?1:0,transition:"opacity 2s ease 0.3s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.65rem",letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(212,160,60,0.75)",marginBottom:"0.75rem"}}>Resonant Earth</p>
<h1 style={{fontFamily:"Georgia,serif",fontWeight:300,fontSize:"clamp(2rem,5vw,3.5rem)",lineHeight:1.1,color:"rgba(232,221,208,0.88)",margin:0,marginBottom:"1rem"}}>Full Transparency</h1>
<p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"clamp(0.9rem,2vw,1.1rem)",color:"rgba(232,221,208,0.55)",lineHeight:1.8,maxWidth:"560px"}}>Every contribution to this field is accounted for here. Every sweep. Every grant. Every dollar. Nothing is hidden.</p>
<div style={{width:"3rem",height:"1px",backgroundColor:"rgba(193,68,14,0.4)",marginTop:"1.5rem"}}/>
</header>
<section style={{marginBottom:"clamp(2.5rem,6vh,4rem)",opacity:loaded?1:0,transition:"opacity 2s ease 0.5s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1.2rem"}}>Field Status</p>
<div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
{[{label:"Signals in the Field",value:stats.signals},{label:"Countries Represented",value:stats.countries},{label:"Waitlist",value:stats.waitlist}].map((s,i)=>(<div key={i} style={{flex:1,minWidth:"140px",padding:"1.2rem",border:"1px solid rgba(232,221,208,0.08)",borderLeft:"2px solid rgba(193,68,14,0.4)",backgroundColor:"rgba(232,221,208,0.02)"}}>
<p style={{fontFamily:"Georgia,serif",fontWeight:300,fontSize:"2rem",color:"rgba(222,188,75,0.85)",margin:0}}>{s.value}</p>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(232,221,208,0.4)",marginTop:"0.4rem"}}>{s.label}</p>
</div>))}
</div>
</section><section style={{marginBottom:"clamp(2.5rem,6vh,4rem)",opacity:loaded?1:0,transition:"opacity 2s ease 0.7s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1.2rem"}}>Grant Pool</p>
<div style={{display:"flex",gap:"1rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
{[{label:"Current Balance",value:"$"+pool.balance.toFixed(2),accent:true},{label:"Total Swept In",value:"$"+pool.totalSwept.toFixed(2)},{label:"Total Granted Out",value:"$"+pool.totalGranted.toFixed(2)},{label:"Pending Review",value:pool.pending+" grants"}].map((s,i)=>(<div key={i} style={{flex:1,minWidth:"140px",padding:"1.2rem",border:"1px solid rgba(232,221,208,0.08)",borderLeft:"2px solid "+(s.accent?"rgba(222,188,75,0.5)":"rgba(193,68,14,0.3)"),backgroundColor:"rgba(232,221,208,0.02)"}}>
<p style={{fontFamily:"Georgia,serif",fontWeight:300,fontSize:"1.8rem",color:s.accent?"rgba(222,188,75,0.9)":"rgba(232,221,208,0.7)",margin:0}}>{s.value}</p>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(232,221,208,0.4)",marginTop:"0.4rem"}}>{s.label}</p>
</div>))}
</div>
<div style={{padding:"1rem 1.5rem",border:"1px solid rgba(193,68,14,0.15)",backgroundColor:"rgba(193,68,14,0.04)"}}>
<p style={{fontFamily:"monospace",fontSize:"0.62rem",lineHeight:2,color:"rgba(232,221,208,0.55)"}}>All trading profits from ECO Conscious are swept into this pool by field vote governance. Creation Grants support individuals building new systems. Relief Grants support individuals in acute need during economic transition. Regenerative Transfers support organizations aligned with the conscious economy.</p>
</div>
</section>
<section style={{marginBottom:"clamp(2.5rem,6vh,4rem)",opacity:loaded?1:0,transition:"opacity 2s ease 0.9s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1.2rem"}}>Sweep History</p>
{sweeps.length===0&&<p style={{fontFamily:"monospace",fontSize:"0.65rem",color:"rgba(232,221,208,0.3)"}}>No sweeps recorded yet. First sweep will appear here.</p>}
{sweeps.map((s,i)=>(<div key={s.id} style={{padding:"0.85rem 1rem",borderLeft:"1px solid rgba(193,68,14,"+(i===0?"0.5":"0.15")+")",backgroundColor:i===0?"rgba(193,68,14,0.03)":"transparent",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",marginBottom:"0.5rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.5)",minWidth:"90px"}}>{s.cycle_date}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(212,160,60,0.7)"}}>{"Swept: $"+s.sweep_amount?.toFixed(2)}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.35)"}}>{"Pool after: $"+s.grant_pool_balance?.toFixed(2)}</span>
{s.notes&&<span style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(232,221,208,0.3)",fontStyle:"italic"}}>{s.notes}</span>}
</div>))}
</section>
<section style={{marginBottom:"clamp(2.5rem,6vh,4rem)",opacity:loaded?1:0,transition:"opacity 2s ease 1.1s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1.2rem"}}>Grants</p>
{grants.length===0&&<p style={{fontFamily:"monospace",fontSize:"0.65rem",color:"rgba(232,221,208,0.3)"}}>No grants distributed yet. First grant will appear here.</p>}
{grants.map((g)=>(<div key={g.id} style={{padding:"0.85rem 1rem",borderLeft:"2px solid "+typeColor(g.grant_type),backgroundColor:"rgba(232,221,208,0.01)",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",marginBottom:"0.5rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.6rem",color:typeColor(g.grant_type),letterSpacing:"0.15em",textTransform:"uppercase",minWidth:"90px"}}>{g.grant_type}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.55)"}}>{g.status==="approved"?"$"+(g.amount_approved?.toFixed(2)||"0.00"):"Pending"}</span>
<span style={{fontFamily:"monospace",fontSize:"0.55rem",color:"rgba(232,221,208,0.3)"}}>{new Date(g.created_at).toLocaleDateString()}</span>
<span style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.1em",textTransform:"uppercase",color:g.status==="approved"?"rgba(212,160,60,0.6)":g.status==="declined"?"rgba(193,68,14,0.4)":"rgba(232,221,208,0.3)"}}>{g.status}</span>
</div>))}
</section>
<footer style={{borderTop:"1px solid rgba(193,68,14,0.1)",paddingTop:"2rem",opacity:loaded?1:0,transition:"opacity 2s ease 1.3s"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",lineHeight:2,color:"rgba(232,221,208,0.3)"}}>Resonant Earth is owned by the South Dakota Perpetual Purpose Trust. No individual holds equity. All financial flows are governed by the trust mandate. This page updates in real time.</p>
<Link href="/" style={{display:"inline-block",marginTop:"1.5rem",fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.24em",textTransform:"uppercase",color:"rgba(212,160,60,0.6)",textDecoration:"none"}}>Return to the Field</Link>
</footer>
</div></div>);}