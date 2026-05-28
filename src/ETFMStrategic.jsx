import { useState, useEffect } from "react";

const STORAGE_KEY   = "etfm_strategic_data";
const CALENDLY_PRE  = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";
const CALENDLY_POST = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const loadData = () => {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {}; }
  catch { return {}; }
};
const saveData = (d) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
};

const C = {
  bg:           "#FAF8F4",
  surface:      "#FFFFFF",
  gold:         "#c9a84c",
  navy:         "#1a2744",
  text:         "#1a1a2e",
  muted:        "#6b7280",
  border:       "#ede9e3",
  shadow:       "0 2px 16px rgba(0,0,0,0.06)",
  goldSoft:     "rgba(201,168,76,0.08)",
  successText:  "#16a34a",
  successBg:    "#f0fdf4",
  successBorder:"#bbf7d0",
};

const TABS = [
  { id:"dashboard", label:"Dashboard" },
  { id:"intake",    label:"Intake"    },
  { id:"framework", label:"Framework" },
  { id:"sessions",  label:"Sessions"  },
  { id:"roadmap",   label:"Roadmap"   },
  { id:"advisory",  label:"Advisory"  },
];

const INTAKE_SECTIONS = [
  {
    id:"reality", label:"FINANCIAL REALITY", num:"01",
    desc:"Your current financial picture. Estimates are acceptable.",
    questions:[
      { id:"r1", label:"Approximate monthly take-home income", placeholder:"$" },
      { id:"r2", label:"Total monthly fixed expenses (rent, mortgage, car, insurance)", placeholder:"$" },
      { id:"r3", label:"Total monthly variable expenses (groceries, dining, subscriptions)", placeholder:"$" },
      { id:"r4", label:"Total debt outside of a mortgage, if any", placeholder:"None / approximate amount" },
      { id:"r5", label:"Emergency fund status", placeholder:"None / amount / months of coverage" },
      { id:"r6", label:"When did you last have a clear, complete picture of your finances?", placeholder:"Month and year" },
    ]
  },
  {
    id:"stress", label:"STRESS AND PRESSURE POINTS", num:"02",
    desc:"Understanding pressure points allows your strategist to address them directly in Session 1.",
    questions:[
      { id:"s1", label:"Current financial stress level (1 to 10)", placeholder:"1 = minimal, 10 = overwhelming" },
      { id:"s2", label:"What is creating the most financial pressure in your life right now?", multiline:true },
      { id:"s3", label:"What financial problem have you been avoiding or delaying?", multiline:true },
      { id:"s4", label:"Was there a specific event that contributed to your current situation?", multiline:true, placeholder:"Job loss, divorce, unexpected expense, income change..." },
      { id:"s5", label:"What does financial stress feel like in your day-to-day life?", multiline:true },
      { id:"s6", label:"How long have you been carrying this level of financial stress?", placeholder:"Weeks / months / years" },
    ]
  },
  {
    id:"behavior", label:"SPENDING AND BEHAVIOR", num:"03",
    desc:"Behavioral patterns are the root of most financial outcomes. Answer honestly.",
    questions:[
      { id:"b1", label:"How would you describe your spending?", placeholder:"Intentional / reactive / avoidant / impulsive" },
      { id:"b2", label:"What is your most costly recurring financial habit?", multiline:true },
      { id:"b3", label:"Do you currently track your spending? If yes, how?", multiline:true },
      { id:"b4", label:"What emotional triggers drive your financial decisions?", multiline:true, placeholder:"Stress, boredom, social pressure, fear..." },
      { id:"b5", label:"Have you created a budget or plan before and abandoned it? What happened?", multiline:true },
    ]
  },
  {
    id:"income", label:"INCOME AND STABILITY", num:"04",
    desc:"Income consistency directly affects what financial systems are available to you.",
    questions:[
      { id:"i1", label:"Is your income consistent month to month or variable?", placeholder:"Consistent / variable / seasonal" },
      { id:"i2", label:"Do you have more than one income source?", placeholder:"Yes / No / Describe" },
      { id:"i3", label:"What is your biggest income-related concern right now?", multiline:true },
      { id:"i4", label:"Have you experienced a significant income change in the last 12 months?", multiline:true },
      { id:"i5", label:"What would a 20% increase in monthly income change about your situation?", multiline:true },
    ]
  },
  {
    id:"goals", label:"GOALS AND PRIORITIES", num:"05",
    desc:"Your goals inform the entire structure of your Strategic Reset.",
    questions:[
      { id:"g1", label:"What does financial freedom mean to you specifically?", multiline:true },
      { id:"g2", label:"Most important financial goal in the next 12 months", multiline:true },
      { id:"g3", label:"What financial outcome would create the most immediate relief?", multiline:true },
      { id:"g4", label:"What does a financially stable life look like for you in 3 to 5 years?", multiline:true },
      { id:"g5", label:"What financial milestone have you been unable to reach, and what has stopped you?", multiline:true },
      { id:"g6", label:"What would you do differently if you had complete financial clarity?", multiline:true },
    ]
  },
  {
    id:"systems", label:"SYSTEMS AND STRUCTURE", num:"06",
    desc:"Understanding what you already have helps identify the specific gaps to close.",
    questions:[
      { id:"sy1", label:"Do you have any financial systems currently in place?", multiline:true, placeholder:"Automatic savings, bill tracking, budget, investment accounts..." },
      { id:"sy2", label:"How do you currently manage bills and due dates?", multiline:true },
      { id:"sy3", label:"Do you have a savings plan? If yes, describe it.", multiline:true },
      { id:"sy4", label:"How do you typically make financial decisions?", placeholder:"Planned / reactive / intuitive / emotional" },
      { id:"sy5", label:"What financial system, if it existed, would make the biggest difference right now?", multiline:true },
    ]
  },
  {
    id:"context", label:"PARTNERSHIP CONTEXT", num:"07",
    desc:"These final questions help your strategist prepare specifically for Session 1.",
    questions:[
      { id:"c1", label:"What made you decide to invest in the Strategic Reset Partnership?", multiline:true },
      { id:"c2", label:"What do you most want to walk away from these sessions with?", multiline:true },
      { id:"c3", label:"What have you tried before that has not worked?", multiline:true },
      { id:"c4", label:"What is your biggest concern about this process?", multiline:true },
      { id:"c5", label:"Is there anything important about your financial situation you have not yet shared?", multiline:true },
    ]
  },
];

const ALL_IDS = INTAKE_SECTIONS.flatMap(s => s.questions.map(q => q.id));
const TOTAL_Q  = ALL_IDS.length;

export default function ETFMStrategic() {
  const [data, setData]         = useState(loadData);
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!document.getElementById("es-fonts")) {
      const link = document.createElement("link");
      link.id = "es-fonts"; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("es-css")) {
      const el = document.createElement("style");
      el.id = "es-css";
      el.textContent = `
        @keyframes esIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .es-fade { animation: esIn 0.22s ease both; }
        *,*::before,*::after { box-sizing:border-box; }
        @media(max-width:768px){
          .es-g2  { grid-template-columns:1fr!important; }
          .es-g3  { grid-template-columns:1fr!important; }
          .es-g4  { grid-template-columns:1fr 1fr!important; }
          .es-mat { grid-template-columns:1fr 1fr!important; }
          .es-nav { padding:0 16px!important; }
          .es-cnt { padding:32px 20px!important; }
          .es-nac { flex-direction:column!important; align-items:flex-start!important; gap:16px!important; }
          .es-rob { grid-template-columns:1fr!important; gap:24px!important; }
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

  const answeredCount   = ALL_IDS.filter(id => (data[id] || "").trim()).length;
  const progressPct     = Math.round((answeredCount / TOTAL_Q) * 100);
  const intakeComplete  = data.intake_submitted;
  const call1Complete   = data.call1_complete;
  const call2Complete   = data.call2_complete;
  const frameworkStatus = call1Complete ? "Unlocked" : "Locked";
  const sessionStatus   = call2Complete ? "Both complete" : call1Complete ? "Session 1 done" : "Not started";

  const supportDaysRemaining = (() => {
    if (!data.support_start) return "Not started";
    const start = new Date(data.support_start);
    if (isNaN(start)) return "Not started";
    const end = new Date(start.getTime() + 60 * 24 * 60 * 60 * 1000);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : "Complete";
  })();

  const nextAction = call2Complete
    ? "Review your Strategic Framework and 90-Day Roadmap"
    : call1Complete
      ? "Book and complete Session 2"
      : intakeComplete
        ? "Book and complete Session 1"
        : progressPct === 100
          ? "Submit your Intake Form"
          : "Complete your Strategic Intake Form.";

  const nextTabAction = call2Complete ? "framework" : call1Complete ? "sessions" : intakeComplete ? "sessions" : "intake";

  const processSteps = [
    { label:"Complete the Strategic Intake Form",       done:!!intakeComplete },
    { label:"Book and attend Session 1",                done:!!call1Complete },
    { label:"Receive your Matrix Score and Analysis",   done:!!(call1Complete && data.structural_analysis) },
    { label:"Receive your Strategic Framework",         done:!!(call1Complete && data.fw_priority) },
    { label:"Book and attend Session 2",                done:!!call2Complete },
    { label:"Begin your 60-Day Priority Email Support", done:!!data.support_start },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans', Inter, sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>

      {/* NAV */}
      <nav style={S.nav} className="es-nav">
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
          <div style={S.avatar}>R</div>
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ paddingTop:60 }}>
        <div key={activeTab} className="es-fade es-cnt" style={S.content}>
          {activeTab === "dashboard" && <TabDashboard sessionStatus={sessionStatus} progressPct={progressPct} frameworkStatus={frameworkStatus} supportDaysRemaining={supportDaysRemaining} nextAction={nextAction} nextTabAction={nextTabAction} setActiveTab={setActiveTab} processSteps={processSteps} intakeComplete={intakeComplete} call1Complete={call1Complete} />}
          {activeTab === "intake"    && <TabIntake data={data} update={update} answeredCount={answeredCount} progressPct={progressPct} intakeComplete={intakeComplete} call1Complete={call1Complete} />}
          {activeTab === "framework" && <TabFramework data={data} update={update} call1Complete={call1Complete} />}
          {activeTab === "sessions"  && <TabSessions data={data} update={update} call1Complete={call1Complete} call2Complete={call2Complete} />}
          {activeTab === "roadmap"   && <TabRoadmap data={data} update={update} call1Complete={call1Complete} />}
          {activeTab === "advisory"  && <TabAdvisory data={data} update={update} call1Complete={call1Complete} />}
        </div>
      </main>
    </div>
  );
}

/* ─────────── TAB: DASHBOARD ─────────── */

function TabDashboard({ sessionStatus, progressPct, frameworkStatus, supportDaysRemaining, nextAction, nextTabAction, setActiveTab, processSteps, intakeComplete, call1Complete }) {
  return (
    <div>
      <div style={{ marginBottom:48 }}>
        <h1 style={S.h1}>WELCOME TO YOUR STRATEGIC RESET</h1>
        <p style={S.sub}>This is not coaching. This is strategic architecture designed to help you rebuild your financial operating system with intention and structure.</p>
      </div>

      {/* METRIC TILES */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:52 }} className="es-g4">
        <MetricTile label="Session Status"         value={sessionStatus} />
        <MetricTile label="Intake Progress"        value={`${progressPct}%`} />
        <MetricTile label="Framework Status"       value={frameworkStatus} />
        <MetricTile label="Support Days Remaining" value={supportDaysRemaining} />
      </div>

      {/* PROCESS STEPS */}
      <div style={{ marginBottom:52 }}>
        <div style={{ ...S.eyebrow, marginBottom:20 }}>YOUR RESET PROCESS</div>
        {processSteps.map((step, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 0", borderBottom: i < processSteps.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background: step.done ? C.gold : C.surface, border:`2px solid ${step.done ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {step.done
                ? <span style={{ color:"#fff", fontSize:12, lineHeight:1 }}>&#10003;</span>
                : <span style={{ color:C.muted, fontSize:11, fontFamily:"'Cormorant Garamond', serif" }}>0{i+1}</span>
              }
            </div>
            <span style={{ color: step.done ? C.text : C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight: step.done ? 400 : 300 }}>{step.label}</span>
          </div>
        ))}
      </div>

      {/* NEXT ACTION CARD */}
      <div style={S.nextActionCard} className="es-nac">
        <div>
          <div style={{ color:C.gold, fontSize:10, letterSpacing:4, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>NEXT ACTION</div>
          <div style={{ color:"#fff", fontSize:22, fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:400, lineHeight:1.3 }}>{nextAction}</div>
        </div>
        <button onClick={() => setActiveTab(nextTabAction)} style={S.btnGold}>BEGIN NOW</button>
      </div>

      {/* ROBERT BRICKEY — YOUR STRATEGIC PARTNER */}
      <div className="es-rob" style={{ marginTop:68, background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${C.gold}`, borderRadius:12, padding:"40px", boxShadow:C.shadow, display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
        <img
          src="/robert-brickey.jpg"
          alt="Robert Brickey"
          style={{ width:"100%", borderRadius:12, objectFit:"cover", objectPosition:"top center", maxHeight:340, boxShadow:"0 4px 20px rgba(0,0,0,0.09)", display:"block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div>
          <div style={{ ...S.eyebrow, marginBottom:20 }}>YOUR STRATEGIC PARTNER</div>
          <p style={{ color:C.navy, fontSize:16, fontFamily:"'Cormorant Garamond', Georgia, serif", lineHeight:1.9, marginBottom:28, fontWeight:400 }}>
            Every session is built around your specific financial reality. The goal is not generic advice. It is a personalized strategic framework designed around your situation, your patterns, and your goals.
          </p>
          <p style={{ color:C.muted, fontSize:14, fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", margin:0 }}>Robert Brickey — Financial Strategist, ETFM</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────── TAB: INTAKE ─────────── */

function TabIntake({ data, update, answeredCount, progressPct, intakeComplete, call1Complete }) {
  const [activeIntake, setActiveIntake] = useState(null);
  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ ...S.eyebrow, marginBottom:10 }}>STRATEGIC INTAKE</div>
        <p style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:600 }}>Your intake responses shape every element of your personalized strategic framework.</p>
      </div>
      <h2 style={{ ...S.h2, marginTop:0, marginBottom:8 }}>Strategic Intake Form</h2>
      <p style={{ color:C.muted, fontSize:14, marginBottom:36, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>38 questions across 7 sections. Answer as honestly as you can — accuracy matters more than perfection.</p>

      {/* Progress bar */}
      <div style={{ ...S.card, marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={S.eyebrow}>COMPLETION</span>
          <span style={{ color:C.muted, fontSize:12, fontFamily:"'DM Sans', sans-serif" }}>{answeredCount} of {TOTAL_Q} answered</span>
        </div>
        <div style={{ background:"#f0ede8", height:4, borderRadius:2 }}>
          <div style={{ background:C.gold, height:4, borderRadius:2, width:`${progressPct}%`, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ textAlign:"right", marginTop:6, color:C.gold, fontSize:13, fontFamily:"'Cormorant Garamond', Georgia, serif" }}>{progressPct}%</div>
      </div>

      {/* Intake accordion */}
      {INTAKE_SECTIONS.map(sec => {
        const open    = activeIntake === sec.id;
        const secDone = sec.questions.filter(q => (data[q.id] || "").trim()).length;
        const complete = secDone === sec.questions.length;
        return (
          <div key={sec.id} style={{ background:C.surface, border:`1px solid ${open ? C.gold : C.border}`, borderRadius:12, marginBottom:8, boxShadow:C.shadow, overflow:"hidden" }}>
            <button style={{ width:"100%", background:"none", border:"none", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }} onClick={() => setActiveIntake(open ? null : sec.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ color: complete ? C.successText : C.gold, fontSize:18, fontFamily:"'Cormorant Garamond', serif", minWidth:30 }}>{sec.num}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ color:C.text, fontSize:13, letterSpacing:1.5, fontFamily:"'DM Sans', sans-serif" }}>{sec.label}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:2, fontFamily:"'DM Sans', sans-serif" }}>{secDone} / {sec.questions.length} answered</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {complete && <span style={{ background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:12, padding:"2px 9px", borderRadius:3 }}>&#10003;</span>}
                <span style={{ color:C.muted, fontSize:11 }}>{open ? "▲" : "▼"}</span>
              </div>
            </button>
            {open && (
              <div style={{ padding:"4px 24px 24px", borderTop:`1px solid ${C.border}` }}>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:20, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" }}>{sec.desc}</p>
                {sec.questions.map(q => (
                  <div key={q.id} style={{ marginBottom:18 }}>
                    <label style={S.fieldLabel}>{q.label}</label>
                    {q.multiline
                      ? <textarea value={data[q.id] || ""} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder || ""} rows={3} style={S.textarea} />
                      : <input   value={data[q.id] || ""} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder || ""} style={S.input} />
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {progressPct === 100 && !intakeComplete && (
        <button style={{ ...S.btnNavy, marginTop:20, width:"100%", display:"block" }} onClick={() => update("intake_submitted", true)}>
          SUBMIT INTAKE FORM
        </button>
      )}
      {intakeComplete && (
        <div style={{ background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:13, padding:"12px 18px", borderRadius:8, marginTop:16, fontFamily:"'DM Sans', sans-serif" }}>&#10003; Intake form submitted. Robert will review your responses before Session 1.</div>
      )}
      {intakeComplete && (
        <div style={{ ...S.card, marginTop:20, borderTop:`2px solid ${C.gold}` }}>
          <div style={{ ...S.eyebrow, marginBottom:12 }}>SESSION 1 STATUS</div>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, margin:"0 0 16px", fontFamily:"'DM Sans', sans-serif" }}>Once Session 1 is complete, mark it below to unlock your personalized materials.</p>
          {call1Complete
            ? <div style={{ background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:13, padding:"12px 18px", borderRadius:8, fontFamily:"'DM Sans', sans-serif" }}>&#10003; Session 1 complete. Your personalized materials are now unlocked.</div>
            : <button style={S.btnNavy} onClick={() => update("call1_complete", true)}>MARK SESSION 1 COMPLETE</button>
          }
        </div>
      )}
    </div>
  );
}

/* ─────────── TAB: FRAMEWORK ─────────── */

function TabFramework({ data, update, call1Complete }) {
  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ ...S.eyebrow, marginBottom:10 }}>YOUR STRATEGIC FRAMEWORK</div>
        <p style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:600 }}>Your personalized financial framework is built during your strategy session and delivered here.</p>
      </div>
      <h2 style={{ ...S.h2, marginTop:0, marginBottom:48 }}>Personalized Strategic Framework</h2>

      {/* Matrix Score */}
      <div style={{ ...S.eyebrow, marginBottom:16 }}>MATRIX SCORE AND STRUCTURAL ANALYSIS</div>
      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }} className="es-mat">
          {[
            { key:"sc_awareness",  name:"Awareness",           desc:"How clearly you see where your money goes." },
            { key:"sc_pattern",    name:"Money Pattern",       desc:"How consistently you manage income and expenses." },
            { key:"sc_stress",     name:"Stress Response",     desc:"How you respond when financial pressure builds." },
            { key:"sc_structure",  name:"Financial Structure", desc:"The systems and habits you have in place." },
            { key:"sc_readiness",  name:"System Readiness",    desc:"Your ability to build and follow a financial plan." },
          ].map(comp => (
            <div key={comp.key} style={S.card}>
              <div style={{ color:C.gold, fontSize:11, letterSpacing:2, marginBottom:4, fontFamily:"'DM Sans', sans-serif" }}>{comp.name}</div>
              <div style={{ color:C.muted, fontSize:12, lineHeight:1.5, marginBottom:10, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{comp.desc}</div>
              <PersonalizedField label={comp.name} id={comp.key} data={data} update={update} unlocked={call1Complete} singleLine displayAs="score" />
            </div>
          ))}
        </div>
        <div style={{ ...S.card, marginBottom:48 }}>
          <PersonalizedField label="STRUCTURAL ANALYSIS" id="structural_analysis" data={data} update={update} unlocked={call1Complete} rows={6} pendingText="Your structural analysis will appear here after Session 1." />
        </div>
      </LockedSection>

      {/* Strategic Framework */}
      <div style={{ ...S.eyebrow, marginBottom:16, marginTop:8 }}>STRATEGIC FRAMEWORK</div>
      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:48 }} className="es-g2">
          {[
            { id:"fw_priority",  label:"PRIMARY STRATEGIC PRIORITY",   pendingText:"The single most important financial move for you right now." },
            { id:"fw_structure", label:"STRUCTURAL FOUNDATION",         pendingText:"The core structure your finances will be built on." },
            { id:"fw_behavior",  label:"BEHAVIORAL PROTOCOL",           pendingText:"Specific behavioral guidelines based on your money patterns." },
            { id:"fw_income",    label:"INCOME AND STABILITY STRATEGY", pendingText:"A plan for protecting or stabilizing your income." },
            { id:"fw_debt",      label:"DEBT AND OBLIGATION FRAMEWORK", pendingText:"A clear strategy for handling existing debt and obligations." },
            { id:"fw_build",     label:"WEALTH BUILDING PATHWAY",       pendingText:"The long-term path forward based on your timeline and goals." },
          ].map(f => (
            <div key={f.id} style={S.card}>
              <PersonalizedField label={f.label} id={f.id} data={data} update={update} unlocked={call1Complete} rows={4} pendingText={f.pendingText} />
            </div>
          ))}
        </div>
      </LockedSection>

      {/* Decision Rules */}
      <div style={{ ...S.eyebrow, marginBottom:16, marginTop:8 }}>DECISION RULES AND FINANCIAL POLICY</div>
      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        {[
          { id:"rule_spending",  label:"SPENDING RULE",      pendingText:"Your personal discretionary spending guideline." },
          { id:"rule_saving",    label:"SAVING RULE",         pendingText:"The saving rate or method that works for your situation." },
          { id:"rule_debt",      label:"DEBT RULE",           pendingText:"How you will handle debt repayment — which debts, in what order." },
          { id:"rule_income",    label:"INCOME RULE",         pendingText:"How you treat and allocate income when it arrives." },
          { id:"rule_emergency", label:"EMERGENCY FUND RULE", pendingText:"Your target emergency fund amount and the plan to build it." },
          { id:"rule_invest",    label:"INVESTMENT RULE",     pendingText:"" },
        ].map(r => (
          <div key={r.id} style={{ ...S.card, marginBottom:8 }}>
            <PersonalizedField label={r.label} id={r.id} data={data} update={update} unlocked={call1Complete} rows={2} pendingText={r.pendingText} />
          </div>
        ))}
        <div style={{ ...S.card, marginTop:8 }}>
          <PersonalizedField label="ADDITIONAL FINANCIAL POLICIES" id="rule_additional" data={data} update={update} unlocked={call1Complete} rows={4} />
        </div>
      </LockedSection>
    </div>
  );
}

/* ─────────── TAB: SESSIONS ─────────── */

function TabSessions({ data, update, call1Complete, call2Complete }) {
  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ ...S.eyebrow, marginBottom:10 }}>YOUR SESSIONS</div>
        <p style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:600 }}>Two private strategy sessions with Robert. Your pre-session call builds the plan. Your post-session call reviews it.</p>
      </div>
      <h2 style={{ ...S.h2, marginTop:0, marginBottom:40 }}>Session Booking</h2>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }} className="es-g2">
        {/* Session 1 */}
        <div style={{ ...S.card, borderTop:`2px solid ${C.gold}` }}>
          <div style={{ ...S.eyebrow, marginBottom:12 }}>SESSION 1 OF 2</div>
          <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:20, color:C.text, fontWeight:400, margin:"0 0 10px" }}>Strategic Reality Session</div>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, marginBottom:16 }}>Reviews your intake, identifies high-leverage pressure points, and begins building your Strategic Framework.</p>
          {[["DURATION","30 minutes"],["FORMAT","Private video call"],["REQUIRES","Intake form completed"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>{k}</span>
              <span style={{ color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            {call1Complete
              ? <div style={S.successBadge}>&#10003; Session 1 complete</div>
              : <a href={CALENDLY_PRE} target="_blank" rel="noopener noreferrer" style={{ ...S.btnNavy, display:"block", textAlign:"center", textDecoration:"none" }}>BOOK SESSION 1</a>
            }
          </div>
        </div>

        {/* Session 2 */}
        <div style={{ ...S.card, borderTop:`2px solid ${call1Complete ? C.gold : C.border}`, opacity: call1Complete ? 1 : 0.55 }}>
          <div style={{ ...S.eyebrow, marginBottom:12 }}>SESSION 2 OF 2</div>
          <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:20, color:C.text, fontWeight:400, margin:"0 0 10px" }}>Strategic Implementation Session</div>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, marginBottom:16 }}>Reviews your 90-Day Roadmap, confirms your Decision Rules, and closes with your complete Strategic Operating Framework.</p>
          {[["DURATION","30 minutes"],["FORMAT","Private video call"],["REQUIRES","Session 1 complete"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>{k}</span>
              <span style={{ color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            {call2Complete
              ? <div style={S.successBadge}>&#10003; Session 2 complete</div>
              : call1Complete
                ? <a href={CALENDLY_POST} target="_blank" rel="noopener noreferrer" style={{ ...S.btnNavy, display:"block", textAlign:"center", textDecoration:"none" }}>BOOK SESSION 2</a>
                : <div style={{ background:"#f9f8f6", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, letterSpacing:2, padding:"13px 18px", textAlign:"center", borderRadius:8, fontFamily:"'DM Sans', sans-serif" }}>UNLOCKS AFTER SESSION 1</div>
            }
          </div>
        </div>
      </div>

      {call1Complete && !call2Complete && (
        <button style={{ ...S.btnNavy, marginBottom:52 }} onClick={() => update("call2_complete", true)}>MARK SESSION 2 COMPLETE</button>
      )}
      {call2Complete && <div style={{ ...S.successBadge, marginBottom:52 }}>&#10003; Both sessions complete</div>}

      {/* Session Notes */}
      <div style={{ ...S.eyebrow, marginBottom:20 }}>SESSION NOTES</div>
      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }} className="es-g2">
          <div style={S.card}>
            <div style={{ ...S.eyebrow, marginBottom:12 }}>SESSION 1 NOTES</div>
            {data.session1_date && <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif", margin:"0 0 14px" }}>{data.session1_date}</div>}
            <PersonalizedField label="SESSION 1 NOTES" id="session1_notes" data={data} update={update} unlocked={call1Complete} rows={8} hideLabel />
            <div style={{ marginTop:14 }}>
              <label style={S.fieldLabel}>SESSION DATE</label>
              <input value={data.session1_date || ""} onChange={e => update("session1_date", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
            </div>
          </div>
          <div style={{ ...S.card, opacity: call2Complete ? 1 : 0.55 }}>
            <div style={{ ...S.eyebrow, marginBottom:12 }}>SESSION 2 NOTES</div>
            {data.session2_date && <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif", margin:"0 0 14px" }}>{data.session2_date}</div>}
            <PersonalizedField label="SESSION 2 NOTES" id="session2_notes" data={data} update={update} unlocked={!!call2Complete} rows={8} hideLabel />
            <div style={{ marginTop:14 }}>
              <label style={S.fieldLabel}>SESSION DATE</label>
              <input value={data.session2_date || ""} onChange={e => update("session2_date", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
            </div>
          </div>
        </div>
        <div style={S.card}>
          <PersonalizedField label="KEY DELIVERABLES AND ACTION COMMITMENTS" id="deliverables" data={data} update={update} unlocked={call1Complete} rows={4} />
        </div>
      </LockedSection>
    </div>
  );
}

/* ─────────── TAB: ROADMAP ─────────── */

function TabRoadmap({ data, update, call1Complete }) {
  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ ...S.eyebrow, marginBottom:10 }}>YOUR 90-DAY ROADMAP</div>
        <p style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:600 }}>A practical implementation plan built around your specific situation and strategic priorities.</p>
      </div>
      <h2 style={{ ...S.h2, marginTop:0, marginBottom:40 }}>Custom 90-Day Roadmap</h2>

      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        {[
          { id:"road_30", label:"DAYS 1–30: FOUNDATION",   sub:"Stabilization and structure",      pendingText:"The first 30 days focus on stopping financial leaks and installing structure." },
          { id:"road_60", label:"DAYS 31–60: MOMENTUM",    sub:"Consistency and reinforcement",    pendingText:"The middle phase reinforces new behaviors and builds confidence in your system." },
          { id:"road_90", label:"DAYS 61–90: POSITIONING", sub:"Advancement and future alignment", pendingText:"The final phase moves from stability toward growth." },
        ].map(phase => (
          <div key={phase.id} style={{ ...S.card, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:14 }}>
              <div style={{ color:C.gold, fontSize:12, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>{phase.label}</div>
              <div style={{ color:C.muted, fontSize:12, fontStyle:"italic", fontFamily:"'DM Sans', sans-serif" }}>{phase.sub}</div>
            </div>
            <PersonalizedField label={phase.label} id={phase.id} data={data} update={update} unlocked={call1Complete} rows={5} hideLabel pendingText={phase.pendingText} />
          </div>
        ))}
        <div style={{ ...S.card, borderLeft:`2px solid ${C.gold}` }}>
          <PersonalizedField label="90-DAY TARGET OUTCOME" id="road_outcome" data={data} update={update} unlocked={call1Complete} rows={3} pendingText="Your specific, measurable result agreed upon by you and Robert." />
        </div>
      </LockedSection>
    </div>
  );
}

/* ─────────── TAB: ADVISORY ─────────── */

function TabAdvisory({ data, update, call1Complete }) {
  return (
    <div>
      <div style={{ marginBottom:36 }}>
        <div style={{ ...S.eyebrow, marginBottom:10 }}>STRATEGIC ADVISORY</div>
        <p style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:600 }}>Direct strategic guidance and support from Robert throughout your reset.</p>
      </div>

      {/* Wide banner image */}
      <div style={{ marginBottom:36 }}>
        <img
          src="/robert-brickey.jpg"
          alt="Robert Brickey"
          style={{ width:"100%", maxHeight:320, objectFit:"cover", objectPosition:"top center", borderRadius:12, display:"block", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div style={{ paddingTop:20 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:24, color:C.text, marginBottom:4 }}>Robert Brickey</div>
          <div style={{ color:C.muted, fontSize:12, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>FINANCIAL STRATEGIST, ETFM</div>
        </div>
      </div>

      {/* Strategic guidance cards */}
      <div style={{ ...S.eyebrow, marginBottom:20 }}>STRATEGIC GUIDANCE</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:52 }} className="es-g3">
        {[
          { label:"CURRENT FOCUS",    text:"Complete your Strategic Intake Form fully and honestly. The depth of your answers directly shapes the quality of your sessions." },
          { label:"THIS WEEK",        text:"Your intake is the foundation of everything. A thorough, honest intake produces a stronger, more targeted strategic framework." },
          { label:"WHAT TO EXPECT",   text:"Session 1 reviews your intake, maps your financial reality, and begins building your personalized strategic framework." },
        ].map(({ label, text }) => (
          <div key={label} style={{ ...S.card, borderTop:`2px solid ${C.gold}` }}>
            <div style={{ color:C.gold, fontSize:10, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>{label}</div>
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* 60-day email support */}
      <div style={{ ...S.eyebrow, marginBottom:16 }}>60-DAY PRIORITY EMAIL SUPPORT</div>
      <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", borderBottom:`1px solid ${C.border}`, paddingBottom:16, marginBottom:16 }}>
            <div style={{ color:C.gold, fontSize:12, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>PRIORITY EMAIL SUPPORT</div>
            <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" }}>
              {data.support_start ? `Started: ${data.support_start}` : "Begins after Session 2"}
            </div>
          </div>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.8, marginBottom:20, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>
            Use this period for strategic questions, implementation decisions, and pressure-point guidance. Response within 24 to 48 business hours.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }} className="es-g2">
            <div>
              <label style={S.fieldLabel}>SUPPORT START DATE</label>
              <input value={data.support_start || ""} onChange={e => update("support_start", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
            </div>
            <div>
              <label style={S.fieldLabel}>SUPPORT END DATE</label>
              <input value={data.support_end || ""} onChange={e => update("support_end", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
            </div>
          </div>
          <PersonalizedField label="SUPPORT LOG" id="support_log" data={data} update={update} unlocked={call1Complete} rows={10} />
        </div>
      </LockedSection>
    </div>
  );
}

/* ─────────── SHARED UI ─────────── */

function MetricTile({ label, value, sub }) {
  return (
    <div style={{ ...S.card, borderTop:`2px solid ${C.gold}`, textAlign:"center", padding:"24px 20px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:28, color:C.text, lineHeight:1, marginBottom: sub ? 6 : 10 }}>{value}</div>
      {sub && <div style={{ color:C.gold, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif", marginBottom:6 }}>{sub}</div>}
      <div style={{ color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>{label.toUpperCase()}</div>
    </div>
  );
}

function PersonalizedField({ label, id, data, update, unlocked, rows = 4, hideLabel = false, singleLine = false, displayAs, pendingText }) {
  const value = data[id] || "";
  if (unlocked && value) {
    if (displayAs === "score") {
      return (
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:26, color:C.text, marginBottom:6 }}>
            {value}<span style={{ fontSize:12, color:C.muted }}> / 100</span>
          </div>
          <input value={value} onChange={e => update(id, e.target.value)} style={{ ...S.input, fontSize:13 }} />
        </div>
      );
    }
    return (
      <div>
        {!hideLabel && <label style={S.fieldLabel}>{label}</label>}
        {singleLine
          ? <input value={value} onChange={e => update(id, e.target.value)} style={S.input} />
          : <textarea value={value} onChange={e => update(id, e.target.value)} rows={rows} style={S.textarea} />
        }
      </div>
    );
  }
  if (unlocked && !value) {
    if (displayAs === "score") return <input value="" onChange={e => update(id, e.target.value)} placeholder="Enter score" style={{ ...S.input, marginTop:6, fontSize:13 }} />;
    return (
      <div>
        {!hideLabel && <label style={S.fieldLabel}>{label}</label>}
        {singleLine
          ? <input value="" onChange={e => update(id, e.target.value)} style={S.input} />
          : <textarea value="" onChange={e => update(id, e.target.value)} rows={rows} style={S.textarea} />
        }
      </div>
    );
  }
  return (
    <div style={{ background:"#f9f8f6", border:`1px solid ${C.border}`, borderRadius:8, padding:"14px 16px" }}>
      {!hideLabel && <div style={{ color:C.gold, fontSize:10, letterSpacing:3, marginBottom:6, fontFamily:"'DM Sans', sans-serif" }}>{label}</div>}
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, fontStyle:"italic", margin:0, fontFamily:"'Cormorant Garamond', Georgia, serif" }}>
        {pendingText || "This field will be ready after your Strategy Session."}
      </p>
    </div>
  );
}

function LockedSection({ unlocked, children, message }) {
  if (unlocked) return <div>{children}</div>;
  return (
    <div>
      <div style={{ background:"#f9f8f6", border:`1px solid ${C.border}`, borderRadius:8, padding:"14px 18px", marginBottom:14 }}>
        <span style={{ color:C.muted, fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>{message || "Unlocks after your Strategy Session."}</span>
      </div>
      <div style={{ opacity:0.5, pointerEvents:"none", userSelect:"none" }}>{children}</div>
    </div>
  );
}

/* ─────────── STYLES ─────────── */

const S = {
  nav:           { position:"fixed", top:0, left:0, right:0, zIndex:100, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 },
  navBtn:        { background:"none", border:"none", cursor:"pointer", padding:"0 14px", height:60, fontFamily:"'DM Sans', sans-serif", fontSize:13, letterSpacing:0.3, transition:"all 0.15s ease", outline:"none" },
  avatar:        { width:34, height:34, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold, fontSize:14, fontFamily:"'Cormorant Garamond', serif", flexShrink:0 },
  content:       { padding:"52px 48px", maxWidth:1100, margin:"0 auto" },
  h1:            { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:52, fontWeight:300, color:C.text, margin:0, lineHeight:1.1 },
  h2:            { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:40, fontWeight:300, color:C.text, margin:0, lineHeight:1.15 },
  sub:           { color:C.muted, fontSize:17, margin:"10px 0 0", fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  eyebrow:       { color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif" },
  card:          { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:28, boxShadow:C.shadow },
  nextActionCard:{ background:C.navy, borderRadius:12, padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, boxShadow:"0 4px 24px rgba(26,39,68,0.12)", marginTop:0 },
  btnGold:       { background:C.gold, color:C.navy, border:"none", padding:"13px 28px", borderRadius:8, fontSize:11, fontWeight:700, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", flexShrink:0, whiteSpace:"nowrap" },
  btnNavy:       { background:C.navy, color:"#fff", border:"none", padding:"14px 32px", borderRadius:8, fontSize:11, fontWeight:500, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  successBadge:  { background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:13, letterSpacing:0.5, padding:"12px 18px", borderRadius:8, fontFamily:"'DM Sans', sans-serif" },
  fieldLabel:    { display:"block", color:C.muted, fontSize:11, letterSpacing:2, marginBottom:7, fontFamily:"'DM Sans', sans-serif" },
  input:         { width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", borderRadius:6, boxSizing:"border-box" },
  textarea:      { width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", resize:"vertical", borderRadius:6, boxSizing:"border-box" },
};
