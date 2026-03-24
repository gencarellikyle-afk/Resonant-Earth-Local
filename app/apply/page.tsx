"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const GRANT_TYPES = [
  {
    id: "relief",
    label: "Relief Grant",
    tagline: "For people in acute economic need during transition.",
    description: "You are navigating a genuine financial crisis � job loss, displacement, collapse of income. This grant receives you where you are and provides real support to stabilize your situation so you can begin to create.",
    range: "$1,500 � $40,000",
    rangeMin: 1500,
    rangeMax: 40000,
    forWhom: "Individuals experiencing acute economic displacement or transition."
  },
  {
    id: "creation",
    label: "Creation Grant",
    tagline: "For individuals building something new.",
    description: "You are building � a business, a practice, a system, a creative work � something that did not exist before and that contributes to the conscious economy. This grant funds the creation itself.",
    range: "$2,500 � $100,000+",
    rangeMin: 2500,
    rangeMax: 100000,
    forWhom: "Individuals actively building new systems, businesses, or creative works."
  },
  {
    id: "regenerative",
    label: "Regenerative Transfer",
    tagline: "For aligned organizations building conscious infrastructure.",
    description: "Your organization is building regenerative systems � communities, farms, educational environments, cooperative structures � that embody the principles of the conscious economy at scale.",
    range: "$5,000 � $150,000",
    rangeMin: 5000,
    rangeMax: 150000,
    forWhom: "Aligned organizations and collectives building regenerative infrastructure."
  }
];

function generateRefId(fieldId) {
  const base = fieldId || Date.now().toString();
  const ts = Date.now().toString(36).toUpperCase();
  const fragment = base.replace(/-/g,"").slice(-4).toUpperCase();
  return "RE-" + fragment + "-" + ts.slice(-4);
}

export default function ApplyPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [email, setEmail] = useState("");
  const [committed, setCommitted] = useState(false);
  const [fieldId, setFieldId] = useState("");
  const [signalCount, setSignalCount] = useState(0);
  const [firstSeen, setFirstSeen] = useState(null);
  const [hasSentSignal, setHasSentSignal] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("re_field_id") || "";
    const count = parseInt(localStorage.getItem("re_signal_count") || "0");
    const seen = localStorage.getItem("re_first_seen") || null;
    const lastSignal = localStorage.getItem("re_last_signal") || null;
    setFieldId(id);
    setSignalCount(count);
    setFirstSeen(seen);
    setHasSentSignal(count > 0 || !!lastSignal);
  }, []);

  function getCoherenceThreshold() {
    if (!fieldId) return false;
    if (signalCount >= 3) return true;
    if (firstSeen) {
      const days = (Date.now() - new Date(firstSeen).getTime()) / (1000 * 60 * 60 * 24);
      if (days >= 3) return true;
    }
    return false;
  }

  function handleCardClick(typeId) {
    setExpandedType(expandedType === typeId ? null : typeId);
  }

  function handleSelectType(typeId) {
    setSelectedType(typeId);
    setExpandedType(null);
    setAmount("");
  }

  const selectedGrant = GRANT_TYPES.find(t => t.id === selectedType);

  async function handleSubmit() {
    setError("");
    if (!selectedType) { setError("Select a grant type to continue."); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Enter a valid amount."); return; }
    if (!description.trim()) { setError("Tell us what you are building or what you need support for."); return; }
    if (!intendedUse.trim()) { setError("Tell us how you will use this grant."); return; }
    if (!committed) { setError("Please confirm your understanding before submitting."); return; }
    if (email && !/^[^s@]+@[^s@]+.[^s@]+$/.test(email)) { setError("Enter a valid email address or leave the field blank."); return; }

    const grant = selectedGrant;
    const amt = Number(amount);
    if (amt < grant.rangeMin) { setError("Minimum for " + grant.label + " is $" + grant.rangeMin.toLocaleString() + "."); return; }

    const ref = generateRefId(fieldId);
    setStatus("sending");

    try {
      const res = await fetch("/api/eco/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-eco-password": "PUBLIC_APPLICATION"
        },
        body: JSON.stringify({
          action: "create",
          grant_type: selectedType,
          amount_requested: amt,
          description: description.trim(),
          intended_use: intendedUse.trim(),
          applicant_anonymous_id: fieldId || null,
          coherence_threshold_met: getCoherenceThreshold(),
          notes: [
            email ? "Contact: " + email : "No contact provided",
            hasSentSignal ? "Signal presence: " + signalCount + " signal(s) in field" : "No prior field presence detected",
            "Ref: " + ref
          ].join(" | "),
          status: "pending"
        })
      });

      if (!res.ok) throw new Error("submission failed");

      setRefId(ref);
      setStatus("success");
      setFlash(true);
      setTimeout(() => setFlash(false), 1500);
    } catch(e) {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div style={{minHeight:"100vh",backgroundColor:"#120802",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"monospace",position:"relative",overflow:"hidden"}}>
        {flash && <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at center, rgba(255,107,61,0.18) 0%, transparent 70%)",zIndex:50,pointerEvents:"none"}}/>}
        <div style={{maxWidth:"560px",width:"100%",textAlign:"center"}}>
          <div style={{fontSize:"0.65rem",letterSpacing:"0.2em",color:"#FF6B3D",marginBottom:"2rem",textTransform:"uppercase"}}>Application Received</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.6rem,4vw,2.2rem)",color:"#F5E6D0",marginBottom:"1.5rem",fontWeight:"normal",fontStyle:"italic",lineHeight:1.3}}>Your application is in the field.</h1>
          <p style={{color:"#8A7A6A",fontSize:"0.85rem",lineHeight:1.8,marginBottom:"1rem"}}>The field has received what you brought. Your application will be reviewed with the same care you gave in writing it.</p>
          <p style={{color:"#8A7A6A",fontSize:"0.85rem",lineHeight:1.8,marginBottom:"2rem"}}>This is not a transaction. It is the beginning of a relationship with the conscious economy.</p>
          <div style={{marginBottom:"2.5rem",padding:"1rem",border:"1px solid #2A1F15",borderRadius:"4px",backgroundColor:"rgba(255,107,61,0.03)"}}>
            <div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#4A3A2A",textTransform:"uppercase",marginBottom:"0.5rem"}}>Your Reference</div>
            <div style={{fontSize:"1rem",letterSpacing:"0.12em",color:"#FF6B3D",fontFamily:"monospace"}}>{refId}</div>
            <div style={{fontSize:"0.62rem",color:"#3A2A1A",marginTop:"0.4rem"}}>Keep this. You may need it if you follow up.</div>
          </div>
          <div style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"#3A2A1A",marginBottom:"2.5rem",textTransform:"uppercase"}}>A shared system where individual presence creates collective results � on your own path.</div>
          <Link href="/" style={{fontSize:"0.65rem",letterSpacing:"0.15em",color:"#FF6B3D",textDecoration:"none",textTransform:"uppercase"}}>Return to the Field</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#120802",color:"#F5E6D0",fontFamily:"monospace",padding:"clamp(1.5rem,5vw,3rem) clamp(1rem,4vw,2rem)",paddingTop:"clamp(5rem,10vw,7rem)"}}>
      <div style={{maxWidth:"680px",margin:"0 auto"}}>

        <div style={{marginBottom:"3rem"}}>
          <div style={{fontSize:"0.6rem",letterSpacing:"0.2em",color:"#FF6B3D",textTransform:"uppercase",marginBottom:"1rem"}}>Apply for Support</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:"normal",fontStyle:"italic",color:"#F5E6D0",marginBottom:"1rem",lineHeight:1.3}}>Enter the conscious economy.</h1>
          <p style={{color:"#8A7A6A",fontSize:"0.82rem",lineHeight:1.9,maxWidth:"520px"}}>This is not a charity application. This is an investment in what you are building. Grant recipients are the first nodes of the conscious economy network. What you create becomes part of what sustains everyone who comes after you.</p>
        </div>

        <div style={{marginBottom:"3rem"}}>
          <div style={{fontSize:"0.6rem",letterSpacing:"0.18em",color:"#6A5A4A",textTransform:"uppercase",marginBottom:"1.2rem"}}>Step 1 � Select Grant Type</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {GRANT_TYPES.map(type => {
              const isExpanded = expandedType === type.id;
              const isSelected = selectedType === type.id;
              return (
                <div key={type.id} style={{border:"1px solid "+(isSelected?"#FF6B3D":isExpanded?"#4A3A2A":"#2A1F15"),borderRadius:"4px",overflow:"hidden",transition:"border-color 0.2s",backgroundColor:isSelected?"rgba(255,107,61,0.04)":"transparent",cursor:"pointer"}} onClick={() => handleCardClick(type.id)}>
                  <div style={{padding:"1rem 1.2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:"0.8rem",letterSpacing:"0.08em",color:isSelected?"#FF6B3D":"#F5E6D0",marginBottom:"0.25rem",fontWeight:isSelected?"bold":"normal"}}>{type.label}</div>
                      <div style={{fontSize:"0.72rem",color:"#6A5A4A",lineHeight:1.5}}>{type.tagline}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"0.75rem",flexShrink:0,marginLeft:"1rem"}}>
                      <span style={{fontSize:"0.7rem",color:"#FF6B3D",letterSpacing:"0.05em"}}>{type.range}</span>
                      <span style={{color:"#4A3A2A",fontSize:"0.7rem",transition:"transform 0.2s",display:"inline-block",transform:isExpanded?"rotate(180deg)":"rotate(0deg)"}}>?</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{padding:"0 1.2rem 1.2rem",borderTop:"1px solid #2A1F15"}} onClick={e => e.stopPropagation()}>
                      <p style={{fontSize:"0.78rem",color:"#8A7A6A",lineHeight:1.85,marginBottom:"0.75rem",marginTop:"0.9rem"}}>{type.description}</p>
                      <p style={{fontSize:"0.72rem",color:"#6A5A4A",marginBottom:"1rem",lineHeight:1.6}}><span style={{color:"#4A3A2A"}}>For: </span>{type.forWhom}</p>
                      <button onClick={() => handleSelectType(type.id)} style={{fontSize:"0.62rem",letterSpacing:"0.15em",color:"#120802",backgroundColor:"#FF6B3D",border:"none",padding:"0.5rem 1.2rem",cursor:"pointer",textTransform:"uppercase",borderRadius:"2px"}}>{isSelected ? "Selected ?" : "Select This Grant"}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedType && (
          <>
            <div style={{marginBottom:"2.5rem"}}>
              <div style={{fontSize:"0.6rem",letterSpacing:"0.18em",color:"#6A5A4A",textTransform:"uppercase",marginBottom:"1.2rem"}}>Step 2 � Amount Requested</div>
              <div style={{fontSize:"0.72rem",color:"#6A5A4A",marginBottom:"0.75rem"}}>Range for {selectedGrant.label}: <span style={{color:"#FF6B3D"}}>{selectedGrant.range}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <span style={{color:"#6A5A4A",fontSize:"0.9rem"}}>$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={selectedGrant.rangeMin.toString()} min={selectedGrant.rangeMin} style={{backgroundColor:"#1A0F08",border:"1px solid #2A1F15",color:"#F5E6D0",padding:"0.6rem 0.8rem",fontSize:"0.85rem",fontFamily:"monospace",width:"180px",borderRadius:"2px",outline:"none"}}/>
              </div>
            </div>

            <div style={{marginBottom:"2.5rem"}}>
              <div style={{fontSize:"0.6rem",letterSpacing:"0.18em",color:"#6A5A4A",textTransform:"uppercase",marginBottom:"1.2rem"}}>Step 3 � What You Are Building</div>
              <label style={{fontSize:"0.72rem",color:"#8A7A6A",display:"block",marginBottom:"0.6rem"}}>What are you building, creating, or what do you need support for?</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Speak honestly. Describe what you are doing or what you are navigating." rows={5} style={{width:"100%",backgroundColor:"#1A0F08",border:"1px solid #2A1F15",color:"#F5E6D0",padding:"0.8rem",fontSize:"0.78rem",fontFamily:"monospace",lineHeight:1.8,borderRadius:"2px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
            </div>

            <div style={{marginBottom:"2.5rem"}}>
              <div style={{fontSize:"0.6rem",letterSpacing:"0.18em",color:"#6A5A4A",textTransform:"uppercase",marginBottom:"1.2rem"}}>Step 4 � How You Will Use This</div>
              <label style={{fontSize:"0.72rem",color:"#8A7A6A",display:"block",marginBottom:"0.6rem"}}>How will this grant be used? What will it make possible?</label>
              <textarea value={intendedUse} onChange={e => setIntendedUse(e.target.value)} placeholder="Be specific. The field invests in what is real." rows={5} style={{width:"100%",backgroundColor:"#1A0F08",border:"1px solid #2A1F15",color:"#F5E6D0",padding:"0.8rem",fontSize:"0.78rem",fontFamily:"monospace",lineHeight:1.8,borderRadius:"2px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
            </div>

            <div style={{marginBottom:"2.5rem"}}>
              <div style={{fontSize:"0.6rem",letterSpacing:"0.18em",color:"#6A5A4A",textTransform:"uppercase",marginBottom:"1.2rem"}}>Step 5 � Contact <span style={{color:"#3A2A1A",fontSize:"0.55rem",letterSpacing:"0.1em"}}>(Optional)</span></div>
              <label style={{fontSize:"0.72rem",color:"#8A7A6A",display:"block",marginBottom:"0.6rem"}}>If you would like to be reached about your application, leave an email address. This is never required and never shared.</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com or leave blank" style={{backgroundColor:"#1A0F08",border:"1px solid #2A1F15",color:"#F5E6D0",padding:"0.6rem 0.8rem",fontSize:"0.78rem",fontFamily:"monospace",width:"100%",borderRadius:"2px",outline:"none",boxSizing:"border-box"}}/>
            </div>

            <div style={{marginBottom:"2rem",padding:"1.2rem",border:"1px solid #2A1F15",borderRadius:"4px",backgroundColor:"rgba(255,107,61,0.02)"}}>
              <label style={{display:"flex",alignItems:"flex-start",gap:"0.75rem",cursor:"pointer"}}>
                <div onClick={() => setCommitted(!committed)} style={{width:"16px",height:"16px",border:"1px solid "+(committed?"#FF6B3D":"#4A3A2A"),borderRadius:"2px",flexShrink:0,marginTop:"2px",backgroundColor:committed?"#FF6B3D":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s"}}>
                  {committed && <span style={{color:"#120802",fontSize:"10px",fontWeight:"bold"}}>?</span>}
                </div>
                <span style={{fontSize:"0.75rem",color:"#8A7A6A",lineHeight:1.8}}>I understand this is an investment in the conscious economy, not a charitable gift. If what I build grows, I will consider contributing back to the field � not because I am required to, but because I understand how the system sustains itself.</span>
              </label>
            </div>

            <div style={{marginBottom:"2rem",padding:"1rem",border:"1px solid #1A0F08",borderRadius:"4px",fontSize:"0.65rem",lineHeight:1.8}}>
              {hasSentSignal
                ? <div style={{color:"#FF6B3D"}}>? Field presence detected � {signalCount} signal{signalCount!==1?"s":""} in the field. {getCoherenceThreshold()?"Coherence threshold met.":"Your application will still be reviewed."}</div>
                : <div style={{color:"#3A2A1A"}}>No prior field presence detected from this device. Your application will still be reviewed � consider sending a signal to the field before or after you apply.</div>
              }
            </div>

            {error && <div style={{marginBottom:"1.5rem",fontSize:"0.72rem",color:"#FF6B3D",padding:"0.75rem",border:"1px solid rgba(255,107,61,0.3)",borderRadius:"2px"}}>{error}</div>}

            <button onClick={handleSubmit} disabled={status==="sending"} style={{fontSize:"0.65rem",letterSpacing:"0.18em",color:status==="sending"?"#4A3A2A":"#120802",backgroundColor:status==="sending"?"#2A1F15":"#FF6B3D",border:"none",padding:"0.85rem 2.5rem",cursor:status==="sending"?"not-allowed":"pointer",textTransform:"uppercase",borderRadius:"2px",transition:"all 0.2s"}}>
              {status==="sending" ? "Transmitting..." : "Submit Application"}
            </button>
          </>
        )}

        <div style={{marginTop:"4rem",paddingTop:"2rem",borderTop:"1px solid #1A0F08",fontSize:"0.6rem",color:"#3A2A1A",lineHeight:1.9}}>
          <p>Applications are reviewed by the field operator. There is no automated approval. Every application is read by a human who understands what you are building.</p>
          <p style={{marginTop:"0.5rem"}}>Grant amounts are not guaranteed. The field invests in coherence and creation � not credentials alone.</p>
          <div style={{marginTop:"1.5rem"}}><Link href="/" style={{color:"#4A3A2A",fontSize:"0.6rem",letterSpacing:"0.12em",textDecoration:"none",textTransform:"uppercase"}}>? Return to the Field</Link></div>
        </div>

      </div>
    </div>
  );
}
