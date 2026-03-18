"use client";
import React,{useState,useEffect,useRef}from"react";
import{createClient}from"@supabase/supabase-js";
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
function useCoherence(){const[v,setV]=useState(0.4);const t=useRef(0);useEffect(()=>{const id=setInterval(()=>{t.current+=0.005;const n=0.48+Math.sin(t.current*0.2)*0.26+Math.sin(t.current*0.5)*0.1+Math.sin(t.current*1.1)*0.04;setV(Math.max(0.1,Math.min(1,n)));},50);return()=>clearInterval(id);},[]);return v;}
function FieldDot({delay="0s"}){return(<span className="animate-pulse" style={{display:"inline-block",width:"5px",height:"5px",borderRadius:"9999px",backgroundColor:"#FF6B3D",animationDuration:"2.5s",animationDelay:delay,flexShrink:0}}/>);}
function PasswordGate({onUnlock}){const[pw,setPw]=useState("");const[err,setErr]=useState(false);const[shake,setShake]=useState(false);const[locked,setLocked]=useState(false);const[lockTimer,setLockTimer]=useState(0);const attempts=useRef(0);function submit(){if(locked)return;console.log("pw entered:",pw,"env pw:",process.env.NEXT_PUBLIC_ECO_PW);if(pw===process.env.NEXT_PUBLIC_ECO_PW){sessionStorage.setItem("eco_auth","1");onUnlock();}else{attempts.current++;setErr(true);setShake(true);setTimeout(()=>setShake(false),600);if(attempts.current>=5){setLocked(true);let t=60;setLockTimer(t);const id=setInterval(()=>{t--;setLockTimer(t);if(t<=0){clearInterval(id);setLocked(false);attempts.current=0;}},1000);}setTimeout(()=>setErr(false),2000);}}
return(<div style={{position:"fixed",inset:0,backgroundColor:"#090705",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",maxWidth:"320px",width:"100%",padding:"2rem"}}>
<p style={{fontFamily:"monospace",fontSize:"0.65rem",letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(212,160,60,0.7)"}}>ECO CONSCIOUS</p>
<p style={{fontFamily:"Georgia,serif",fontWeight:300,fontSize:"1.8rem",color:"rgba(232,221,208,0.9)",textAlign:"center"}}>Command Center</p>
<div style={{width:"2rem",height:"1px",backgroundColor:"rgba(193,68,14,0.4)"}}/>
<div style={{width:"100%",transform:shake?"translateX(8px)":"translateX(0)",transition:"transform 0.1s ease"}}>
<input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Access key" disabled={locked} style={{width:"100%",padding:"0.75rem 1rem",backgroundColor:"rgba(232,221,208,0.04)",border:err?"1px solid rgba(193,68,14,0.8)":"1px solid rgba(232,221,208,0.15)",outline:"none",fontFamily:"monospace",fontSize:"0.8rem",color:"rgba(232,221,208,0.9)",cursor:"crosshair"}}/>
</div>
{locked&&<p style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(193,68,14,0.7)"}}>Locked � wait {lockTimer}s</p>}
{err&&!locked&&<p style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(193,68,14,0.7)"}}>Access denied.</p>}
<button onClick={submit} disabled={locked} style={{padding:"0.65rem 2rem",border:"1px solid rgba(193,68,14,0.5)",backgroundColor:"transparent",color:"rgba(232,221,208,0.8)",fontFamily:"monospace",fontSize:"0.65rem",letterSpacing:"0.24em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}} onMouseEnter={e=>{e.currentTarget.style.backgroundColor="rgba(193,68,14,0.15)";e.currentTarget.style.borderColor="#C1440E";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";e.currentTarget.style.borderColor="rgba(193,68,14,0.5)";}}>Enter</button>
</div></div>);}function StatTile({label,value,coherence}){return(<div style={{flex:1,minWidth:"140px",padding:"1.2rem",border:"1px solid rgba(232,221,208,0.08)",borderLeft:"2px solid rgba(193,68,14,0.5)",backgroundColor:"rgba(232,221,208,0.02)"}}>
<p style={{fontFamily:"Georgia,serif",fontWeight:300,fontSize:"2rem",color:"rgba(222,188,75,"+(0.8+coherence*0.18)+")",margin:0,transition:"color 1.5s ease"}}>{value}</p>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,221,208,0.45)",marginTop:"0.4rem"}}>{label}</p>
</div>);}
function SweepForm({password,onSweepLogged}){const[date,setDate]=useState(new Date().toISOString().split("T")[0]);const[profit,setProfit]=useState("");const[pct,setPct]=useState(50);const[notes,setNotes]=useState("");const[status,setStatus]=useState("idle");const sweepAmt=(parseFloat(profit)||0)*(pct/100);async function submit(){if(!profit||status==="sending")return;setStatus("sending");try{const r=await fetch("/api/eco/sweep",{method:"POST",headers:{"Content-Type":"application/json","x-eco-password":password},body:JSON.stringify({cycle_date:date,gross_profit:parseFloat(profit),sweep_pct:pct,notes})});const d=await r.json();if(d.error)throw new Error(d.error);setStatus("success");onSweepLogged(d.grant_pool_balance);setTimeout(()=>{setStatus("idle");setProfit("");setNotes("");},3000);}catch(e){setStatus("error");setTimeout(()=>setStatus("idle"),3000);}}
return(<div style={{display:"flex",flexDirection:"column",gap:"1rem",padding:"1.5rem",border:"1px solid rgba(232,221,208,0.06)",backgroundColor:"rgba(232,221,208,0.01)"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(212,160,60,0.6)"}}>Log New Sweep</p>
<div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
<input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
<input type="number" value={profit} onChange={e=>setProfit(e.target.value)} placeholder="Gross profit ($)" style={{flex:1,minWidth:"140px",padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
</div>
<div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
<div style={{display:"flex",justifyContent:"space-between"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(232,221,208,0.45)"}}>SWEEP PCT</p>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(212,160,60,0.8)"}}>{pct}% � {"$"+(sweepAmt.toFixed(2))}</p>
</div>
<input type="range" min={0} max={100} value={pct} onChange={e=>setPct(parseInt(e.target.value))} style={{width:"100%",cursor:"crosshair",accentColor:"#C1440E"}}/>
</div>
<input type="text" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes (optional)" style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
{status==="error"&&<p style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(193,68,14,0.8)"}}>Error logging sweep.</p>}
{status==="success"&&<p style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(212,160,60,0.8)"}}>Sweep logged. Pool updated.</p>}
<button onClick={submit} disabled={!profit||status==="sending"} style={{alignSelf:"flex-start",padding:"0.6rem 1.6rem",border:profit?"1px solid rgba(193,68,14,0.6)":"1px solid rgba(232,221,208,0.1)",backgroundColor:"transparent",color:profit?"rgba(232,221,208,0.85)":"rgba(232,221,208,0.25)",fontFamily:"monospace",fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",cursor:profit?"crosshair":"default",transition:"all 0.3s ease"}} onMouseEnter={e=>{if(!profit)return;e.currentTarget.style.backgroundColor="rgba(193,68,14,0.15)";e.currentTarget.style.borderColor="#C1440E";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";e.currentTarget.style.borderColor=profit?"rgba(193,68,14,0.6)":"rgba(232,221,208,0.1)";}}>
{status==="sending"?"Logging...":"Log Sweep"}</button>
</div>);}function GrantCard({grant,password,onUpdate}){const[approveAmt,setApproveAmt]=useState(grant.amount_requested||"");const[approving,setApproving]=useState(false);const[status,setStatus]=useState("idle");const typeColor=grant.grant_type==="creation"?"rgba(222,188,75,0.8)":grant.grant_type==="relief"?"rgba(193,68,14,0.8)":"rgba(60,160,120,0.8)";async function act(action){setStatus("sending");try{const r=await fetch("/api/eco/grant",{method:"POST",headers:{"Content-Type":"application/json","x-eco-password":password},body:JSON.stringify({id:grant.id,action,amount_approved:parseFloat(approveAmt)})});const d=await r.json();if(d.error)throw new Error(d.error);setStatus("idle");onUpdate();}catch(e){setStatus("error");setTimeout(()=>setStatus("idle"),3000);}}
return(<div style={{padding:"1.2rem",border:"1px solid rgba(232,221,208,0.08)",borderLeft:"2px solid "+typeColor,backgroundColor:"rgba(232,221,208,0.02)",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:typeColor,letterSpacing:"0.2em",textTransform:"uppercase"}}>{grant.grant_type}</p>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",color:"rgba(232,221,208,0.35)"}}>{new Date(grant.created_at).toLocaleDateString()}</p>
</div>
<p style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.55)"}}>ID: {grant.applicant_anonymous_id||"anonymous"}</p>
<p style={{fontFamily:"Georgia,serif",fontSize:"0.85rem",color:"rgba(232,221,208,0.7)",fontStyle:"italic"}}>{grant.notes||"No notes."}</p>
<div style={{display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap"}}>
<p style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.5)"}}>Requested: {"$"+grant.amount_requested}</p>
<p style={{fontFamily:"monospace",fontSize:"0.62rem",color:grant.coherence_threshold_met?"rgba(212,160,60,0.8)":"rgba(232,221,208,0.35)"}}>Coherence: {grant.coherence_threshold_met?"MET":"NOT MET"}</p>
</div>
{grant.status==="pending"&&<div style={{display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap"}}>
<input type="number" value={approveAmt} onChange={e=>setApproveAmt(e.target.value)} placeholder="Approve amount" style={{padding:"0.4rem 0.6rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.65rem",color:"rgba(232,221,208,0.8)",width:"140px",cursor:"crosshair"}}/>
<button onClick={()=>act("approve")} disabled={status==="sending"} style={{padding:"0.4rem 1rem",border:"1px solid rgba(212,160,60,0.5)",backgroundColor:"transparent",color:"rgba(212,160,60,0.8)",fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>Approve</button>
<button onClick={()=>act("decline")} disabled={status==="sending"} style={{padding:"0.4rem 1rem",border:"1px solid rgba(193,68,14,0.35)",backgroundColor:"transparent",color:"rgba(193,68,14,0.6)",fontFamily:"monospace",fontSize:"0.6rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>Decline</button>
</div>}
{grant.status!=="pending"&&<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:grant.status==="approved"?"rgba(212,160,60,0.7)":"rgba(232,221,208,0.3)",letterSpacing:"0.15em",textTransform:"uppercase"}}>{grant.status}</p>}
</div>);}
function AgentPanel({password,fieldData,poolData}){const[reportText,setReportText]=useState("");const[projText,setProjText]=useState("");const[monthlyProfit,setMonthlyProfit]=useState("");const[sweepPct,setSweepPct]=useState(50);const[avgGrant,setAvgGrant]=useState(500);const[reportStatus,setReportStatus]=useState("idle");const[projStatus,setProjStatus]=useState("idle");async function getReport(){setReportStatus("loading");try{const r=await fetch("/api/eco/agent",{method:"POST",headers:{"Content-Type":"application/json","x-eco-password":password},body:JSON.stringify({type:"field_report",data:fieldData})});const d=await r.json();setReportText(d.text||"Agent unavailable.");setReportStatus("done");}catch(e){setReportStatus("idle");}}
async function getProjection(){if(!monthlyProfit)return;setProjStatus("loading");try{const r=await fetch("/api/eco/agent",{method:"POST",headers:{"Content-Type":"application/json","x-eco-password":password},body:JSON.stringify({type:"pool_projection",data:{monthly_profit:parseFloat(monthlyProfit),sweep_pct:sweepPct,current_balance:poolData.balance,avg_grant:avgGrant}})});const d=await r.json();setProjText(d.text||"Agent unavailable.");setProjStatus("done");}catch(e){setProjStatus("idle");}}
return(<div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
<div style={{padding:"1.5rem",border:"1px solid rgba(232,221,208,0.06)",backgroundColor:"rgba(232,221,208,0.01)"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(212,160,60,0.6)",marginBottom:"1rem"}}>Field Report Agent</p>
<button onClick={getReport} disabled={reportStatus==="loading"} style={{padding:"0.6rem 1.6rem",border:"1px solid rgba(193,68,14,0.5)",backgroundColor:"transparent",color:"rgba(232,221,208,0.8)",fontFamily:"monospace",fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease",marginBottom:"1rem"}} onMouseEnter={e=>{e.currentTarget.style.backgroundColor="rgba(193,68,14,0.15)";e.currentTarget.style.borderColor="#C1440E";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";e.currentTarget.style.borderColor="rgba(193,68,14,0.5)";}}>
{reportStatus==="loading"?"Generating...":"Generate Field Report"}</button>
{reportText&&<p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"0.9rem",lineHeight:1.8,color:"rgba(232,221,208,0.75)"}}>{reportText}</p>}
</div>
<div style={{padding:"1.5rem",border:"1px solid rgba(232,221,208,0.06)",backgroundColor:"rgba(232,221,208,0.01)"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(212,160,60,0.6)",marginBottom:"1rem"}}>Pool Projection Agent</p>
<div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginBottom:"1rem"}}>
<input type="number" value={monthlyProfit} onChange={e=>setMonthlyProfit(e.target.value)} placeholder="Monthly profit ($)" style={{flex:1,minWidth:"140px",padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
<input type="number" value={avgGrant} onChange={e=>setAvgGrant(parseInt(e.target.value))} placeholder="Avg grant ($)" style={{width:"120px",padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
</div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.4rem"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(232,221,208,0.45)"}}>SWEEP PCT</p>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(212,160,60,0.8)"}}>{sweepPct}%</p>
</div>
<input type="range" min={0} max={100} value={sweepPct} onChange={e=>setSweepPct(parseInt(e.target.value))} style={{width:"100%",cursor:"crosshair",accentColor:"#C1440E",marginBottom:"1rem"}}/>
<button onClick={getProjection} disabled={!monthlyProfit||projStatus==="loading"} style={{padding:"0.6rem 1.6rem",border:monthlyProfit?"1px solid rgba(193,68,14,0.5)":"1px solid rgba(232,221,208,0.1)",backgroundColor:"transparent",color:monthlyProfit?"rgba(232,221,208,0.8)":"rgba(232,221,208,0.25)",fontFamily:"monospace",fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",cursor:monthlyProfit?"crosshair":"default",transition:"all 0.3s ease",marginBottom:"1rem"}} onMouseEnter={e=>{if(!monthlyProfit)return;e.currentTarget.style.backgroundColor="rgba(193,68,14,0.15)";e.currentTarget.style.borderColor="#C1440E";}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor="transparent";e.currentTarget.style.borderColor=monthlyProfit?"rgba(193,68,14,0.5)":"rgba(232,221,208,0.1)";}}>
{projStatus==="loading"?"Projecting...":"Project Pool"}</button>
{projText&&<p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"0.9rem",lineHeight:1.8,color:"rgba(232,221,208,0.75)"}}>{projText}</p>}
</div></div>);}export default function EcoDashboard(){const coherence=useCoherence();const[authed,setAuthed]=useState(false);const[password,setPassword]=useState("");const[stats,setStats]=useState({signals:0,signalsToday:0,waitlist:0,countries:0});const[pool,setPool]=useState({balance:0,totalSwept:0,totalGranted:0});const[sweepEvents,setSweepEvents]=useState([]);const[grants,setGrants]=useState([]);const[signals,setSignals]=useState([]);const[grantTab,setGrantTab]=useState("pending");const[showNewGrant,setShowNewGrant]=useState(false);const[newGrant,setNewGrant]=useState({applicant_anonymous_id:"",grant_type:"creation",amount_requested:"",coherence_threshold_met:false,notes:""});const[newGrantStatus,setNewGrantStatus]=useState("idle");
useEffect(()=>{const stored=sessionStorage.getItem("eco_auth");const storedPw=sessionStorage.getItem("eco_pw");if(stored==="1"&&storedPw){setAuthed(true);setPassword(storedPw);}else if(stored==="1"){setAuthed(true);}},[]);
function handleUnlock(){const pw=(document.querySelector("input[type=password]") as HTMLInputElement)?.value||"";sessionStorage.setItem("eco_auth","1");sessionStorage.setItem("eco_pw",pw);setPassword(pw);setAuthed(true);}
async function loadData(){const today=new Date().toISOString().split("T")[0];const[sigAll,sigToday,waitlist,sweeps,grantsData,recentSigs]=await Promise.all([supabase.from("signals").select("id,country").limit(1000),supabase.from("signals").select("id").gte("created_at",today+"T00:00:00").limit(1000),supabase.from("waitlist").select("id").limit(1000),supabase.from("sweep_events").select("*").order("created_at",{ascending:false}),supabase.from("grants").select("*").order("created_at",{ascending:false}),supabase.from("signals").select("id,text,coherence,country,created_at").order("created_at",{ascending:false}).limit(20)]);console.log("sigAll:",sigAll.data?.length,sigAll.error);console.log("waitlist:",waitlist.data?.length,waitlist.error);console.log("recentSigs:",recentSigs.data?.length,recentSigs.error);const countries=new Set((sigAll.data||[]).map(s=>s.country).filter(Boolean)).size;const balance=sweeps.data&&sweeps.data.length>0?sweeps.data[0].grant_pool_balance:0;const totalSwept=(sweeps.data||[]).reduce((a,s)=>a+s.sweep_amount,0);const totalGranted=(grantsData.data||[]).filter(g=>g.status==="approved").reduce((a,g)=>a+(g.amount_approved||0),0);setStats({signals:(sigAll.data||[]).length,signalsToday:(sigToday.data||[]).length,waitlist:(waitlist.data||[]).length,countries});setPool({balance,totalSwept,totalGranted});setSweepEvents(sweeps.data||[]);setGrants(grantsData.data||[]);setSignals(recentSigs.data||[]);}
useEffect(()=>{if(authed)loadData();},[authed]);
async function submitNewGrant(){setNewGrantStatus("sending");try{const r=await fetch("/api/eco/grant",{method:"POST",headers:{"Content-Type":"application/json","x-eco-password":password},body:JSON.stringify({action:"create",...newGrant,amount_requested:parseFloat(newGrant.amount_requested)})});const data=await r.json();if(data.error)throw new Error(data.error);setNewGrantStatus("success");setShowNewGrant(false);setNewGrant({applicant_anonymous_id:"",grant_type:"creation",amount_requested:"",coherence_threshold_met:false,notes:""});loadData();setTimeout(()=>setNewGrantStatus("idle"),2000);}catch(e){setNewGrantStatus("error");setTimeout(()=>setNewGrantStatus("idle"),3000);}}
if(!authed)return(<PasswordGate onUnlock={handleUnlock}/>);
const pendingGrants=grants.filter(g=>g.status==="pending");
const availableToGrant=pool.balance-pendingGrants.reduce((a,g)=>a+(g.amount_requested||0),0);
const fieldData={signals:stats.signals,signalsToday:stats.signalsToday,waitlist:stats.waitlist,countries:stats.countries,poolBalance:pool.balance,pendingGrants:pendingGrants.length};
return(<div style={{backgroundColor:"#090705",minHeight:"100vh",width:"100%",position:"relative"}}>
<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(120,45,8,0.12) 0%,rgba(8,6,4,0) 70%)"}}/>
<header style={{position:"sticky",top:0,zIndex:50,backgroundColor:"rgba(9,7,5,0.95)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(193,68,14,0.2)",padding:"0.8rem clamp(1rem,3vw,2.5rem)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.75rem",letterSpacing:"0.3em",color:"rgba(222,188,75,0.9)"}}>ECO</span>
<span style={{fontFamily:"monospace",fontSize:"0.75rem",letterSpacing:"0.3em",color:"rgba(193,68,14,0.9)"}}>CONSCIOUS</span>
</div>
<span style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",fontWeight:300,color:"rgba(222,188,75,"+(0.7+coherence*0.28)+")",transition:"color 1.5s ease"}}>{Math.round(coherence*100)}%</span>
<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.55rem",color:"rgba(232,221,208,0.35)"}}>{new Date().toLocaleDateString()}</span>
<FieldDot/>
</div>
</header>
<main style={{position:"relative",zIndex:10,maxWidth:"900px",margin:"0 auto",padding:"clamp(1.5rem,4vw,3rem) clamp(1rem,3vw,2rem)",display:"flex",flexDirection:"column",gap:"clamp(2rem,5vh,3rem)"}}>
<section>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1rem"}}>Field Pulse</p>
<div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
<StatTile label="Total Signals" value={stats.signals} coherence={coherence}/>
<StatTile label="Signals Today" value={stats.signalsToday} coherence={coherence}/>
<StatTile label="Waitlist" value={stats.waitlist} coherence={coherence}/>
<StatTile label="Countries" value={stats.countries} coherence={coherence}/>
</div>
<div style={{marginTop:"1.5rem"}}>
<AgentPanel password={password} fieldData={fieldData} poolData={pool}/>
</div>
</section>
<section>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1rem"}}>Grant Pool</p>
<div style={{display:"flex",gap:"1rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
<StatTile label="Pool Balance" value={"$"+pool.balance.toFixed(2)} coherence={coherence}/>
<StatTile label="Total Swept" value={"$"+pool.totalSwept.toFixed(2)} coherence={coherence}/>
<StatTile label="Total Granted" value={"$"+pool.totalGranted.toFixed(2)} coherence={coherence}/>
<StatTile label="Available" value={"$"+Math.max(0,availableToGrant).toFixed(2)} coherence={coherence}/>
</div>
<SweepForm password={password} onSweepLogged={(bal)=>{setPool(p=>({...p,balance:bal}));loadData();}}/>
</section>
<section>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1rem"}}>Sweep History</p>
{sweepEvents.length===0&&<p style={{fontFamily:"monospace",fontSize:"0.65rem",color:"rgba(232,221,208,0.3)"}}>No sweep events logged yet.</p>}
{sweepEvents.map((s,i)=>(<div key={s.id} style={{padding:"0.75rem 1rem",borderLeft:"1px solid rgba(193,68,14,"+(i===0?"0.5":"0.15")+")",backgroundColor:i===0?"rgba(193,68,14,0.04)":"transparent",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",marginBottom:"0.5rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.5)",minWidth:"90px"}}>{s.cycle_date}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(212,160,60,0.7)"}}>{"$"+s.gross_profit?.toFixed(2)}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.45)"}}>{s.sweep_pct}%</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(193,68,14,0.8)"}}>{"? $"+s.sweep_amount?.toFixed(2)}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.35)"}}>{"Pool: $"+s.grant_pool_balance?.toFixed(2)}</span>
{s.notes&&<span style={{fontFamily:"monospace",fontSize:"0.58rem",color:"rgba(232,221,208,0.3)",fontStyle:"italic"}}>{s.notes}</span>}
</div>))}
</section>
<section>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)"}}>Grants</p>
<div style={{display:"flex",gap:"0.5rem"}}>
<button onClick={()=>setGrantTab("pending")} style={{padding:"0.35rem 0.9rem",border:"1px solid "+(grantTab==="pending"?"rgba(193,68,14,0.7)":"rgba(232,221,208,0.1)"),backgroundColor:"transparent",color:grantTab==="pending"?"rgba(232,221,208,0.9)":"rgba(232,221,208,0.35)",fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>Pending ({pendingGrants.length})</button>
<button onClick={()=>setGrantTab("all")} style={{padding:"0.35rem 0.9rem",border:"1px solid "+(grantTab==="all"?"rgba(193,68,14,0.7)":"rgba(232,221,208,0.1)"),backgroundColor:"transparent",color:grantTab==="all"?"rgba(232,221,208,0.9)":"rgba(232,221,208,0.35)",fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>All ({grants.length})</button>
<button onClick={()=>setShowNewGrant(v=>!v)} style={{padding:"0.35rem 0.9rem",border:"1px solid rgba(212,160,60,0.4)",backgroundColor:"transparent",color:"rgba(212,160,60,0.7)",fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>+ New</button>
</div>
</div>
{showNewGrant&&<div style={{padding:"1.5rem",border:"1px solid rgba(232,221,208,0.08)",backgroundColor:"rgba(232,221,208,0.02)",marginBottom:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(212,160,60,0.6)"}}>New Grant Application</p>
<input type="text" value={newGrant.applicant_anonymous_id} onChange={e=>setNewGrant(g=>({...g,applicant_anonymous_id:e.target.value}))} placeholder="Anonymous ID" style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
<select value={newGrant.grant_type} onChange={e=>setNewGrant(g=>({...g,grant_type:e.target.value}))} style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(9,7,5,0.9)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}>
<option value="creation">Creation</option>
<option value="relief">Relief</option>
<option value="regenerative">Regenerative</option>
</select>
<input type="number" value={newGrant.amount_requested} onChange={e=>setNewGrant(g=>({...g,amount_requested:e.target.value}))} placeholder="Amount requested ($)" style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair"}}/>
<textarea value={newGrant.notes} onChange={e=>setNewGrant(g=>({...g,notes:e.target.value}))} placeholder="Notes" rows={3} style={{padding:"0.5rem 0.75rem",backgroundColor:"rgba(232,221,208,0.04)",border:"1px solid rgba(232,221,208,0.12)",outline:"none",fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(232,221,208,0.8)",cursor:"crosshair",resize:"none"}}/>
<div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
<input type="checkbox" checked={newGrant.coherence_threshold_met} onChange={e=>setNewGrant(g=>({...g,coherence_threshold_met:e.target.checked}))} style={{cursor:"crosshair",accentColor:"#C1440E"}}/>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.55)"}}>Coherence threshold met</span>
</div>
{newGrantStatus==="error"&&<p style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(193,68,14,0.8)"}}>Error submitting grant.</p>}
<button onClick={submitNewGrant} disabled={!newGrant.amount_requested||newGrantStatus==="sending"} style={{alignSelf:"flex-start",padding:"0.6rem 1.6rem",border:"1px solid rgba(193,68,14,0.6)",backgroundColor:"transparent",color:"rgba(232,221,208,0.85)",fontFamily:"monospace",fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",cursor:"crosshair",transition:"all 0.3s ease"}}>{newGrantStatus==="sending"?"Submitting...":"Submit Grant"}</button>
</div>}
{(grantTab==="pending"?pendingGrants:grants).length===0&&<p style={{fontFamily:"monospace",fontSize:"0.65rem",color:"rgba(232,221,208,0.3)"}}>No grants {grantTab==="pending"?"pending":""} yet.</p>}
{(grantTab==="pending"?pendingGrants:grants).map(g=>(<GrantCard key={g.id} grant={g} password={password} onUpdate={loadData}/>))}
</section>
<section>
<p style={{fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(212,160,60,0.55)",marginBottom:"1rem"}}>Signal Intelligence</p>
<div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
<div style={{flex:1,minWidth:"200px"}}>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,221,208,0.35)",marginBottom:"0.75rem"}}>Top Countries</p>
{Object.entries(signals.reduce((acc:Record<string,number>,s)=>{if(s.country){acc[s.country]=(acc[s.country]||0)+1;}return acc;},{} as Record<string,number>)).sort((a,b)=>(b[1] as number)-(a[1] as number)).slice(0,8).map(([country,count])=>(<div key={country} style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"0.4rem"}}>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(222,188,75,0.7)",minWidth:"2rem",textAlign:"right"}}>{count as number}</span>
<span style={{fontFamily:"monospace",fontSize:"0.62rem",color:"rgba(232,221,208,0.55)"}}>{country}</span>
</div>))}
</div>
<div style={{flex:2,minWidth:"280px"}}>
<p style={{fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,221,208,0.35)",marginBottom:"0.75rem"}}>Recent Signals</p>
{signals.map(s=>(<div key={s.id} style={{padding:"0.6rem 0.75rem",borderLeft:"1px solid rgba(193,68,14,0.2)",marginBottom:"0.4rem",display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
<span style={{fontFamily:"monospace",fontSize:"0.58rem",color:s.coherence>0.7?"rgba(222,188,75,0.8)":"rgba(232,221,208,0.35)",minWidth:"2.5rem",flexShrink:0}}>{Math.round((s.coherence||0)*100)}%</span>
<span style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"0.8rem",color:"rgba(232,221,208,0.55)",lineHeight:1.6}}>{s.text?.slice(0,100)}{s.text?.length>100?"...":""}</span>
<span style={{fontFamily:"monospace",fontSize:"0.52rem",color:"rgba(232,221,208,0.25)",flexShrink:0,marginLeft:"auto"}}>{s.country||""}</span>
</div>))}
</div>
</div>
</section>
</main>
</div>);}