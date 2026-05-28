import { useState, useEffect } from "react";

const STORAGE_KEY = "etfm_strategic_data";
const CALENDLY_PRE  = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";
const CALENDLY_POST = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};
const saveData = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const C = {
  bg:            "#FAFAF8",
  surface:       "#FFFFFF",
  gold:          "#c9a84c",
  goldSoft:      "rgba(201,168,76,0.07)",
  goldBorder:    "rgba(201,168,76,0.28)",
  text:          "#1a1a2e",
  muted:         "#6b7280",
  border:        "#e8e4de",
  shadow:        "0 2px 14px rgba(0,0,0,0.055)",
  successText:   "#16a34a",
  successBg:     "#f0fdf4",
  successBorder: "#bbf7d0",
};

const INTAKE_SECTIONS = [
  {
    id: "reality", label: "FINANCIAL REALITY", num: "01",
    desc: "Your current financial picture. Estimates are acceptable.",
    questions: [
      { id: "r1", label: "Approximate monthly take-home income", placeholder: "$" },
      { id: "r2", label: "Total monthly fixed expenses (rent, mortgage, car, insurance)", placeholder: "$" },
      { id: "r3", label: "Total monthly variable expenses (groceries, dining, subscriptions)", placeholder: "$" },
      { id: "r4", label: "Total debt outside of a mortgage, if any", placeholder: "None / approximate amount" },
      { id: "r5", label: "Emergency fund status", placeholder: "None / amount / months of coverage" },
      { id: "r6", label: "When did you last have a clear, complete picture of your finances?", placeholder: "Month and year" },
    ]
  },
  {
    id: "stress", label: "STRESS AND PRESSURE POINTS", num: "02",
    desc: "Understanding pressure points allows your strategist to address them directly in Session 1.",
    questions: [
      { id: "s1", label: "Current financial stress level (1 to 10)", placeholder: "1 = minimal, 10 = overwhelming" },
      { id: "s2", label: "What is creating the most financial pressure in your life right now?", multiline: true },
      { id: "s3", label: "What financial problem have you been avoiding or delaying?", multiline: true },
      { id: "s4", label: "Was there a specific event that contributed to your current situation?", multiline: true, placeholder: "Job loss, divorce, unexpected expense, income change..." },
      { id: "s5", label: "What does financial stress feel like in your day-to-day life?", multiline: true },
      { id: "s6", label: "How long have you been carrying this level of financial stress?", placeholder: "Weeks / months / years" },
    ]
  },
  {
    id: "behavior", label: "SPENDING AND BEHAVIOR", num: "03",
    desc: "Behavioral patterns are the root of most financial outcomes. Answer honestly.",
    questions: [
      { id: "b1", label: "How would you describe your spending?", placeholder: "Intentional / reactive / avoidant / impulsive" },
      { id: "b2", label: "What is your most costly recurring financial habit?", multiline: true },
      { id: "b3", label: "Do you currently track your spending? If yes, how?", multiline: true },
      { id: "b4", label: "What emotional triggers drive your financial decisions?", multiline: true, placeholder: "Stress, boredom, social pressure, fear..." },
      { id: "b5", label: "Have you created a budget or plan before and abandoned it? What happened?", multiline: true },
    ]
  },
  {
    id: "income", label: "INCOME AND STABILITY", num: "04",
    desc: "Income consistency directly affects what financial systems are available to you.",
    questions: [
      { id: "i1", label: "Is your income consistent month to month or variable?", placeholder: "Consistent / variable / seasonal" },
      { id: "i2", label: "Do you have more than one income source?", placeholder: "Yes / No / Describe" },
      { id: "i3", label: "What is your biggest income-related concern right now?", multiline: true },
      { id: "i4", label: "Have you experienced a significant income change in the last 12 months?", multiline: true },
      { id: "i5", label: "What would a 20% increase in monthly income change about your situation?", multiline: true },
    ]
  },
  {
    id: "goals", label: "GOALS AND PRIORITIES", num: "05",
    desc: "Your goals inform the entire structure of your Strategic Reset.",
    questions: [
      { id: "g1", label: "What does financial freedom mean to you specifically?", multiline: true },
      { id: "g2", label: "Most important financial goal in the next 12 months", multiline: true },
      { id: "g3", label: "What financial outcome would create the most immediate relief?", multiline: true },
      { id: "g4", label: "What does a financially stable life look like for you in 3 to 5 years?", multiline: true },
      { id: "g5", label: "What financial milestone have you been unable to reach, and what has stopped you?", multiline: true },
      { id: "g6", label: "What would you do differently if you had complete financial clarity?", multiline: true },
    ]
  },
  {
    id: "systems", label: "SYSTEMS AND STRUCTURE", num: "06",
    desc: "Understanding what you already have helps identify the specific gaps to close.",
    questions: [
      { id: "sy1", label: "Do you have any financial systems currently in place?", multiline: true, placeholder: "Automatic savings, bill tracking, budget, investment accounts..." },
      { id: "sy2", label: "How do you currently manage bills and due dates?", multiline: true },
      { id: "sy3", label: "Do you have a savings plan? If yes, describe it.", multiline: true },
      { id: "sy4", label: "How do you typically make financial decisions?", placeholder: "Planned / reactive / intuitive / emotional" },
      { id: "sy5", label: "What financial system, if it existed, would make the biggest difference right now?", multiline: true },
    ]
  },
  {
    id: "context", label: "PARTNERSHIP CONTEXT", num: "07",
    desc: "These final questions help your strategist prepare specifically for Session 1.",
    questions: [
      { id: "c1", label: "What made you decide to invest in the Strategic Reset Partnership?", multiline: true },
      { id: "c2", label: "What do you most want to walk away from these sessions with?", multiline: true },
      { id: "c3", label: "What have you tried before that has not worked?", multiline: true },
      { id: "c4", label: "What is your biggest concern about this process?", multiline: true },
      { id: "c5", label: "Is there anything important about your financial situation you have not yet shared?", multiline: true },
    ]
  },
];

const ALL_IDS = INTAKE_SECTIONS.flatMap(s => s.questions.map(q => q.id));
const TOTAL_Q  = ALL_IDS.length;

export default function ETFMStrategic() {
  const [data, setData]               = useState(loadData);
  const [saved, setSaved]             = useState(false);
  const [activeIntake, setActiveIntake] = useState(null);

  useEffect(() => {
    if (!document.getElementById("etfm-strategic-fonts")) {
      const link = document.createElement("link");
      link.id   = "etfm-strategic-fonts";
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("etfm-strategic-anim")) {
      const style = document.createElement("style");
      style.id = "etfm-strategic-anim";
      style.textContent = `
        @keyframes stFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .st-fade { animation: stFadeUp 0.6s ease both; }
        a.st-nav-link { color: #6b7280; text-decoration: none; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.5px; padding: 6px 0; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
        a.st-nav-link:hover { color: #1a1a2e; border-bottom-color: #c9a84c; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    saveData(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const answeredCount  = ALL_IDS.filter(id => (data[id] || "").trim()).length;
  const progressPct    = Math.round((answeredCount / TOTAL_Q) * 100);
  const intakeComplete = data.intake_submitted;
  const call1Complete  = data.call1_complete;
  const call2Complete  = data.call2_complete;

  const currentPhase   = call2Complete ? "Phase 3: Framework" : call1Complete ? "Phase 2: Sessions" : "Phase 1: Intake";
  const sessionStatus  = call2Complete ? "Both sessions complete" : call1Complete ? "Session 1 complete" : "Not yet started";
  const frameworkStatus = call1Complete ? "Unlocked" : "Locked";
  const nextAction = call2Complete
    ? "Review your Strategic Framework and 90-Day Roadmap"
    : call1Complete
      ? "Book and complete Session 2"
      : intakeComplete
        ? "Book and complete Session 1"
        : progressPct === 100
          ? "Submit your Intake Form"
          : "Complete your Strategic Intake Form below.";

  const processSteps = [
    { label: "Complete the Strategic Intake Form",          done: !!intakeComplete },
    { label: "Book and attend Session 1",                   done: !!call1Complete },
    { label: "Receive your Matrix Score and Analysis",      done: !!(call1Complete && data.structural_analysis) },
    { label: "Receive your Strategic Framework",            done: !!(call1Complete && data.fw_priority) },
    { label: "Book and attend Session 2",                   done: !!call2Complete },
    { label: "Begin your 60-Day Priority Email Support",    done: !!data.support_start },
  ];

  return (
    <div style={S.page}>

      {/* FIXED NAV */}
      <nav style={S.nav}>
        <div style={{ display:"flex", alignItems:"center", gap:36 }}>
          <div>
            <div style={S.logo}>ETFM</div>
            <div style={S.logoSub}>ESCAPE THE FINANCIAL MATRIX</div>
          </div>
          <div style={S.navLinks}>
            {[["Intake","#section1"],["Sessions","#section2"],["Framework","#section4"],["Roadmap","#section6"],["Notes","#section7"],["Support","#section8"]].map(([label, href]) => (
              <a key={href} href={href} className="st-nav-link">{label}</a>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>Strategic Reset Partnership</div>
          <div style={{ color:C.gold, fontSize:11, letterSpacing:2, marginTop:2, fontFamily:"'DM Sans', sans-serif" }}>PRIVATE CLIENT DASHBOARD</div>
        </div>
      </nav>

      {saved && <div style={S.saveToast}>SAVED</div>}

      {/* HERO */}
      <section style={S.hero} className="st-fade">
        <p style={S.eyebrow}>YOUR STRATEGIC RESET PARTNERSHIP</p>
        <h1 style={S.heroTitle}>Private Client<br />Strategic Dashboard</h1>
        <p style={S.heroSub}>A private, one-on-one strategic engagement built entirely around your specific financial situation, behaviors, and goals.</p>
      </section>

      {/* STATUS */}
      <section style={S.section}>
        <SectionLabel>YOUR RESET STATUS</SectionLabel>
        <div style={S.statusGrid}>
          {[
            { label:"CURRENT PHASE",    val: currentPhase },
            { label:"SESSION STATUS",   val: sessionStatus },
            { label:"FRAMEWORK STATUS", val: frameworkStatus },
            { label:"INTAKE PROGRESS",  val: `${progressPct}%` },
          ].map(({ label, val }) => (
            <div key={label} style={S.statusTile}>
              <div style={S.tileLabel}>{label}</div>
              <div style={S.tileVal}>{val}</div>
            </div>
          ))}
        </div>
        <div style={S.nextActionBar}>
          <span style={S.eyebrow}>NEXT ACTION</span>
          <span style={{ color:C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif" }}>{nextAction}</span>
        </div>
      </section>

      {/* PROCESS */}
      <section style={S.section}>
        <SectionLabel>YOUR RESET PROCESS</SectionLabel>
        <div style={S.processGrid}>
          {processSteps.map((step, i) => (
            <div key={i} style={{ ...S.processStep, ...(step.done ? S.processStepDone : {}) }}>
              <span style={{ ...S.processNum, ...(step.done ? { color:C.successText } : {}) }}>0{i+1}</span>
              <span style={{ color: step.done ? C.successText : C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight: step.done ? 400 : 300 }}>{step.label}</span>
              {step.done && <span style={S.checkmark}>&#10003;</span>}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1: INTAKE */}
      <section id="section1" style={S.section}>
        <SectionLabel>01 · STRATEGIC INTAKE FORM</SectionLabel>
        <p style={S.sectionNote}>38 questions across 7 sections. Your answers are reviewed by Robert before Session 1. Answer as honestly as you can — accuracy matters more than perfection.</p>

        <div style={S.progressWrap}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={S.eyebrow}>COMPLETION</span>
            <span style={{ color:C.muted, fontSize:12, fontFamily:"'DM Sans', sans-serif" }}>{answeredCount} of {TOTAL_Q} answered</span>
          </div>
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width:`${progressPct}%` }} />
          </div>
          <div style={{ textAlign:"right", marginTop:6, color:C.gold, fontSize:13, fontFamily:"'Cormorant Garamond', Georgia, serif" }}>{progressPct}%</div>
        </div>

        {INTAKE_SECTIONS.map(sec => {
          const open     = activeIntake === sec.id;
          const secDone  = sec.questions.filter(q => (data[q.id] || "").trim()).length;
          const complete = secDone === sec.questions.length;
          return (
            <div key={sec.id} style={{ ...S.intakeSec, ...(open ? S.intakeSecOpen : {}) }}>
              <button style={S.intakeHeader} onClick={() => setActiveIntake(open ? null : sec.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <span style={{ ...S.intakeNum, ...(complete ? { color:C.successText } : {}) }}>{sec.num}</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ color:C.text, fontSize:13, letterSpacing:1.5, fontFamily:"'DM Sans', sans-serif" }}>{sec.label}</div>
                    <div style={{ color:C.muted, fontSize:12, marginTop:2, fontFamily:"'DM Sans', sans-serif" }}>{secDone} / {sec.questions.length} answered</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {complete && <span style={S.checkBadge}>&#10003;</span>}
                  <span style={{ color:C.muted, fontSize:11 }}>{open ? "▲" : "▼"}</span>
                </div>
              </button>
              {open && (
                <div style={S.intakeBody}>
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
          <button style={{ ...S.btnPrimary, marginTop:20, width:"100%", display:"block" }} onClick={() => update("intake_submitted", true)}>
            SUBMIT INTAKE FORM
          </button>
        )}
        {intakeComplete && (
          <div style={S.submittedBadge}>&#10003; Intake form submitted. Robert will review your responses before Session 1.</div>
        )}

        {intakeComplete && (
          <div style={{ ...S.card, marginTop:20, borderTop:`2px solid ${C.gold}` }}>
            <div style={S.eyebrow}>SESSION 1 STATUS</div>
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, margin:"12px 0 16px", fontFamily:"'DM Sans', sans-serif" }}>
              Once Session 1 is complete, mark it below to unlock your personalized materials.
            </p>
            {call1Complete
              ? <div style={S.submittedBadge}>&#10003; Session 1 complete. Your personalized materials are now unlocked.</div>
              : <button style={S.btnSecondary} onClick={() => update("call1_complete", true)}>MARK SESSION 1 COMPLETE</button>
            }
          </div>
        )}
      </section>

      {/* SECTION 2: SESSIONS */}
      <section id="section2" style={S.section}>
        <SectionLabel>02 · SESSION BOOKING</SectionLabel>
        <p style={S.sectionNote}>Two private 30-minute strategy calls. Book Session 1 after completing your intake. Session 2 follows after your framework is delivered.</p>
        <div style={S.bookingGrid}>

          <div style={{ ...S.card, borderTop:`2px solid ${C.gold}` }}>
            <div style={S.eyebrow}>SESSION 1 OF 2</div>
            <h3 style={S.cardTitle}>Strategic Reality Session</h3>
            <p style={S.cardDesc}>Reviews your intake, identifies high-leverage pressure points, and begins building your Strategic Framework.</p>
            <div style={S.metaRow}><span style={S.metaLabel}>DURATION</span><span style={S.metaVal}>30 minutes</span></div>
            <div style={S.metaRow}><span style={S.metaLabel}>FORMAT</span><span style={S.metaVal}>Private video call</span></div>
            <div style={S.metaRow}><span style={S.metaLabel}>REQUIRES</span><span style={S.metaVal}>Intake form completed</span></div>
            <div style={{ marginTop:20 }}>
              {call1Complete
                ? <div style={S.submittedBadge}>&#10003; Session 1 complete</div>
                : <a href={CALENDLY_PRE} target="_blank" rel="noopener noreferrer" style={{ ...S.btnPrimary, display:"block", textAlign:"center", textDecoration:"none" }}>BOOK SESSION 1</a>
              }
            </div>
          </div>

          <div style={{ ...S.card, borderTop:`2px solid ${C.border}`, opacity: call1Complete ? 1 : 0.55 }}>
            <div style={S.eyebrow}>SESSION 2 OF 2</div>
            <h3 style={S.cardTitle}>Strategic Implementation Session</h3>
            <p style={S.cardDesc}>Reviews your 90-Day Roadmap, confirms your Decision Rules, and closes with your complete Strategic Operating Framework.</p>
            <div style={S.metaRow}><span style={S.metaLabel}>DURATION</span><span style={S.metaVal}>30 minutes</span></div>
            <div style={S.metaRow}><span style={S.metaLabel}>FORMAT</span><span style={S.metaVal}>Private video call</span></div>
            <div style={S.metaRow}><span style={S.metaLabel}>REQUIRES</span><span style={S.metaVal}>Session 1 complete</span></div>
            <div style={{ marginTop:20 }}>
              {call2Complete
                ? <div style={S.submittedBadge}>&#10003; Session 2 complete</div>
                : call1Complete
                  ? <a href={CALENDLY_POST} target="_blank" rel="noopener noreferrer" style={{ ...S.btnPrimary, display:"block", textAlign:"center", textDecoration:"none" }}>BOOK SESSION 2</a>
                  : <div style={S.lockedBtn}>UNLOCKS AFTER SESSION 1</div>
              }
            </div>
          </div>

        </div>
        {call1Complete && !call2Complete && (
          <button style={{ ...S.btnSecondary, marginTop:14 }} onClick={() => update("call2_complete", true)}>MARK SESSION 2 COMPLETE</button>
        )}
        {call2Complete && <div style={{ ...S.submittedBadge, marginTop:14 }}>&#10003; Both sessions complete</div>}
      </section>

      {/* SECTION 3: MATRIX SCORE */}
      <section id="section3" style={S.section}>
        <SectionLabel>03 · MATRIX SCORE AND STRUCTURAL ANALYSIS</SectionLabel>
        <p style={S.sectionNote}>Your behavioral and financial analysis, prepared personally by Robert after Session 1.</p>
        <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
          <div style={S.matrixGrid}>
            {[
              { key:"sc_awareness",  name:"Awareness",           desc:"How clearly you see where your money goes." },
              { key:"sc_pattern",    name:"Money Pattern",       desc:"How consistently you manage income and expenses." },
              { key:"sc_stress",     name:"Stress Response",     desc:"How you respond when financial pressure builds." },
              { key:"sc_structure",  name:"Financial Structure", desc:"The systems and habits you have in place." },
              { key:"sc_readiness",  name:"System Readiness",    desc:"Your ability to build and follow a financial plan." },
            ].map(comp => (
              <div key={comp.key} style={S.matrixCard}>
                <div style={{ color:C.gold, fontSize:11, letterSpacing:2, marginBottom:4, fontFamily:"'DM Sans', sans-serif" }}>{comp.name}</div>
                <div style={{ color:C.muted, fontSize:12, lineHeight:1.5, marginBottom:10, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{comp.desc}</div>
                <PersonalizedField label={comp.name} id={comp.key} data={data} update={update} unlocked={call1Complete} singleLine displayAs="score" />
              </div>
            ))}
          </div>
          <PersonalizedField label="STRUCTURAL ANALYSIS" id="structural_analysis" data={data} update={update} unlocked={call1Complete} rows={6} pendingText="Your structural analysis will appear here after Session 1." />
        </LockedSection>
      </section>

      {/* SECTION 4: STRATEGIC FRAMEWORK */}
      <section id="section4" style={S.section}>
        <SectionLabel>04 · PERSONALIZED STRATEGIC FRAMEWORK</SectionLabel>
        <p style={S.sectionNote}>Your custom financial operating system, built around your intake responses and strategy session.</p>
        <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
          <div style={S.frameworkGrid}>
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
      </section>

      {/* SECTION 5: DECISION RULES */}
      <section id="section5" style={S.section}>
        <SectionLabel>05 · DECISION RULES AND FINANCIAL POLICY</SectionLabel>
        <p style={S.sectionNote}>Your personal spending, saving, and debt policies — designed to reduce emotional decisions and replace reactive habits with structure.</p>
        <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
          {[
            { id:"rule_spending",  label:"SPENDING RULE",       pendingText:"Your personal discretionary spending guideline." },
            { id:"rule_saving",    label:"SAVING RULE",          pendingText:"The saving rate or method that works for your situation." },
            { id:"rule_debt",      label:"DEBT RULE",            pendingText:"How you will handle debt repayment — which debts, in what order." },
            { id:"rule_income",    label:"INCOME RULE",          pendingText:"How you treat and allocate income when it arrives." },
            { id:"rule_emergency", label:"EMERGENCY FUND RULE",  pendingText:"Your target emergency fund amount and the plan to build it." },
            { id:"rule_invest",    label:"INVESTMENT RULE",      pendingText:"" },
          ].map(r => (
            <div key={r.id} style={{ ...S.card, marginBottom:8 }}>
              <PersonalizedField label={r.label} id={r.id} data={data} update={update} unlocked={call1Complete} rows={2} pendingText={r.pendingText} />
            </div>
          ))}
          <div style={{ ...S.card, marginTop:8 }}>
            <PersonalizedField label="ADDITIONAL FINANCIAL POLICIES" id="rule_additional" data={data} update={update} unlocked={call1Complete} rows={4} />
          </div>
        </LockedSection>
      </section>

      {/* SECTION 6: ROADMAP */}
      <section id="section6" style={S.section}>
        <SectionLabel>06 · CUSTOM 90-DAY ROADMAP</SectionLabel>
        <p style={S.sectionNote}>A phased implementation plan built around your situation and priorities. Three phases, each building on the last.</p>
        <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
          {[
            { id:"road_30", label:"DAYS 1–30: FOUNDATION",    sub:"Stabilization and structure",      pendingText:"The first 30 days focus on stopping financial leaks and installing structure." },
            { id:"road_60", label:"DAYS 31–60: MOMENTUM",     sub:"Consistency and reinforcement",    pendingText:"The middle phase reinforces new behaviors and builds confidence in your system." },
            { id:"road_90", label:"DAYS 61–90: POSITIONING",  sub:"Advancement and future alignment", pendingText:"The final phase moves from stability toward growth." },
          ].map(phase => (
            <div key={phase.id} style={{ ...S.card, marginBottom:10 }}>
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
      </section>

      {/* SECTION 7: SESSION NOTES */}
      <section id="section7" style={S.section}>
        <SectionLabel>07 · SESSION NOTES</SectionLabel>
        <p style={S.sectionNote}>Detailed notes from each session, posted here after each call.</p>
        <LockedSection unlocked={call1Complete} message="Unlocks after Session 1.">
          <div style={S.bookingGrid}>
            <div style={S.card}>
              <div style={S.eyebrow}>SESSION 1 NOTES</div>
              {data.session1_date && <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif", margin:"8px 0 14px" }}>{data.session1_date}</div>}
              <PersonalizedField label="SESSION 1 NOTES" id="session1_notes" data={data} update={update} unlocked={call1Complete} rows={8} hideLabel />
              <div style={{ marginTop:14 }}>
                <label style={S.fieldLabel}>SESSION DATE</label>
                <input value={data.session1_date || ""} onChange={e => update("session1_date", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
              </div>
            </div>
            <div style={{ ...S.card, opacity: call2Complete ? 1 : 0.55 }}>
              <div style={S.eyebrow}>SESSION 2 NOTES</div>
              {data.session2_date && <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif", margin:"8px 0 14px" }}>{data.session2_date}</div>}
              <PersonalizedField label="SESSION 2 NOTES" id="session2_notes" data={data} update={update} unlocked={!!call2Complete} rows={8} hideLabel />
              <div style={{ marginTop:14 }}>
                <label style={S.fieldLabel}>SESSION DATE</label>
                <input value={data.session2_date || ""} onChange={e => update("session2_date", e.target.value)} placeholder="MM/DD/YYYY" style={S.input} />
              </div>
            </div>
          </div>
          <div style={{ ...S.card, marginTop:10 }}>
            <PersonalizedField label="KEY DELIVERABLES AND ACTION COMMITMENTS" id="deliverables" data={data} update={update} unlocked={call1Complete} rows={4} />
          </div>
        </LockedSection>
      </section>

      {/* SECTION 8: SUPPORT */}
      <section id="section8" style={{ ...S.section, paddingBottom:80 }}>
        <SectionLabel>08 · 60-DAY PRIORITY EMAIL SUPPORT</SectionLabel>
        <p style={S.sectionNote}>Direct email access for questions, implementation guidance, and accountability for 60 days after your framework is delivered.</p>
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
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
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
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.muted, fontSize:15, margin:0, lineHeight:1.8, maxWidth:520 }}>
          You do not need to solve everything immediately. Stay honest, intentional, and committed to building stronger structure one decision at a time.
        </p>
        <span style={{ color:C.gold, fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:20, letterSpacing:6, flexShrink:0 }}>ETFM</span>
      </footer>
    </div>
  );
}

/* ── COMPONENTS ── */

function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
      <span style={{ color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap" }}>{children}</span>
      <div style={{ flex:1, height:1, background:C.border }} />
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
    <div style={S.pendingCard}>
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
      <div style={S.lockedBanner}>
        <span style={{ color:C.muted, fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>{message || "Unlocks after your Strategy Session."}</span>
      </div>
      <div style={{ opacity:0.5, pointerEvents:"none", userSelect:"none" }}>{children}</div>
    </div>
  );
}

/* ── STYLES ── */

const S = {
  page:         { fontFamily:"'DM Sans', Inter, sans-serif", background:C.bg, color:C.text, minHeight:"100vh", paddingTop:68, paddingBottom:80 },
  nav:          { position:"fixed", top:0, left:0, right:0, zIndex:100, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"14px 48px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:         { fontFamily:"'Cormorant Garamond', Georgia, serif", color:C.gold, fontSize:21, letterSpacing:7 },
  logoSub:      { color:C.muted, fontSize:10, letterSpacing:3, marginTop:2, fontFamily:"'DM Sans', sans-serif" },
  navLinks:     { display:"flex", gap:28, marginLeft:40 },
  saveToast:    { position:"fixed", top:76, right:20, background:C.surface, border:`1px solid ${C.gold}`, color:C.gold, fontSize:11, padding:"7px 16px", zIndex:9999, letterSpacing:3, fontFamily:"'DM Sans', sans-serif", boxShadow:C.shadow },
  hero:         { padding:"72px 48px 60px", borderBottom:`1px solid ${C.border}` },
  eyebrow:      { color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif", margin:0 },
  heroTitle:    { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:52, color:C.text, fontWeight:300, lineHeight:1.1, margin:"18px 0 20px" },
  heroSub:      { color:C.muted, fontSize:16, lineHeight:1.8, maxWidth:560, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 },
  section:      { padding:"68px 48px 0" },
  sectionNote:  { color:C.muted, fontSize:14, lineHeight:1.8, marginBottom:28, fontFamily:"'DM Sans', sans-serif", fontWeight:300, maxWidth:600 },
  card:         { background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:28, boxShadow:C.shadow },
  statusGrid:   { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:12 },
  statusTile:   { background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"20px 22px", boxShadow:C.shadow },
  tileLabel:    { color:C.muted, fontSize:10, letterSpacing:3, marginBottom:8, fontFamily:"'DM Sans', sans-serif" },
  tileVal:      { color:C.text, fontSize:16, fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:400 },
  nextActionBar:{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.gold}`, borderRadius:4, padding:"14px 20px", display:"flex", alignItems:"baseline", gap:16, boxShadow:C.shadow },
  processGrid:  { display:"flex", flexDirection:"column", gap:2 },
  processStep:  { background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"14px 20px", display:"flex", alignItems:"center", gap:16, boxShadow:C.shadow },
  processStepDone:{ background:C.successBg, borderColor:C.successBorder },
  processNum:   { color:C.gold, fontSize:15, fontFamily:"'Cormorant Garamond', Georgia, serif", minWidth:26, flexShrink:0 },
  checkmark:    { marginLeft:"auto", flexShrink:0, color:C.successText, fontSize:14 },
  progressWrap: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"20px 24px", marginBottom:14, boxShadow:C.shadow },
  progressTrack:{ background:"#f0ede8", height:4, borderRadius:2 },
  progressFill: { background:C.gold, height:4, borderRadius:2, transition:"width 0.4s ease" },
  intakeSec:    { background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:6, boxShadow:C.shadow, overflow:"hidden" },
  intakeSecOpen:{ borderColor:C.gold },
  intakeHeader: { width:"100%", background:"none", border:"none", padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  intakeNum:    { color:C.gold, fontSize:18, fontFamily:"'Cormorant Garamond', Georgia, serif", minWidth:30 },
  intakeBody:   { padding:"4px 22px 24px", borderTop:`1px solid ${C.border}` },
  checkBadge:   { background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:12, padding:"2px 9px", borderRadius:3 },
  bookingGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:14 },
  cardTitle:    { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:20, color:C.text, fontWeight:400, margin:"12px 0 10px" },
  cardDesc:     { color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, marginBottom:16 },
  metaRow:      { display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` },
  metaLabel:    { color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" },
  metaVal:      { color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", fontWeight:400 },
  matrixGrid:   { display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, marginBottom:20 },
  matrixCard:   { background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:16, boxShadow:C.shadow },
  frameworkGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  lockedBanner: { background:"#f9f8f6", border:`1px solid ${C.border}`, borderRadius:6, padding:"14px 18px", marginBottom:14 },
  pendingCard:  { background:"#f9f8f6", border:`1px solid ${C.border}`, borderRadius:4, padding:"14px 16px" },
  submittedBadge:{ background:C.successBg, border:`1px solid ${C.successBorder}`, color:C.successText, fontSize:13, letterSpacing:0.5, padding:"12px 18px", borderRadius:4, fontFamily:"'DM Sans', sans-serif" },
  btnPrimary:   { background:C.text, color:"#FFFFFF", border:"none", padding:"13px 28px", fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:500, borderRadius:4 },
  btnSecondary: { background:"transparent", color:C.text, border:`1px solid ${C.border}`, padding:"13px 28px", fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", borderRadius:4 },
  lockedBtn:    { background:"#f9f8f6", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, letterSpacing:2, padding:"13px 18px", textAlign:"center", borderRadius:4, fontFamily:"'DM Sans', sans-serif" },
  fieldLabel:   { display:"block", color:C.muted, fontSize:11, letterSpacing:2, marginBottom:7, fontFamily:"'DM Sans', sans-serif" },
  input:        { width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", boxSizing:"border-box", borderRadius:4 },
  textarea:     { width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", resize:"vertical", boxSizing:"border-box", borderRadius:4 },
  footer:       { margin:"64px 48px 0", borderTop:`1px solid ${C.border}`, paddingTop:28, paddingBottom:60, display:"flex", justifyContent:"space-between", alignItems:"center", gap:40 },
};
