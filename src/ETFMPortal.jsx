import { useState, useEffect } from "react";

const STORAGE_KEY = "etfm_portal_data";
const CALENDLY    = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const loadData = () => {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {}; }
  catch { return {}; }
};
const saveData = (d) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
};

const C = {
  bg:      "#FAF8F4",
  surface: "#FFFFFF",
  gold:    "#c9a84c",
  navy:    "#1a2744",
  text:    "#1a1a2e",
  muted:   "#6b7280",
  border:  "#ede9e3",
  shadow:  "0 2px 16px rgba(0,0,0,0.06)",
  goldSoft:"rgba(201,168,76,0.08)",
};

const TABS = [
  { id:"dashboard", label:"Dashboard" },
  { id:"phase1",    label:"Phase 1"   },
  { id:"tools",     label:"Tools"     },
  { id:"progress",  label:"Progress"  },
  { id:"roadmap",   label:"Roadmap"   },
  { id:"advisory",  label:"Advisory"  },
];

export default function ETFMPortal() {
  const [data, setData]           = useState(loadData);
  const [saved, setSaved]         = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!document.getElementById("ep-fonts")) {
      const link = document.createElement("link");
      link.id = "ep-fonts"; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("ep-css")) {
      const el = document.createElement("style");
      el.id = "ep-css";
      el.textContent = `
        @keyframes epIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .ep-fade { animation: epIn 0.22s ease both; }
        *,*::before,*::after { box-sizing:border-box; }
        @media(max-width:768px){
          .ep-g2  { grid-template-columns:1fr!important; }
          .ep-g4  { grid-template-columns:1fr 1fr!important; }
          .ep-rings { flex-direction:column!important; align-items:center!important; gap:40px!important; }
          .ep-nav { padding:0 16px!important; }
          .ep-cnt { padding:32px 20px!important; }
          .ep-nac { flex-direction:column!important; align-items:flex-start!important; gap:16px!important; }
        }
      `;
      document.head.appendChild(el);
    }
  }, []);

  const update = (key, val) => {
    const next = { ...data, [key]: val };
    setData(next); saveData(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const tc           = [data.tool1_complete, data.tool2_complete, data.tool3_complete, data.tool4_complete].filter(Boolean).length;
  const overallPct   = Math.round((tc / 4) * 15);
  const structurePct = Math.round((tc / 4) * 22);
  const t2Locked     = !data.tool1_complete;
  const t3Locked     = !data.tool2_complete;
  const t4Locked     = !data.tool3_complete;
  const firstName    = data.wb_name ? data.wb_name.trim().split(/\s+/)[0] : null;
  const nextMilestone =
    tc === 0 ? "Complete Tool 01: Financial Reset Workbook" :
    tc === 1 ? "Complete Tool 02: Financial Reality Audit"  :
    tc === 2 ? "Complete Tool 03: Spending Reflection"      :
    tc === 3 ? "Complete Tool 04: Weekly System Review"     :
               "Phase 1 complete. Phase 2 unlocked.";

  return (
    <div style={{ fontFamily:"'DM Sans', Inter, sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>

      {/* NAV */}
      <nav style={S.nav} className="ep-nav">
        <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", color:C.gold, fontSize:20, letterSpacing:6 }}>ETFM</div>
        <div style={{ display:"flex", alignItems:"center" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              ...S.navBtn,
              color:       activeTab === tab.id ? C.navy : C.muted,
              fontWeight:  activeTab === tab.id ? 500 : 400,
              borderBottom:`2px solid ${activeTab === tab.id ? C.gold : "transparent"}`,
            }}>{tab.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {saved && <span style={{ color:C.gold, fontSize:10, letterSpacing:3 }}>SAVED</span>}
          <div style={S.avatar}>{firstName ? firstName[0].toUpperCase() : "R"}</div>
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ paddingTop:60 }}>
        <div key={activeTab} className="ep-fade ep-cnt" style={S.content}>
          {activeTab === "dashboard" && <TabDashboard tc={tc} overallPct={overallPct} firstName={firstName} nextMilestone={nextMilestone} setActiveTab={setActiveTab} />}
          {activeTab === "phase1"    && <TabPhase1 setActiveTab={setActiveTab} />}
          {activeTab === "tools"     && <TabTools data={data} update={update} t2Locked={t2Locked} t3Locked={t3Locked} t4Locked={t4Locked} />}
          {activeTab === "progress"  && <TabProgress tc={tc} overallPct={overallPct} structurePct={structurePct} data={data} />}
          {activeTab === "roadmap"   && <TabRoadmap />}
          {activeTab === "advisory"  && <TabAdvisory />}
        </div>
      </main>
    </div>
  );
}

/* ─────────── TAB: DASHBOARD ─────────── */

function TabDashboard({ tc, overallPct, firstName, nextMilestone, setActiveTab }) {
  return (
    <div>
      <div style={{ marginBottom:48 }}>
        <h1 style={S.h1}>{firstName ? `Welcome back, ${firstName}.` : "Welcome back."}</h1>
        <p style={S.sub}>Your reset is in progress.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }} className="ep-g4">
        <MetricTile label="Overall Progress" value={`${overallPct}%`} />
        <MetricTile label="Current Phase"    value="Phase 1" sub="Awareness" />
        <MetricTile label="Tools Complete"   value={`${tc} of 4`} />
        <MetricTile label="Status"           value={tc === 0 ? "Day 1" : tc === 4 ? "Phase 1 Done" : "Active"} />
      </div>

      <div style={S.nextActionCard} className="ep-nac">
        <div>
          <div style={{ color:C.gold, fontSize:10, letterSpacing:4, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>NEXT ACTION</div>
          <div style={{ color:"#fff", fontSize:22, fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:400, lineHeight:1.3 }}>{nextMilestone}</div>
        </div>
        <button onClick={() => setActiveTab("tools")} style={S.btnGold}>BEGIN NOW</button>
      </div>

      <div style={{ marginTop:52 }}>
        <div style={{ ...S.eyebrow, marginBottom:24 }}>YOUR JOURNEY</div>
        <PhasePath activeIndex={0} />
      </div>
    </div>
  );
}

/* ─────────── TAB: PHASE 1 ─────────── */

function TabPhase1({ setActiveTab }) {
  return (
    <div>
      <div style={S.eyebrow}>CURRENT PHASE</div>
      <h1 style={{ ...S.h1, marginTop:12, marginBottom:20 }}>Phase 1: Awareness</h1>
      <p style={{ color:C.muted, fontSize:16, lineHeight:1.8, maxWidth:560, marginBottom:52, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>
        Before you can build structure, you need an honest picture of what is actually happening. This phase is entirely about seeing clearly.
      </p>
      <div style={{ ...S.eyebrow, marginBottom:20 }}>THIS WEEK</div>
      <div style={{ marginBottom:52 }}>
        {[
          "Open the Financial Reset Workbook and complete it fully.",
          "List every recurring financial obligation you currently carry.",
          "Review your last 30 days of spending without judgment.",
          "Complete the Weekly System Review to close the week.",
        ].map((step, i) => (
          <div key={i} style={{ display:"flex", gap:20, padding:"18px 0", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.goldSoft, border:`1px solid ${C.gold}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:C.gold, fontSize:13, fontFamily:"'Cormorant Garamond', serif" }}>0{i+1}</span>
            </div>
            <span style={{ color:C.text, fontSize:15, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.5 }}>{step}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setActiveTab("tools")} style={S.btnNavy}>BEGIN THIS PHASE</button>
    </div>
  );
}

/* ─────────── TAB: TOOLS ─────────── */

function TabTools({ data, update, t2Locked, t3Locked, t4Locked }) {
  return (
    <div>
      <div style={S.eyebrow}>PHASE 1 TOOLS</div>
      <h2 style={{ ...S.h2, marginTop:12, marginBottom:8 }}>Your Tools This Week</h2>
      <p style={{ color:C.muted, fontSize:14, marginBottom:40, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>Complete each tool in order. Each one unlocks the next.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="ep-g2">
        <ToolCard
          phase="PHASE 1 — TOOL 01" name="Financial Reset Workbook"
          desc="Identify where your reset begins and the key pressure points in your financial life."
          time="15 min" status="ready" completed={data.tool1_complete}
          onComplete={() => update("tool1_complete", true)}
        ><WorkbookForm data={data} update={update} /></ToolCard>

        <ToolCard
          phase="PHASE 1 — TOOL 02" name="Financial Reality Audit"
          desc="A structured look at your complete financial picture: income, expenses, debt, and obligations."
          time="20 min" status={t2Locked ? "locked" : "ready"} completed={data.tool2_complete}
          onComplete={() => update("tool2_complete", true)}
        ><AuditForm data={data} update={update} /></ToolCard>

        <ToolCard
          phase="PHASE 1 — TOOL 03" name="Spending Reflection"
          desc="An honest review of where your money went over the last 30 days and what patterns drove it."
          time="15 min" status={t3Locked ? "locked" : "ready"} completed={data.tool3_complete}
          onComplete={() => update("tool3_complete", true)}
        ><SpendingForm data={data} update={update} /></ToolCard>

        <ToolCard
          phase="PHASE 1 — TOOL 04" name="Weekly System Review"
          desc="A structured 10-minute check-in completed at the end of each week throughout your reset."
          time="10 min" status={t4Locked ? "locked" : "ready"} completed={data.tool4_complete}
          onComplete={() => update("tool4_complete", true)}
        ><WeeklyReviewForm data={data} update={update} /></ToolCard>
      </div>
    </div>
  );
}

/* ─────────── TAB: PROGRESS ─────────── */

function TabProgress({ tc, overallPct, structurePct, data }) {
  const consistencyPct = Math.min(tc * 25, 100);
  const milestones = [
    { label:"Reset started",                                done: true                },
    { label:"Completed Tool 01: Financial Reset Workbook",  done: !!data.tool1_complete },
    { label:"Completed Tool 02: Financial Reality Audit",   done: !!data.tool2_complete },
    { label:"Completed Tool 03: Spending Reflection",       done: !!data.tool3_complete },
    { label:"Completed Phase 1: Awareness",                 done: tc === 4            },
    { label:"Unlocked Phase 2: Stabilization",              done: false               },
  ];
  return (
    <div>
      <div style={S.eyebrow}>YOUR PROGRESS</div>
      <h2 style={{ ...S.h2, marginTop:12, marginBottom:52 }}>Reset Progress Overview</h2>

      <div style={{ display:"flex", gap:60, justifyContent:"center", marginBottom:64 }} className="ep-rings">
        <RingProgress pct={overallPct}     value={`${overallPct}%`}     label="Overall Reset"  />
        <RingProgress pct={structurePct}   value={`${structurePct}%`}   label="Structure Score" />
        <RingProgress pct={consistencyPct} value={`${consistencyPct}%`} label="Consistency"    />
      </div>

      <div style={{ marginBottom:52 }}>
        <div style={{ ...S.eyebrow, marginBottom:16 }}>WEEKLY ACTIVITY</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ width:42, height:42, borderRadius:8, background: i < tc ? C.gold : C.border, transition:"background 0.4s ease" }} />
          ))}
        </div>
        <div style={{ color:C.muted, fontSize:12, marginTop:10, fontFamily:"'DM Sans', sans-serif" }}>{tc} of 4 tools completed this phase</div>
      </div>

      <div style={{ ...S.eyebrow, marginBottom:16 }}>MILESTONES</div>
      {milestones.map((m, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background: m.done ? C.gold : C.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {m.done && <span style={{ color:"#fff", fontSize:12, lineHeight:1 }}>&#10003;</span>}
          </div>
          <span style={{ flex:1, color: m.done ? C.text : C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight: m.done ? 400 : 300 }}>{m.label}</span>
          {m.done && <span style={{ color:C.gold, fontSize:10, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>DONE</span>}
        </div>
      ))}
    </div>
  );
}

/* ─────────── TAB: ROADMAP ─────────── */

function TabRoadmap() {
  const phases = [
    { num:"01", name:"Awareness",     desc:"Seeing your financial reality clearly before building anything.",           active:true  },
    { num:"02", name:"Stabilization", desc:"Organizing everything into one structured system.",                        active:false },
    { num:"03", name:"Control",       desc:"Building consistent routines. Moving from reacting to directing.",         active:false },
    { num:"04", name:"Positioning",   desc:"Aligning your behavior with future goals and intentional growth.",         active:false },
    { num:"05", name:"Expansion",     desc:"Building long-term systems, ownership structures, and financial freedom.", active:false },
  ];
  return (
    <div>
      <div style={S.eyebrow}>YOUR JOURNEY</div>
      <h2 style={{ ...S.h2, marginTop:12, marginBottom:48 }}>Five-Phase Reset Roadmap</h2>
      <div style={{ display:"flex", flexDirection:"column" }}>
        {phases.map((phase, i) => (
          <div key={phase.num} style={{ display:"flex", gap:20, alignItems:"stretch" }}>
            {/* Timeline column */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:52, flexShrink:0 }}>
              <div style={{
                width:52, height:52, borderRadius:"50%", flexShrink:0,
                background: phase.active ? C.navy : C.surface,
                border: `2px solid ${phase.active ? C.navy : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow: phase.active ? "0 4px 16px rgba(26,39,68,0.18)" : C.shadow,
              }}>
                <span style={{ color: phase.active ? C.gold : C.muted, fontSize:15, fontFamily:"'Cormorant Garamond', serif", fontWeight:500 }}>{phase.num}</span>
              </div>
              {i < 4 && <div style={{ width:2, flex:1, minHeight:16, background: phase.active ? `linear-gradient(${C.gold}, ${C.border})` : C.border, opacity:0.5 }} />}
            </div>
            {/* Card */}
            <div style={{
              flex:1, background: phase.active ? C.navy : C.surface,
              border: `1px solid ${phase.active ? C.navy : C.border}`,
              borderLeft: `3px solid ${phase.active ? C.gold : C.border}`,
              borderRadius:12, padding:"20px 24px",
              marginBottom: i < 4 ? 16 : 0,
              boxShadow: phase.active ? "0 4px 20px rgba(26,39,68,0.12)" : C.shadow,
              opacity: phase.active ? 1 : 0.62,
              display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
            }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:20, color: phase.active ? "#fff" : C.text, marginBottom:4 }}>{phase.name}</div>
                <div style={{ color: phase.active ? "rgba(255,255,255,0.55)" : C.muted, fontSize:13, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{phase.desc}</div>
              </div>
              <span style={{
                background: phase.active ? "rgba(201,168,76,0.15)" : "transparent",
                color: phase.active ? C.gold : C.muted,
                border: `1px solid ${phase.active ? C.gold : C.border}`,
                fontSize:10, letterSpacing:2, padding:"5px 14px", borderRadius:100,
                fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap", flexShrink:0,
              }}>
                {phase.active ? "ACTIVE" : "LOCKED"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── TAB: ADVISORY ─────────── */

function TabAdvisory() {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:24, marginBottom:48 }}>
        <img
          src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/public/robert-brickey.png"
          alt="Robert Brickey"
          style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", border:`3px solid ${C.gold}`, flexShrink:0 }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:24, color:C.text, marginBottom:4 }}>Robert Brickey</div>
          <div style={{ color:C.muted, fontSize:12, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>FINANCIAL STRATEGIST, ETFM</div>
        </div>
      </div>

      <div style={{ borderLeft:`3px solid ${C.gold}`, padding:"4px 0 4px 28px", marginBottom:52, maxWidth:580 }}>
        <p style={{ color:C.text, fontSize:18, fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", lineHeight:1.9, margin:0, opacity:0.85 }}>
          This is about awareness. Structure. Consistency. Creating a system that supports your life instead of constantly reacting to it. Small actions repeated consistently create massive long-term change.
        </p>
      </div>

      <div style={{ ...S.eyebrow, marginBottom:20 }}>STRATEGIC GUIDANCE</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:52 }} className="ep-g2">
        {[
          { label:"STRATEGIC FOCUS",  text:"Complete all four Phase 1 tools before advancing. Quality matters more than speed." },
          { label:"PRIORITY ACTION",  text:"Open the Financial Reset Workbook now. It is your first tool and your starting point." },
          { label:"NEXT MILESTONE",   text:"Complete Tool 01 to unlock Tool 02 and begin building your reset progress." },
        ].map(({ label, text }) => (
          <div key={label} style={{ ...S.card, borderTop:`2px solid ${C.gold}` }}>
            <div style={{ color:C.gold, fontSize:10, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>{label}</div>
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 }}>{text}</p>
          </div>
        ))}
      </div>

      <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ ...S.btnNavy, display:"inline-block", textDecoration:"none", textAlign:"center" }}>
        BOOK A SESSION WITH ROBERT
      </a>
    </div>
  );
}

/* ─────────── SHARED UI ─────────── */

function MetricTile({ label, value, sub }) {
  return (
    <div style={{ ...S.card, borderTop:`2px solid ${C.gold}`, textAlign:"center", padding:"24px 20px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:34, color:C.text, lineHeight:1, marginBottom: sub ? 6 : 10 }}>{value}</div>
      {sub && <div style={{ color:C.gold, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif", marginBottom:6 }}>{sub}</div>}
      <div style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>{label.toUpperCase()}</div>
    </div>
  );
}

function PhasePath({ activeIndex }) {
  const phases = ["Awareness","Stabilization","Control","Positioning","Expansion"];
  return (
    <div style={{ position:"relative" }}>
      <div style={{ position:"absolute", top:21, left:"10%", right:"10%", height:1, background:C.border, zIndex:0 }} />
      <div style={{ display:"flex", justifyContent:"space-between", position:"relative", zIndex:1 }}>
        {phases.map((phase, i) => (
          <div key={phase} style={{ textAlign:"center", width:"20%" }}>
            <div style={{
              width:42, height:42, borderRadius:"50%",
              background: i < activeIndex ? C.gold : i === activeIndex ? C.navy : C.surface,
              border: `2px solid ${i < activeIndex ? C.gold : i === activeIndex ? C.navy : C.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 12px",
              color: i <= activeIndex ? "#fff" : C.muted,
              fontSize:14, fontFamily:"'Cormorant Garamond', serif",
              boxShadow: i === activeIndex ? "0 4px 14px rgba(26,39,68,0.18)" : "none",
            }}>0{i+1}</div>
            <div style={{ fontSize:12, color: i === activeIndex ? C.text : C.muted, fontFamily:"'DM Sans', sans-serif", fontWeight: i === activeIndex ? 500 : 300 }}>{phase}</div>
            {i === activeIndex && <div style={{ fontSize:10, color:C.gold, letterSpacing:2, fontFamily:"'DM Sans', sans-serif", marginTop:5 }}>ACTIVE</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RingProgress({ pct, value, label }) {
  const r      = 52;
  const circ   = 2 * Math.PI * r;
  const safe   = Math.min(Math.max(pct, 0), 100);
  const offset = circ - (safe / 100) * circ;
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={136} height={136} viewBox="0 0 136 136">
        <circle cx={68} cy={68} r={r} fill="none" stroke={C.border} strokeWidth={8} />
        <circle cx={68} cy={68} r={r} fill="none" stroke={C.gold}   strokeWidth={8}
          strokeDasharray={String(circ)} strokeDashoffset={String(offset)}
          strokeLinecap="round" transform="rotate(-90 68 68)"
          style={{ transition:"stroke-dashoffset 1s ease" }}
        />
        <text x="68" y="68" textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:26, fill:C.text }}>
          {value}
        </text>
      </svg>
      <div style={{ color:C.muted, fontSize:11, letterSpacing:3, fontFamily:"'DM Sans', sans-serif", marginTop:8 }}>{label.toUpperCase()}</div>
    </div>
  );
}

function ToolCard({ phase, name, desc, time, status, completed, onComplete, children }) {
  const [open, setOpen] = useState(false);
  const locked = status === "locked";
  return (
    <div style={{
      ...S.card,
      borderLeft:`3px solid ${completed ? "#16a34a" : locked ? C.border : C.gold}`,
      opacity: locked ? 0.5 : 1,
    }}>
      <div style={{ color:C.gold, fontSize:10, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>{phase}</div>
      <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:21, color: completed ? "#16a34a" : C.text, marginBottom:8, lineHeight:1.2 }}>{name}</div>
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif", fontWeight:300, marginBottom:16 }}>{desc}</p>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
        <span style={{ background:C.goldSoft, color:C.gold, fontSize:11, padding:"4px 12px", borderRadius:100, fontFamily:"'DM Sans', sans-serif", flexShrink:0 }}>{time}</span>
        {completed ? (
          <span style={{ color:"#16a34a", fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>COMPLETED</span>
        ) : locked ? (
          <span style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>LOCKED</span>
        ) : (
          <button style={S.btnSmall} onClick={() => setOpen(v => !v)}>{open ? "CLOSE" : "OPEN TOOL"}</button>
        )}
      </div>
      {open && !locked && !completed && (
        <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          {children}
          <button style={{ ...S.btnNavy, width:"100%", marginTop:20 }} onClick={() => { onComplete(); setOpen(false); }}>
            MARK AS COMPLETE
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────── TOOL FORMS ─────────── */

function Field({ label, id, data, update, multiline = false, placeholder = "" }) {
  const val = data[id] || "";
  const props = { value:val, onChange:(e) => update(id, e.target.value), placeholder };
  return (
    <div style={{ marginBottom:16 }}>
      <label style={S.fieldLabel}>{label}</label>
      {multiline ? <textarea {...props} rows={3} style={S.textarea} /> : <input {...props} style={S.input} />}
    </div>
  );
}

function WorkbookForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Complete each field honestly. Responses save automatically.</p>
      <Field label="Today's date"                                                        id="wb_date"        data={data} update={update} placeholder="MM/DD/YYYY" />
      <Field label="In one sentence, how would you describe your financial situation?"   id="wb_situation"   data={data} update={update} multiline placeholder="Be honest. This is for your eyes only." />
      <Field label="Financial stress level (1 to 10)"                                   id="wb_stress"      data={data} update={update} placeholder="1 = none, 10 = overwhelming" />
      <Field label="What does that stress feel like day to day?"                         id="wb_stress_desc" data={data} update={update} multiline />
      <Field label="Priority Area 1: Biggest financial pressure right now"               id="wb_priority1"   data={data} update={update} multiline />
      <Field label="Priority Area 2"                                                     id="wb_priority2"   data={data} update={update} multiline />
      <Field label="Priority Area 3"                                                     id="wb_priority3"   data={data} update={update} multiline />
      <Field label="In 90 days, what would be different if your reset is working?"       id="wb_90days"      data={data} update={update} multiline />
      <Field label="The one financial outcome that would create the most relief"         id="wb_relief"      data={data} update={update} multiline />
      <Field label="Your name (reset commitment)"                                        id="wb_name"        data={data} update={update} placeholder="Sign your name to commit to this process" />
    </div>
  );
}

function AuditForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>A complete look at your financial picture. Estimates are fine.</p>
      <Field label="Approximate monthly income (after tax)"                        id="audit_income"      data={data} update={update} placeholder="$" />
      <Field label="Total monthly fixed expenses (rent, car, insurance)"           id="audit_fixed"       data={data} update={update} placeholder="$" />
      <Field label="Total monthly variable expenses (groceries, dining, etc.)"    id="audit_variable"    data={data} update={update} placeholder="$" />
      <Field label="Emergency fund status"                                          id="audit_emergency"   data={data} update={update} placeholder="Yes / No / Amount" />
      <Field label="Debt outside of a mortgage, if any"                            id="audit_debt"        data={data} update={update} placeholder="Yes / No / Amount" />
      <Field label="When did you last review your full financial picture?"          id="audit_last_review" data={data} update={update} placeholder="Month and year" />
      <Field label="Your three most stressful financial obligations right now"     id="audit_obligations" data={data} update={update} multiline />
      <Field label="One financial habit you know is costing you money"             id="audit_habit"       data={data} update={update} multiline />
    </div>
  );
}

function SpendingForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Review your last 30 days honestly. This is not about judgment.</p>
      <Field label="Where did most of your money go last month?"                              id="spend_where"      data={data} update={update} multiline />
      <Field label="Purchases you regret or that felt reactive"                              id="spend_regret"     data={data} update={update} multiline />
      <Field label="What triggers your emotional spending?"                                   id="spend_triggers"   data={data} update={update} multiline />
      <Field label="A recurring expense you could eliminate without major impact"            id="spend_eliminate"  data={data} update={update} multiline />
      <Field label="What one spending pattern, if changed, would make the biggest difference?" id="spend_pattern"  data={data} update={update} multiline />
      <Field label="What does financial discipline feel like to you right now?"               id="spend_discipline" data={data} update={update} multiline />
    </div>
  );
}

function WeeklyReviewForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Your 10-minute weekly anchor. Complete on the same day each week.</p>
      <Field label="Week of"                                                        id="wr_week"       data={data} update={update} placeholder="MM/DD/YYYY" />
      <Field label="What went well financially this week?"                          id="wr_went_well"  data={data} update={update} multiline />
      <Field label="What created financial stress or friction this week?"           id="wr_friction"   data={data} update={update} multiline />
      <Field label="Did you follow your weekly rhythm? What did you do or miss?"   id="wr_rhythm"     data={data} update={update} multiline />
      <Field label="Top financial priority for next week"                           id="wr_priority"   data={data} update={update} multiline />
      <Field label="Financial consistency rating this week (1 to 10)"              id="wr_rating"     data={data} update={update} placeholder="1 = no consistency, 10 = fully on track" />
      <Field label="One sentence commitment for next week"                          id="wr_commitment" data={data} update={update} placeholder="I will..." />
    </div>
  );
}

/* ─────────── STYLES ─────────── */

const S = {
  nav:     { position:"fixed", top:0, left:0, right:0, zIndex:100, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 },
  navBtn:  { background:"none", border:"none", cursor:"pointer", padding:"0 14px", height:60, fontFamily:"'DM Sans', sans-serif", fontSize:13, letterSpacing:0.3, transition:"all 0.15s ease", outline:"none" },
  avatar:  { width:34, height:34, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold, fontSize:14, fontFamily:"'Cormorant Garamond', serif", flexShrink:0 },
  content: { padding:"52px 48px", maxWidth:1100, margin:"0 auto" },
  h1:      { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:52, fontWeight:300, color:C.text, margin:0, lineHeight:1.1 },
  h2:      { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:40, fontWeight:300, color:C.text, margin:0, lineHeight:1.15 },
  sub:     { color:C.muted, fontSize:17, margin:"10px 0 0", fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  eyebrow: { color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif" },
  card:    { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:28, boxShadow:C.shadow },
  nextActionCard: { background:C.navy, borderRadius:12, padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, boxShadow:"0 4px 24px rgba(26,39,68,0.12)", marginTop:0 },
  btnGold: { background:C.gold, color:C.navy, border:"none", padding:"13px 28px", borderRadius:8, fontSize:11, fontWeight:700, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", flexShrink:0, whiteSpace:"nowrap" },
  btnNavy: { background:C.navy, color:"#fff", border:"none", padding:"14px 32px", borderRadius:8, fontSize:11, fontWeight:500, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  btnSmall:{ background:C.navy, color:"#fff", border:"none", padding:"8px 18px", borderRadius:6, fontSize:11, fontWeight:500, letterSpacing:1.5, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  fieldLabel: { display:"block", color:C.muted, fontSize:11, letterSpacing:2, marginBottom:7, fontFamily:"'DM Sans', sans-serif" },
  input:   { width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", borderRadius:6, boxSizing:"border-box" },
  textarea:{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", resize:"vertical", borderRadius:6, boxSizing:"border-box" },
  formIntro:{ color:C.muted, fontSize:13, lineHeight:1.8, marginBottom:20, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" },
};
