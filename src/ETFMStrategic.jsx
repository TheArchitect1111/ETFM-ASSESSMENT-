import { useState } from "react";

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

const INTAKE_SECTIONS = [
  {
    id: "reality", label: "FINANCIAL REALITY", num: "01",
    desc: "Your current financial picture. Be as accurate as possible. Estimates are acceptable.",
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
    desc: "Understanding what is creating the most pressure allows your strategist to address it directly in Session 1.",
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
    desc: "Behavioral patterns are the root of most financial outcomes. Answer honestly. There is no judgment here.",
    questions: [
      { id: "b1", label: "How would you describe your spending?", placeholder: "Intentional / reactive / avoidant / impulsive" },
      { id: "b2", label: "What is your most costly recurring financial habit?", multiline: true },
      { id: "b3", label: "Do you currently track your spending? If yes, how?", multiline: true },
      { id: "b4", label: "What emotional triggers drive your financial decisions?", multiline: true, placeholder: "Stress, boredom, social pressure, fear..." },
      { id: "b5", label: "Have you created a budget or financial plan before and abandoned it? What happened?", multiline: true },
    ]
  },
  {
    id: "income", label: "INCOME AND STABILITY", num: "04",
    desc: "Income consistency and structure directly affect what financial systems are available to you.",
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
    desc: "Your goals inform the entire structure of your Strategic Reset. Be specific rather than general.",
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
    desc: "Understanding what you already have in place helps identify the specific gaps we need to close.",
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
const TOTAL_Q = ALL_IDS.length; // 38

export default function ETFMStrategic() {
  const [data, setData] = useState(loadData);
  const [saved, setSaved] = useState(false);
  const [activeIntake, setActiveIntake] = useState(null);

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    saveData(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const answeredCount = ALL_IDS.filter(id => (data[id] || "").trim()).length;
  const progressPct   = Math.round((answeredCount / TOTAL_Q) * 100);
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
          : "Complete your Strategic Intake Form so Robert can begin identifying the financial patterns, stress points, and structural priorities shaping your current financial reality.";

  const processSteps = [
    { label: "Complete the Strategic Intake Form (38 questions)", desc: "Answer 38 guided questions across 7 sections designed to uncover financial patterns, stress points, structural gaps, habits, and strategic priorities before Session 1.", done: !!intakeComplete },
    { label: "Book and attend Session 1: Strategic Reality Session", desc: "A private strategy session where Robert reviews your intake, identifies high-leverage pressure points, and begins building your personalized Strategic Framework.", done: !!call1Complete },
    { label: "Receive your Full Matrix Score and Structural Analysis", desc: "A personalized operational analysis designed to identify the behaviors, stress patterns, structural gaps, and decision-making cycles impacting your financial progress.", done: !!(call1Complete && data.structural_analysis) },
    { label: "Receive your Personalized Strategic Framework and Decision Rules", desc: "Your custom financial operating system built around your goals, priorities, financial reality, and implementation capacity.", done: !!(call1Complete && data.fw_priority) },
    { label: "Book and attend Session 2: Strategic Implementation Session", desc: "Clear operating rules for spending, saving, debt, and financial decisions designed to reduce emotional reactions and create long-term consistency.", done: !!call2Complete },
    { label: "Begin your 60-Day Priority Email Support period", desc: "A phased implementation framework with strategic priorities, execution guidance, accountability, and ongoing support during your reset process.", done: !!data.support_start },
  ];

  return (
    <div style={styles.page}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div>
          <div style={styles.logo}>ETFM</div>
          <div style={styles.logoSub}>ESCAPE THE FINANCIAL MATRIX</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={styles.navName}>Strategic Reset Partnership</div>
          <div style={styles.navStep}>PRIVATE CLIENT DASHBOARD</div>
        </div>
      </nav>

      {saved && <div style={styles.saveToast}>✓ Progress saved</div>}

      {/* HERO */}
      <section style={styles.hero}>
        <img
          src="/etfm-logo.png"
          alt="ETFM"
          style={{ width: "360px", display: "block", margin: "0 auto 16px", objectFit: "contain" }}
          onError={e => e.target.style.display = "none"}
        />
        <div style={styles.heroLabel}>YOUR STRATEGIC RESET PARTNERSHIP</div>
        <h1 style={styles.heroTitle}>Private Client<br />Strategic Dashboard</h1>
        <div style={styles.congratsBox}>
          <div style={styles.congratsLabel}>WELCOME</div>
          <p style={styles.congratsText}>
            You have made a serious decision. The Strategic Reset Partnership is not a course, a program, or a framework. It is a private, one-on-one strategic engagement built entirely around your specific financial situation, behaviors, and goals. Everything in this dashboard was designed for you.
          </p>
        </div>
      </section>

      {/* RESET STATUS CARD */}
      <section style={styles.section}>
        <SectionLabel>YOUR RESET STATUS</SectionLabel>
        <p style={styles.sectionCtx}>You are currently in the Discovery Phase of your Strategic Reset Partnership. This phase is designed to help identify your financial patterns, pressure points, structural gaps, and highest-priority focus areas before your first strategy session. As you complete your intake, Robert personally reviews your responses and begins building the foundation of your personalized Strategic Operating Framework behind the scenes. The goal right now is not perfection. The goal is clarity.</p>
        <div style={styles.statusGrid}>
          {[
            { label: "CURRENT PHASE",    val: currentPhase,       sub: "Identifying patterns, pressure points, and structural gaps before Session 1." },
            { label: "SESSION STATUS",   val: sessionStatus,      sub: "Session 1 becomes available immediately after your intake is completed." },
            { label: "FRAMEWORK STATUS", val: frameworkStatus,    sub: "Your Strategic Framework begins taking shape as Robert reviews your intake responses." },
            { label: "INTAKE PROGRESS",  val: `${progressPct}%`, sub: "Progress saves automatically as you complete each section." },
          ].map(({ label, val, sub }) => (
            <div key={label} style={styles.statusTile}>
              <div style={styles.statusTileLabel}>{label}</div>
              <div style={styles.statusTileVal}>{val}</div>
              <div style={styles.statusTileSub}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={styles.statusNextAction}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: (!intakeComplete && !call1Complete && !call2Complete) ? 8 : 0 }}>
              <span style={styles.statusNextLabel}>NEXT ACTION</span>
              <span style={styles.statusNextVal}>{nextAction}</span>
            </div>
            {!intakeComplete && !call1Complete && !call2Complete && (
              <p style={styles.statusNextSub}>The more honest and complete your responses are, the more personalized and strategic your Reset Framework becomes.</p>
            )}
          </div>
        </div>
      </section>

      {/* STRATEGIC RESET PROCESS */}
      <section style={styles.section}>
        <SectionLabel>YOUR STRATEGIC RESET PROCESS</SectionLabel>
        <p style={styles.sectionCtx}>Your Strategic Reset Partnership unfolds through six guided phases designed to move you from financial awareness into structured implementation intentionally and progressively. Each step builds on the previous one so the process feels clear, strategic, and manageable. As you move through each phase, Robert uses your intake, session conversations, and strategic priorities to build a framework designed specifically around your financial reality.</p>
        <div style={styles.processGrid}>
          {processSteps.map((step, i) => (
            <div key={i} style={{ ...styles.processStep, ...(step.done ? styles.processStepDone : {}) }}>
              <span style={{ ...styles.processNum, ...(step.done ? styles.processNumDone : {}) }}>0{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={styles.processText}>{step.label}</div>
                <div style={styles.processDesc}>{step.desc}</div>
              </div>
              {step.done && <span style={styles.processBadge}>✓ COMPLETE</span>}
            </div>
          ))}
        </div>
        <div style={styles.processClosing}>
          This process is intentionally progressive. You are not expected to solve everything immediately. Each phase is designed to reduce overwhelm, create clarity, and help you build stronger financial systems one step at a time. The goal is not financial perfection. The goal is intentional financial operation.
        </div>
      </section>

      {/* ── SECTION 1: INTAKE FORM ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 1 · STRATEGIC INTAKE FORM</SectionLabel>
        <GuidedNote>Start here. Complete all 7 intake sections before your first session.</GuidedNote>
        <p style={styles.sectionCtx}>There are 38 questions across 7 guided sections designed to help identify your current financial structure, pressure points, decision-making patterns, habits, and strategic priorities before Session 1. Click into each section and answer the questions as honestly as possible. These questions are intentionally designed to help uncover where financial stress is being created, where your system may be breaking down, and what changes will create the greatest impact moving forward. Your answers are saved automatically and personally reviewed by Robert prior to Session 1 so your Strategic Reset Framework can be built around your real financial reality, not generic advice. You do not need perfect answers or exact numbers. The goal is clarity, not perfection.</p>

        <RobertNote>
          The intake questions are not just administrative. They are the foundation of everything we build together. The more honest your answers, the more precise and useful your Strategic Framework will be. There are no wrong answers here.
        </RobertNote>

        <div style={styles.progressWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={styles.progressLabel}>INTAKE COMPLETION</span>
            <span style={styles.progressVal}>{answeredCount} of {TOTAL_Q} answered ({progressPct}%)</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
        </div>

        {INTAKE_SECTIONS.map(sec => {
          const open = activeIntake === sec.id;
          const secDone = sec.questions.filter(q => (data[q.id] || "").trim()).length;
          const secComplete = secDone === sec.questions.length;
          return (
            <div key={sec.id} style={{ ...styles.intakeSec, ...(open ? styles.intakeSecOpen : {}) }}>
              <button style={styles.intakeHeader} onClick={() => setActiveIntake(open ? null : sec.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={styles.intakeNum}>{sec.num}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={styles.intakeSecLabel}>{sec.label}</div>
                    <div style={styles.intakeProgress}>{secDone} / {sec.questions.length} answered</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {secComplete && <span style={styles.checkBadge}>✓</span>}
                  <span style={styles.chevron}>{open ? "▲" : "▼"}</span>
                </div>
              </button>
              {open && (
                <div style={styles.intakeBody}>
                  <p style={styles.intakeDesc}>{sec.desc}</p>
                  {sec.questions.map(q => (
                    <div key={q.id} style={{ marginBottom: 18 }}>
                      <label style={styles.fieldLabel}>{q.label}</label>
                      {q.multiline
                        ? <textarea value={data[q.id] || ""} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder || ""} rows={3} style={styles.textarea} />
                        : <input value={data[q.id] || ""} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder || ""} style={styles.input} />
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {progressPct === 100 && !intakeComplete && (
          <button style={{ ...styles.btnPrimary, marginTop: 20, width: "100%", display: "block" }} onClick={() => update("intake_submitted", true)}>
            SUBMIT INTAKE FORM
          </button>
        )}
        {intakeComplete && (
          <div style={styles.submittedBadge}>✓ INTAKE FORM SUBMITTED — Robert will review your responses before Session 1</div>
        )}

        {/* SESSION 1 STATUS — shown only after intake is submitted */}
        {intakeComplete && (
          <div style={styles.session1StatusBlock}>
            <div style={styles.session1StatusLabel}>SESSION 1 STATUS</div>
            <p style={styles.session1StatusText}>
              Once your Strategic Intake Form is complete and Session 1 has been finished, mark your session complete below to unlock your personalized Matrix Analysis, Strategic Framework, Decision Rules, 90-Day Roadmap, and Session Notes.
            </p>
            <p style={styles.session1StatusSub}>
              Your personalized strategic materials begin unlocking after Session 1 because Robert uses your intake responses and strategy conversation to build them specifically around your situation — not from a generic template.
            </p>
            {call1Complete
              ? <div style={styles.submittedBadge}>✓ SESSION 1 COMPLETE — Your personalized materials are now unlocked</div>
              : <button style={{ ...styles.btnSecondary, marginTop: 16 }} onClick={() => update("call1_complete", true)}>MARK SESSION 1 COMPLETE</button>
            }
          </div>
        )}
      </section>

      {/* ── SECTION 2: SESSION BOOKING ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 2 · SESSION BOOKING</SectionLabel>
        <GuidedNote>Book both sessions after completing your intake. Session 1 first, Session 2 after your framework is delivered.</GuidedNote>
        <p style={styles.sectionCtx}>Book your strategy sessions at a pace that feels intentional and manageable for you. Session 1 becomes available immediately after completing your Strategic Intake Form and is designed to help identify your financial patterns, pressure points, structural gaps, and highest-priority focus areas. Session 2 is scheduled after Session 1 and focuses on reviewing your personalized Strategic Framework, implementation priorities, and next-step execution plan together. These sessions are designed to create clarity, structure, and direction, not overwhelm. Take your time, choose the schedule that works best for you, and arrive ready for an honest strategic conversation about where you are and where you want to go next.</p>

        <RobertNote>
          Both sessions are private strategy calls. Come prepared to have an honest conversation about your financial situation. I will have reviewed your intake form before we meet, so we will not spend time on background. We will get straight to strategy.
        </RobertNote>

        <div style={styles.bookingGrid}>
          <div style={styles.bookingCard}>
            <div style={styles.bookingBadge}>SESSION 1 OF 2</div>
            <div style={styles.bookingIcon}>📅</div>
            <h3 style={styles.bookingTitle}>Strategic Reality Session</h3>
            <p style={styles.bookingDesc}>Your first 30-minute private strategy session. This session reviews your intake responses, identifies your highest-leverage pressure points, and builds the foundation of your personalized strategic framework.</p>
            <div style={styles.bookingMeta}>
              {[["DURATION", "30 minutes"], ["FORMAT", "Private video call"], ["REQUIREMENT", "Intake form completed"]].map(([l, v]) => (
                <div key={l} style={styles.bookingMetaRow}><span style={styles.bookingMetaLabel}>{l}</span><span style={styles.bookingMetaVal}>{v}</span></div>
              ))}
            </div>
            {call1Complete
              ? <div style={styles.sessionDoneBadge}>✓ SESSION 1 COMPLETE</div>
              : <a href={CALENDLY_PRE} target="_blank" rel="noopener noreferrer" style={{ ...styles.btnPrimary, display: "block", textAlign: "center", textDecoration: "none" }}>BOOK SESSION 1</a>
            }
          </div>

          <div style={{ ...styles.bookingCard, ...(call1Complete ? {} : { opacity: 0.55 }) }}>
            <div style={styles.bookingBadge}>SESSION 2 OF 2</div>
            <div style={styles.bookingIcon}>{call1Complete ? "📅" : "🔒"}</div>
            <h3 style={styles.bookingTitle}>Strategic Implementation Session</h3>
            <p style={styles.bookingDesc}>Your second 30-minute session. This session reviews your 90-Day Roadmap, confirms your Decision Rules and Financial Policy, and closes with your complete Strategic Operating Framework and implementation path.</p>
            <div style={styles.bookingMeta}>
              {[["DURATION", "30 minutes"], ["FORMAT", "Private video call"], ["REQUIREMENT", "Session 1 complete"]].map(([l, v]) => (
                <div key={l} style={styles.bookingMetaRow}><span style={styles.bookingMetaLabel}>{l}</span><span style={styles.bookingMetaVal}>{v}</span></div>
              ))}
            </div>
            {call2Complete
              ? <div style={styles.sessionDoneBadge}>✓ SESSION 2 COMPLETE</div>
              : call1Complete
                ? <a href={CALENDLY_POST} target="_blank" rel="noopener noreferrer" style={{ ...styles.btnPrimary, display: "block", textAlign: "center", textDecoration: "none" }}>BOOK SESSION 2</a>
                : <div style={styles.lockedBtn}>UNLOCKS AFTER SESSION 1</div>
            }
          </div>
        </div>

        {call1Complete && !call2Complete && (
          <div style={{ marginTop: 14 }}>
            <button style={styles.btnSecondary} onClick={() => update("call2_complete", true)}>MARK SESSION 2 COMPLETE</button>
          </div>
        )}
        {call2Complete && <div style={{ ...styles.submittedBadge, marginTop: 14 }}>✓ BOTH SESSIONS COMPLETE</div>}
      </section>

      {/* ── SECTION 3: MATRIX SCORE ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 3 · FULL MATRIX SCORE AND STRUCTURAL ANALYSIS</SectionLabel>
        <GuidedNote>This section will be completed after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          This personalized operational analysis is designed to identify the financial behaviors, stress patterns, structural gaps, and decision-making cycles currently shaping your financial reality.
        </p>
        <p style={styles.sectionCtx}>
          Most people know they feel financial pressure. Very few understand the systems, habits, and recurring patterns creating that pressure repeatedly.
        </p>
        <p style={styles.sectionCtx}>
          Your Full Matrix Score and Structural Analysis is designed to help clarify where your system is breaking down, what is creating the most pressure, what behaviors are repeating, and what changes will create the greatest impact moving forward.
        </p>
        <p style={styles.sectionCtx}>
          The goal is not judgment. The goal is awareness, clarity, and intentional financial operation. Robert personally develops this analysis after reviewing your intake responses and your first strategy session together.
        </p>
        <RobertNote>
          Your Matrix Score is not a grade. It is a map. It shows where your financial system has gaps and where the highest-leverage changes are. The score itself is less important than the pattern it reveals.
        </RobertNote>
        <WhyMatters>
          Understanding your scores across all five dimensions reveals which specific area is creating the most financial drag. Most clients discover their lowest score is not where they expected it to be.
        </WhyMatters>
        <LockedSection unlocked={call1Complete} message="Your full behavioral and financial matrix score will appear here — a detailed breakdown of how your money patterns, stress responses, and financial structure interact. This gives you a clear picture of where you stand and why.">
          <div style={styles.matrixGrid}>
            {[
              { key: "sc_awareness",  name: "Awareness",          desc: "How clearly you see where your money goes and what drives your decisions." },
              { key: "sc_pattern",    name: "Money Pattern",      desc: "How consistently you handle income, expenses, and unexpected funds." },
              { key: "sc_stress",     name: "Stress Response",    desc: "How you respond when financial pressure builds or problems arise." },
              { key: "sc_structure",  name: "Financial Structure", desc: "The systems and habits you have in place to manage your finances." },
              { key: "sc_readiness",  name: "System Readiness",   desc: "Your ability and mindset to build and follow a financial plan." },
            ].map(comp => (
              <div key={comp.key} style={styles.matrixCard}>
                <div style={styles.matrixName}>{comp.name}</div>
                <div style={styles.matrixDesc}>{comp.desc}</div>
                <PersonalizedField
                  label={comp.name}
                  id={comp.key}
                  data={data}
                  update={update}
                  unlocked={call1Complete}
                  singleLine
                  displayAs="score"
                />
              </div>
            ))}
          </div>
          <PersonalizedField label="STRUCTURAL ANALYSIS" id="structural_analysis" data={data} update={update} unlocked={call1Complete} rows={6} />
        </LockedSection>
      </section>

      {/* ── SECTION 4: STRATEGIC FRAMEWORK ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 4 · PERSONALIZED STRATEGIC OPERATING FRAMEWORK</SectionLabel>
        <GuidedNote>This section will be ready after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          After Session 1, Robert personally develops a Strategic Operating Framework built entirely around your financial reality, pressure points, goals, and implementation capacity.
        </p>
        <p style={styles.sectionCtx}>
          This is not a generic financial template. It is a personalized operational system that will include your strategic financial priorities, a structural gap analysis, a personalized strategic action plan, decision rules and financial policies, system recommendations, a pressure reduction strategy, 90-day strategic execution priorities, and behavioral and pattern insights.
        </p>
        <p style={styles.sectionCtx}>
          Most people do not need more financial information. They need a clearer operational framework for how to move forward intentionally. That is what this section delivers.
        </p>
        <RobertNote>
          Your Strategic Operating Framework is not a generic plan. It was built around your specific answers, your situation, and your goals. Every element here was chosen because it addresses a gap in your current financial system.
        </RobertNote>
        <LockedSection unlocked={call1Complete} message="Your personal operating framework will live here — a custom set of financial principles and priorities built around how you think, earn, spend, and make decisions. This is your financial system, not a generic template.">
          <div style={styles.frameworkGrid}>
            {[
              { id: "fw_priority",  label: "PRIMARY STRATEGIC PRIORITY",   pendingText: "The single most important financial move for you right now — based on your income, obligations, stress patterns, and goals. Everything else is sequenced around this." },
              { id: "fw_structure", label: "STRUCTURAL FOUNDATION",         pendingText: "The core structure your finances will be built on — accounts, flow, and allocation set up in a way that matches how you actually live and earn." },
              { id: "fw_behavior",  label: "BEHAVIORAL PROTOCOL",           pendingText: "A set of specific behavioral guidelines based on your identified money patterns — designed to reduce friction, prevent backsliding, and build consistency." },
              { id: "fw_income",    label: "INCOME AND STABILITY STRATEGY", pendingText: "A plan for protecting, growing, or stabilizing your income based on your current situation and what your numbers reveal about your earning patterns." },
              { id: "fw_debt",      label: "DEBT AND OBLIGATION FRAMEWORK", pendingText: "A clear strategy for how to handle your existing debt and financial obligations — prioritized, sequenced, and realistic based on your cash flow." },
              { id: "fw_build",     label: "WEALTH BUILDING PATHWAY",       pendingText: "The long-term path forward — where wealth building fits into your plan, when it starts, and what form it takes based on your timeline and goals." },
            ].map(f => (
              <div key={f.id} style={styles.frameworkCard}>
                <PersonalizedField label={f.label} id={f.id} data={data} update={update} unlocked={call1Complete} rows={4} pendingText={f.pendingText} />
              </div>
            ))}
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 5: DECISION RULES ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 5 · DECISION RULES AND FINANCIAL POLICY SYSTEM</SectionLabel>
        <GuidedNote>This section will be ready after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          This is not a budget. This is a personalized financial operating system designed to help you make clearer, more intentional decisions under pressure.
        </p>
        <p style={styles.sectionCtx}>
          Instead of constantly asking what you should do right now, you will operate from a clear set of rules designed around your specific situation, stress patterns, and financial priorities.
        </p>
        <p style={styles.sectionCtx}>
          Robert builds these rules after Session 1 based on your intake responses, behavioral patterns, and strategic conversation. They will include spending decision rules, savings policies, debt management rules, a financial pressure response framework, and a weekly financial operating rhythm.
        </p>
        <p style={styles.sectionCtx}>
          Most financial mistakes happen during moments of stress, urgency, and emotional pressure — not because of lack of intelligence. This system is designed to reduce those moments.
        </p>
        <RobertNote>
          Decision rules are the most practical element of your reset. When you are under financial pressure, you will not have the mental bandwidth to make thoughtful decisions. These rules make the decision in advance so you do not have to.
        </RobertNote>
        <WhyMatters>
          Without decision rules, financial choices get made emotionally, reactively, or under pressure. A written financial policy removes the variable of mood and circumstance from your most important decisions.
        </WhyMatters>
        <LockedSection unlocked={call1Complete} message="Your personal spending, saving, debt, and income rules will be defined here after your Strategy Session. These become the financial boundaries you operate within going forward.">
          {[
            { id: "rule_spending",  label: "SPENDING RULE",      pendingText: "Your personal cap or guideline for discretionary spending — defined during your session based on your income, obligations, and behavioral patterns." },
            { id: "rule_saving",    label: "SAVING RULE",         pendingText: "The saving rate or method that works for your situation — not a generic percentage, but a rule built around your actual cash flow." },
            { id: "rule_debt",      label: "DEBT RULE",           pendingText: "How you will handle debt repayment — which debts, in what order, at what pace — based on your full financial picture." },
            { id: "rule_income",    label: "INCOME RULE",         pendingText: "How you treat and allocate income when it arrives — including irregular or variable income — so money has a job before it disappears." },
            { id: "rule_emergency", label: "EMERGENCY FUND RULE", pendingText: "Your target emergency fund amount and the plan to build or maintain it based on your expenses, risk tolerance, and income stability." },
            { id: "rule_invest",    label: "INVESTMENT RULE" },
          ].map(r => (
            <div key={r.id} style={styles.ruleCard}>
              <PersonalizedField label={r.label} id={r.id} data={data} update={update} unlocked={call1Complete} rows={2} pendingText={r.pendingText} />
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <PersonalizedField label="ADDITIONAL FINANCIAL POLICIES" id="rule_additional" data={data} update={update} unlocked={call1Complete} rows={4} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 6: 90-DAY ROADMAP ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 6 · CUSTOM 90-DAY ROADMAP</SectionLabel>
        <GuidedNote>This section will be completed after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          Your 90-Day Strategic Reset Roadmap is a phased implementation plan designed to reduce overwhelm by focusing on the highest-impact changes first. Each phase builds intentionally on the previous one.
        </p>
        <p style={styles.sectionCtx}>
          This is not a generic timeline. It will be built specifically around your situation, priorities, and implementation capacity after Session 1.
        </p>
        <p style={styles.sectionCtx}>
          The roadmap moves through three phases: Month 1 Stabilization to reduce financial chaos and create visibility, Month 2 Control to build consistency and reduce reactive decision-making, and Month 3 Positioning to transition into intentional financial positioning.
        </p>
        <p style={styles.sectionCtx}>
          The goal is not perfection. The goal is to replace financial reaction with financial structure — one system, one decision, and one week at a time.
        </p>
        <RobertNote>
          The 90-day structure is intentional. Most financial change fails not because people lack motivation but because they try to change everything at once. This roadmap sequences your changes so each one builds on the previous.
        </RobertNote>
        <WhyMatters>
          A 90-day roadmap creates sequenced momentum. Each phase builds the foundation for the next. Without a roadmap, implementation becomes reactive and inconsistent.
        </WhyMatters>
        <LockedSection unlocked={call1Complete} message="Your 90-day action plan will appear here — broken into three phases with specific steps, priorities, and targets based on your goals and current financial position.">
          {[
            { id: "road_30", label: "DAYS 1–30: FOUNDATION",   sub: "Stabilization and structure installation", pendingText: "The first 30 days focus on stabilization — stopping financial leaks, installing structure, and building the habits that everything else depends on." },
            { id: "road_60", label: "DAYS 31–60: MOMENTUM",    sub: "Consistency and behavioral reinforcement",  pendingText: "The middle phase focuses on consistency — reinforcing new behaviors, adjusting what isn't working, and building confidence in your system." },
            { id: "road_90", label: "DAYS 61–90: POSITIONING", sub: "Advancement and future alignment",          pendingText: "The final phase focuses on advancement — moving from stability to growth and setting up the next chapter of your financial life." },
          ].map(phase => (
            <div key={phase.id} style={styles.roadmapPhase}>
              <div style={styles.roadmapPhaseHeader}>
                <div style={styles.roadmapPhaseLabel}>{phase.label}</div>
                <div style={styles.roadmapPhaseSub}>{phase.sub}</div>
              </div>
              <PersonalizedField label={phase.label} id={phase.id} data={data} update={update} unlocked={call1Complete} rows={5} hideLabel pendingText={phase.pendingText} />
            </div>
          ))}
          <div style={styles.roadmapOutcome}>
            <PersonalizedField label="90-DAY TARGET OUTCOME" id="road_outcome" data={data} update={update} unlocked={call1Complete} rows={3} pendingText="The specific, measurable result you and Robert have agreed to work toward by the end of 90 days. This is your north star for the entire plan." />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 7: SESSION NOTES ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 7 · SESSION NOTES AND DELIVERABLES</SectionLabel>
        <GuidedNote>This section will be ready after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          After each session, Robert personally prepares detailed notes summarizing key insights, identified patterns, strategic priorities, and implementation guidance from your conversation.
        </p>
        <p style={styles.sectionCtx}>
          These notes are designed to help you revisit your plan clearly at any time, stay focused on your highest-priority actions, reference your strategic direction during implementation, and maintain clarity and momentum between sessions.
        </p>
        <p style={styles.sectionCtx}>
          Session 1 notes will be posted here after your first call. Session 2 notes will be posted after your implementation review session.
        </p>
        <LockedSection unlocked={call1Complete}>
          <div style={styles.notesGrid}>
            <div style={styles.notesCard}>
              <div style={styles.notesCardLabel}>SESSION 1 NOTES</div>
              {data.session1_date && <div style={styles.notesDate}>{data.session1_date}</div>}
              <PersonalizedField label="SESSION 1 NOTES" id="session1_notes" data={data} update={update} unlocked={call1Complete} rows={8} hideLabel />
              <div style={{ marginTop: 14 }}>
                <label style={styles.fieldLabel}>SESSION 1 DATE</label>
                <input value={data.session1_date || ""} onChange={e => update("session1_date", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
            </div>
            <div style={{ ...styles.notesCard, ...(call2Complete ? {} : { opacity: 0.6 }) }}>
              <div style={styles.notesCardLabel}>SESSION 2 NOTES</div>
              {data.session2_date && <div style={styles.notesDate}>{data.session2_date}</div>}
              <PersonalizedField label="SESSION 2 NOTES" id="session2_notes" data={data} update={update} unlocked={!!call2Complete} rows={8} hideLabel />
              <div style={{ marginTop: 14 }}>
                <label style={styles.fieldLabel}>SESSION 2 DATE</label>
                <input value={data.session2_date || ""} onChange={e => update("session2_date", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <PersonalizedField label="KEY DELIVERABLES AND ACTION COMMITMENTS" id="deliverables" data={data} update={update} unlocked={call1Complete} rows={4} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 8: 60-DAY SUPPORT ── */}
      <section style={{ ...styles.section, paddingBottom: 80 }}>
        <SectionLabel>SECTION 8 · 60-DAY PRIORITY EMAIL SUPPORT</SectionLabel>
        <GuidedNote>This section will be completed after your Strategy Session and will unlock automatically.</GuidedNote>
        <p style={styles.sectionCtx}>
          Your 60-Day Priority Support begins immediately after your Strategic Framework is delivered. This is not unlimited open access. It is structured implementation support designed to help you maintain momentum, reduce confusion, and continue building consistency while your new financial systems are being put into practice.
        </p>
        <p style={styles.sectionCtx}>
          Most financial plans fail during implementation — not because the plan was wrong, but because stress, pressure, and old patterns return. This support window exists to interrupt that cycle before it gains momentum.
        </p>
        <p style={styles.sectionCtx}>
          During your 60-day support period you have direct priority email access for questions and clarification about your framework, guidance while applying your decision rules and policies, support evaluating important financial decisions, accountability and momentum during implementation, and strategic direction when pressure or uncertainty arises.
        </p>
        <p style={styles.sectionCtx}>
          The goal is not dependency. The goal is helping you build enough structure that your systems continue operating long after the support period ends.
        </p>
        <RobertNote>
          Use this support period intentionally. Bring your implementation questions, your pressure points, your decisions. The 60-day period is most effective when it is used as active strategic guidance rather than passive reassurance.
        </RobertNote>
        <WhyMatters>
          Strategic questions answered quickly save months of uncertainty. Use this access for decisions that feel unclear, situations that feel financially pressured, and moments where you need a second perspective.
        </WhyMatters>
        <LockedSection unlocked={call1Complete} message="After your Strategy Session, you will have direct email access for questions, adjustments, and accountability check-ins for 60 days. Details and instructions will appear here once your session is complete.">
          <div style={styles.supportBox}>
            <div style={styles.supportHeader}>
              <div style={styles.supportTitle}>PRIORITY EMAIL SUPPORT</div>
              <div style={styles.supportPeriod}>{data.support_start ? `Started: ${data.support_start}` : "60-day period begins after Session 2"}</div>
            </div>
            <p style={styles.supportDesc}>Your 60-day priority email support period begins immediately after Session 2. Use it for strategic questions, implementation decisions, pressure-point guidance, and accountability. Response within 24 to 48 business hours.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={styles.fieldLabel}>SUPPORT START DATE</label>
                <input value={data.support_start || ""} onChange={e => update("support_start", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
              <div>
                <label style={styles.fieldLabel}>SUPPORT END DATE</label>
                <input value={data.support_end || ""} onChange={e => update("support_end", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
            </div>
            <PersonalizedField label="SUPPORT LOG" id="support_log" data={data} update={update} unlocked={call1Complete} rows={10} />
          </div>
        </LockedSection>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerQuote}>
          <p style={{ margin: "0 0 12px" }}>This process is not about becoming perfect financially.</p>
          <p style={{ margin: "0 0 12px" }}>It is about building systems strong enough to create clarity, consistency, and intentional direction long after the reset is complete.</p>
          <p style={{ margin: "0 0 12px" }}>You do not need to solve everything immediately. You simply need to stay honest, intentional, and committed to building stronger structure one decision at a time.</p>
          <p style={{ margin: "0 0 16px" }}>Most people remain financially reactive because they never stop long enough to build systems intentionally. You are doing that now. And that matters.</p>
          <p style={{ margin: 0, color: "#C4960F" }}>— Robert, ETFM</p>
        </div>
        <span style={styles.footerLogo}>ETFM</span>
      </footer>
    </div>
  );
}

/* ── SHARED COMPONENTS ── */

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
      <span style={{ color: "#C4960F", fontSize: 11, letterSpacing: 4 }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "#e8e3da" }} />
    </div>
  );
}

function GuidedNote({ children }) {
  return (
    <div style={styles.guidedNote}>
      <span style={styles.guidedNoteIcon}>→</span>
      <span style={styles.guidedNoteText}>{children}</span>
    </div>
  );
}

function RobertNote({ children }) {
  return (
    <div style={styles.robertNote}>
      <div style={styles.robertNoteLabel}>A NOTE FROM ROBERT</div>
      <p style={styles.robertNoteText}>{children}</p>
    </div>
  );
}

function WhyMatters({ children }) {
  return (
    <div style={styles.whyBox}>
      <div style={styles.whyLabel}>WHY THIS MATTERS</div>
      <p style={styles.whyText}>{children}</p>
    </div>
  );
}

function PersonalizedField({ label, id, data, update, unlocked, rows = 4, hideLabel = false, singleLine = false, displayAs, pendingText }) {
  const value = data[id] || "";
  if (!hideLabel && !singleLine) {
    // full label + field
  }
  if (unlocked && value) {
    if (displayAs === "score") {
      return (
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#1a1a2e", marginBottom: 6 }}>{value}<span style={{ fontSize: 13, color: "#4a4a4a" }}> / 100</span></div>
          <input value={value} onChange={e => update(id, e.target.value)} style={{ ...styles.input, fontSize: 13 }} />
        </div>
      );
    }
    return (
      <div>
        {!hideLabel && <label style={styles.fieldLabel}>{label}</label>}
        {singleLine
          ? <input value={value} onChange={e => update(id, e.target.value)} style={styles.input} />
          : <textarea value={value} onChange={e => update(id, e.target.value)} rows={rows} style={styles.textarea} />
        }
      </div>
    );
  }
  if (unlocked && !value) {
    if (displayAs === "score") {
      return <input value="" onChange={e => update(id, e.target.value)} placeholder="Enter score" style={{ ...styles.input, marginTop: 6, fontSize: 13 }} />;
    }
    return (
      <div>
        {!hideLabel && <label style={styles.fieldLabel}>{label}</label>}
        {singleLine
          ? <input value="" onChange={e => update(id, e.target.value)} style={styles.input} />
          : <textarea value="" onChange={e => update(id, e.target.value)} rows={rows} style={styles.textarea} />
        }
      </div>
    );
  }
  // Locked — show pending card
  return (
    <div style={styles.pendingCard}>
      {!hideLabel && <div style={styles.pendingCardLabel}>{label}</div>}
      <p style={styles.pendingCardText}>{pendingText || "This field will be ready after your Strategy Session."}</p>
    </div>
  );
}

function LockedSection({ unlocked, children, message }) {
  if (unlocked) return <div>{children}</div>;
  return (
    <div>
      <div style={styles.lockedBanner}>
        <div style={styles.lockedBannerTitle}>🔒 PERSONALIZED MATERIAL IN DEVELOPMENT</div>
        <p style={styles.lockedBannerText}>
          {message || "This section unlocks after your Strategy Session. The content here is built specifically for you — not from a template — and will be ready once your session is complete."}
        </p>
      </div>
      <div style={{ opacity: 0.6, pointerEvents: "none", userSelect: "none" }}>{children}</div>
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  page:           { fontFamily: "'Inter', sans-serif", background: "#FAFAF8", color: "#1a1a2e", minHeight: "100vh" },
  nav:            { background: "#ffffff", borderBottom: "1px solid #e8e3da", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo:           { fontFamily: "Georgia, serif", color: "#C4960F", fontSize: 24, letterSpacing: 6 },
  logoSub:        { color: "#4a4a4a", fontSize: 11, letterSpacing: 4, marginTop: 3 },
  navName:        { color: "#4a4a4a", fontSize: 13 },
  navStep:        { color: "#C4960F", fontSize: 12, letterSpacing: 2, marginTop: 3 },
  saveToast:      { position: "fixed", top: 16, right: 16, background: "#fff8e8", border: "1px solid #C4960F", color: "#C4960F", fontSize: 12, padding: "8px 16px", zIndex: 9999, letterSpacing: 1 },
  hero:           { padding: "60px 40px 52px", borderBottom: "1px solid #e8e3da" },
  heroLabel:      { color: "#C4960F", fontSize: 12, letterSpacing: 5, marginBottom: 20 },
  heroTitle:      { fontFamily: "Georgia, serif", fontSize: 36, color: "#1a1a2e", fontWeight: 400, lineHeight: 1.15, marginBottom: 20 },
  congratsBox:    { background: "#ffffff", borderLeft: "2px solid #C4960F", padding: "22px 28px", marginBottom: 0, maxWidth: 680 },
  congratsLabel:  { color: "#C4960F", fontSize: 11, letterSpacing: 4, marginBottom: 12 },
  congratsText:   { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#4a4a4a", fontSize: 17, lineHeight: 2, margin: 0 },
  section:        { padding: "50px 40px 0" },
  sectionCtx:     { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, marginBottom: 16, fontWeight: 300, maxWidth: 700 },
  // Guided note
  guidedNote:     { display: "flex", alignItems: "baseline", gap: 10, background: "#F0EDE8", border: "1px solid #e8e3da", padding: "10px 16px", marginBottom: 20 },
  guidedNoteIcon: { color: "#C4960F", fontSize: 13, flexShrink: 0 },
  guidedNoteText: { color: "#4a4a4a", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" },
  // Status card
  statusGrid:         { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 2 },
  statusTile:         { background: "#ffffff", border: "1px solid #e8e3da", padding: "18px 20px" },
  statusTileLabel:    { color: "#4a4a4a", fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  statusTileVal:      { color: "#1a1a2e", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: 6 },
  statusTileSub:      { color: "#4a4a4a", fontSize: 11, lineHeight: 1.6, fontWeight: 300 },
  statusNextAction:   { background: "#fff8e8", border: "1px solid #C4960F", padding: "16px 20px" },
  statusNextLabel:    { color: "#C4960F", fontSize: 10, letterSpacing: 3, flexShrink: 0 },
  statusNextVal:      { color: "#1a1a2e", fontSize: 14, fontFamily: "Georgia, serif" },
  statusNextSub:      { color: "#4a4a4a", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, margin: "6px 0 0", fontFamily: "Georgia, serif" },
  // Process steps
  processGrid:        { display: "flex", flexDirection: "column", gap: 2 },
  processStep:        { background: "#ffffff", border: "1px solid #e8e3da", padding: "16px 22px", display: "flex", alignItems: "flex-start", gap: 16 },
  processStepDone:    { borderColor: "#4A8A4A", background: "#f0f8f0" },
  processNum:         { color: "#C4960F", fontSize: 18, fontFamily: "Georgia, serif", minWidth: 28, flexShrink: 0, paddingTop: 2 },
  processNumDone:     { color: "#4A8A4A" },
  processText:        { color: "#1a1a2e", fontSize: 14, lineHeight: 1.5, fontWeight: 500, marginBottom: 4 },
  processDesc:        { color: "#4a4a4a", fontSize: 13, lineHeight: 1.7, fontWeight: 300 },
  processBadge:       { marginLeft: "auto", flexShrink: 0, background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 11, padding: "3px 10px", letterSpacing: 1, whiteSpace: "nowrap" },
  processClosing:     { background: "#F0EDE8", border: "1px solid #e8e3da", borderLeft: "2px solid #C4960F", padding: "20px 24px", marginTop: 10, color: "#4a4a4a", fontSize: 14, lineHeight: 1.9, fontWeight: 300 },
  // Session 1 status block (in Section 1)
  session1StatusBlock:  { background: "#ffffff", border: "1px solid #e8e3da", borderTop: "2px solid #C4960F", padding: "28px 32px", marginTop: 20 },
  session1StatusLabel:  { color: "#C4960F", fontSize: 10, letterSpacing: 4, marginBottom: 14 },
  session1StatusText:   { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, fontWeight: 300, marginBottom: 12 },
  session1StatusSub:    { color: "#4a4a4a", fontSize: 13, lineHeight: 1.8, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 0 },
  // RobertNote
  robertNote:         { borderLeft: "3px solid #C4960F", background: "#fff8e8", padding: "16px 22px", marginBottom: 20 },
  robertNoteLabel:    { color: "#C4960F", fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  robertNoteText:     { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, fontStyle: "italic", fontFamily: "Georgia, serif", margin: 0 },
  // WhyMatters
  whyBox:             { background: "#F0EDE8", border: "1px solid #e8e3da", padding: "14px 18px", marginBottom: 16 },
  whyLabel:           { color: "#C4960F", fontSize: 10, letterSpacing: 3, marginBottom: 6 },
  whyText:            { color: "#4a4a4a", fontSize: 13, lineHeight: 1.7, fontWeight: 300, margin: 0 },
  // Locked banner
  lockedBanner:       { background: "#fff8e8", border: "1px solid #C4960F", padding: "20px 24px", marginBottom: 16 },
  lockedBannerTitle:  { color: "#C4960F", fontSize: 12, letterSpacing: 2, marginBottom: 10 },
  lockedBannerText:   { color: "#4a4a4a", fontSize: 13, lineHeight: 1.8, fontWeight: 300, margin: 0 },
  // Pending card (personalized field locked state)
  pendingCard:        { background: "#F0EDE8", border: "1px solid #e8e3da", padding: "16px 18px", marginBottom: 4 },
  pendingCardLabel:   { color: "#C4960F", fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  pendingCardText:    { color: "#4a4a4a", fontSize: 13, lineHeight: 1.7, fontWeight: 300, fontStyle: "italic", margin: 0 },
  // Progress
  progressWrap:   { background: "#ffffff", border: "1px solid #e8e3da", padding: "20px 24px", marginBottom: 12 },
  progressLabel:  { color: "#C4960F", fontSize: 11, letterSpacing: 3 },
  progressVal:    { color: "#4a4a4a", fontSize: 13 },
  progressTrack:  { background: "#e8e3da", height: 4, borderRadius: 2 },
  progressFill:   { background: "#C4960F", height: 4, borderRadius: 2, transition: "width 0.4s ease" },
  // Intake accordion
  intakeSec:      { background: "#ffffff", border: "1px solid #e8e3da", marginBottom: 4 },
  intakeSecOpen:  { borderColor: "#C4960F", background: "#FDFCFA" },
  intakeHeader:   { width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  intakeNum:      { color: "#C4960F", fontSize: 20, fontFamily: "Georgia, serif", minWidth: 32 },
  intakeSecLabel: { color: "#1a1a2e", fontSize: 13, letterSpacing: 2, textAlign: "left" },
  intakeProgress: { color: "#4a4a4a", fontSize: 12, marginTop: 3, textAlign: "left" },
  checkBadge:     { background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 12, padding: "2px 8px" },
  chevron:        { color: "#4a4a4a", fontSize: 12 },
  intakeBody:     { padding: "4px 22px 22px", borderTop: "1px solid #e8e3da", background: "#FDFCFA" },
  intakeDesc:     { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, fontStyle: "italic", marginTop: 16, marginBottom: 20, fontWeight: 300 },
  // Fields
  fieldLabel:     { display: "block", color: "#1a1a2e", fontSize: 12, letterSpacing: 2, marginBottom: 6 },
  input:          { width: "100%", background: "#ffffff", border: "1px solid #e8e3da", color: "#1a1a2e", fontSize: 15, padding: "10px 14px", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" },
  textarea:       { width: "100%", background: "#ffffff", border: "1px solid #e8e3da", color: "#1a1a2e", fontSize: 15, padding: "10px 14px", fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" },
  submittedBadge: { background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 13, letterSpacing: 1, padding: "14px 20px", textAlign: "center" },
  // Buttons
  btnPrimary:     { background: "#C4960F", color: "#ffffff", border: "none", padding: "13px 28px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 },
  btnSecondary:   { background: "transparent", color: "#C4960F", border: "1px solid #C4960F", padding: "13px 28px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Inter, sans-serif" },
  lockedBtn:      { background: "#F0EDE8", border: "1px solid #d0ccc4", color: "#4a4a4a", fontSize: 11, letterSpacing: 2, padding: "13px 20px", textAlign: "center" },
  // Booking
  bookingGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  bookingCard:    { background: "#ffffff", border: "1px solid #e8e3da", borderTop: "2px solid #C4960F", padding: 32 },
  bookingBadge:   { color: "#C4960F", fontSize: 11, letterSpacing: 3, marginBottom: 16 },
  bookingIcon:    { fontSize: 28, marginBottom: 12 },
  bookingTitle:   { fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a2e", fontWeight: 400, marginBottom: 12 },
  bookingDesc:    { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, fontWeight: 300, marginBottom: 20 },
  bookingMeta:    { background: "#F0EDE8", padding: "14px 18px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 },
  bookingMetaRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  bookingMetaLabel: { color: "#4a4a4a", fontSize: 11, letterSpacing: 2 },
  bookingMetaVal: { color: "#1a1a2e", fontSize: 13, fontWeight: 500 },
  sessionDoneBadge: { background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 12, padding: "13px 20px", textAlign: "center" },
  // Matrix
  matrixGrid:     { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 },
  matrixCard:     { background: "#F0EDE8", border: "1px solid #e8e3da", padding: 16 },
  matrixName:     { color: "#C4960F", fontSize: 13, letterSpacing: 1, marginBottom: 4 },
  matrixDesc:     { color: "#4a4a4a", fontSize: 12, lineHeight: 1.6, fontWeight: 300, marginBottom: 8 },
  // Framework
  frameworkGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  frameworkCard:  { background: "#ffffff", border: "1px solid #e8e3da", padding: 20 },
  // Decision rules
  ruleCard:       { background: "#ffffff", border: "1px solid #e8e3da", padding: 18, marginBottom: 8 },
  // Roadmap
  roadmapPhase:       { background: "#ffffff", border: "1px solid #e8e3da", padding: 24, marginBottom: 10 },
  roadmapPhaseHeader: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 },
  roadmapPhaseLabel:  { color: "#C4960F", fontSize: 13, letterSpacing: 2 },
  roadmapPhaseSub:    { color: "#4a4a4a", fontSize: 13, fontStyle: "italic" },
  roadmapOutcome:     { background: "#F0EDE8", border: "1px solid #e8e3da", borderLeft: "2px solid #C4960F", padding: "20px 24px", marginTop: 16 },
  // Notes
  notesGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  notesCard:      { background: "#ffffff", border: "1px solid #e8e3da", padding: 24 },
  notesCardLabel: { color: "#C4960F", fontSize: 11, letterSpacing: 3, marginBottom: 6 },
  notesDate:      { color: "#4a4a4a", fontSize: 13, fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 14 },
  // Support
  supportBox:     { background: "#ffffff", border: "1px solid #e8e3da", padding: 28 },
  supportHeader:  { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #e8e3da", paddingBottom: 14, marginBottom: 14 },
  supportTitle:   { color: "#C4960F", fontSize: 13, letterSpacing: 3 },
  supportPeriod:  { color: "#4a4a4a", fontSize: 13, fontFamily: "Georgia, serif", fontStyle: "italic" },
  supportDesc:    { color: "#4a4a4a", fontSize: 15, lineHeight: 1.9, fontWeight: 300, marginBottom: 20 },
  // Footer
  footer:         { margin: "56px 40px 0", borderTop: "1px solid #e8e3da", paddingTop: 32, paddingBottom: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40 },
  footerQuote:    { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#4a4a4a", fontSize: 14, lineHeight: 1.9, maxWidth: 600 },
  footerLogo:     { color: "#4a4a4a", fontFamily: "Georgia, serif", fontSize: 20, letterSpacing: 4, flexShrink: 0 },
};
