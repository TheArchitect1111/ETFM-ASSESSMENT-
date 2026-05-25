import { useState } from "react";

const STORAGE_KEY = "etfm_strategic_data";

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
  const progressPct = Math.round((answeredCount / TOTAL_Q) * 100);
  const intakeComplete = data.intake_submitted;
  const call1Complete = data.call1_complete;
  const call2Complete = data.call2_complete;

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
        <div style={{textAlign:"center", marginBottom:"20px"}}>
          <p style={{fontFamily:"Georgia, serif", color:"#C4960F", fontSize:"28px", letterSpacing:"6px", margin:"0"}}>ETFM</p>
          <p style={{color:"#5A5A6A", fontSize:"10px", letterSpacing:"4px", margin:"4px 0 0"}}>ESCAPE THE FINANCIAL MATRIX</p>
        </div>
        <div style={styles.heroLabel}>YOUR STRATEGIC RESET PARTNERSHIP</div>
        <h1 style={styles.heroTitle}>Private Client<br />Strategic Dashboard</h1>
        <div style={styles.congratsBox}>
          <div style={styles.congratsLabel}>WELCOME</div>
          <p style={styles.congratsText}>
            You have made a serious decision. The Strategic Reset Partnership is not a course, a program, or a framework. It is a private, one-on-one strategic engagement built entirely around your specific financial situation, behaviors, and goals. Everything in this dashboard was designed for you.
          </p>
        </div>
        <p style={styles.heroTransition}>
          Begin with the Strategic Intake Form below. Complete all 38 questions before your first session. Your responses inform every section of this dashboard and allow your strategist to arrive at Session 1 fully prepared for your specific situation.
        </p>
      </section>

      {/* ── SECTION 1: INTAKE FORM ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 1 — STRATEGIC INTAKE FORM</SectionLabel>
        <p style={styles.sectionCtx}>38 questions across 7 areas. Complete this fully before your first session. Your answers are saved automatically and reviewed by Robert Brickey prior to Session 1.</p>

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
          <div style={styles.submittedBadge}>✓ INTAKE FORM SUBMITTED — Robert Brickey will review your responses before Session 1</div>
        )}
      </section>

      {/* ── SECTION 2: SESSION BOOKING ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 2 — SESSION BOOKING</SectionLabel>
        <p style={styles.sectionCtx}>Book both sessions at your convenience. Session 1 can be scheduled immediately after completing your intake form. Session 2 is booked after Session 1 is complete.</p>

        <div style={styles.bookingGrid}>
          <div style={styles.bookingCard}>
            <div style={styles.bookingBadge}>SESSION 1 OF 2</div>
            <div style={styles.bookingIcon}>📅</div>
            <h3 style={styles.bookingTitle}>Strategic Reality Session</h3>
            <p style={styles.bookingDesc}>Your first 30-minute private session with Robert Brickey. This session reviews your intake responses, identifies your highest-leverage pressure points, and builds the foundation of your personalized strategic framework.</p>
            <div style={styles.bookingMeta}>
              {[["DURATION", "30 minutes"], ["FORMAT", "Private video call"], ["REQUIREMENT", "Intake form completed"]].map(([l, v]) => (
                <div key={l} style={styles.bookingMetaRow}><span style={styles.bookingMetaLabel}>{l}</span><span style={styles.bookingMetaVal}>{v}</span></div>
              ))}
            </div>
            {call1Complete
              ? <div style={styles.sessionDoneBadge}>✓ SESSION 1 COMPLETE</div>
              : <a href="https://calendly.com/robertbrickey/strategic-session-1" target="_blank" rel="noopener noreferrer" style={{ ...styles.btnPrimary, display: "block", textAlign: "center", textDecoration: "none" }}>BOOK SESSION 1</a>
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
                ? <a href="https://calendly.com/robertbrickey/strategic-session-2" target="_blank" rel="noopener noreferrer" style={{ ...styles.btnPrimary, display: "block", textAlign: "center", textDecoration: "none" }}>BOOK SESSION 2</a>
                : <div style={styles.lockedBtn}>UNLOCKS AFTER SESSION 1</div>
            }
          </div>
        </div>

        <div style={styles.sessionNote}>
          After completing Session 1, mark it complete below to unlock your full Matrix Score, Strategic Framework, Decision Rules, 90-Day Roadmap, and Session Notes.
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {!call1Complete && (
            <button style={styles.btnSecondary} onClick={() => update("call1_complete", true)}>MARK SESSION 1 COMPLETE</button>
          )}
          {call1Complete && !call2Complete && (
            <button style={styles.btnSecondary} onClick={() => update("call2_complete", true)}>MARK SESSION 2 COMPLETE</button>
          )}
          {call2Complete && <div style={styles.submittedBadge}>✓ BOTH SESSIONS COMPLETE</div>}
        </div>
      </section>

      {/* ── SECTION 3: MATRIX SCORE ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 3 — FULL MATRIX SCORE AND STRUCTURAL ANALYSIS</SectionLabel>
        <p style={styles.sectionCtx}>Your complete five-component financial matrix analysis and structural breakdown, delivered after Session 1.</p>
        <LockedSection unlocked={call1Complete}>
          <div style={styles.matrixGrid}>
            {[
              { key: "sc_awareness",   name: "Awareness",          desc: "How clearly you see where your money goes and what drives your decisions." },
              { key: "sc_pattern",     name: "Money Pattern",      desc: "How consistently you handle income, expenses, and unexpected funds." },
              { key: "sc_stress",      name: "Stress Response",    desc: "How you respond when financial pressure builds or problems arise." },
              { key: "sc_structure",   name: "Financial Structure", desc: "The systems and habits you have in place to manage your finances." },
              { key: "sc_readiness",   name: "System Readiness",   desc: "Your ability and mindset to build and follow a financial plan." },
            ].map(comp => (
              <div key={comp.key} style={styles.matrixCard}>
                <div style={styles.matrixName}>{comp.name}</div>
                <div style={styles.matrixDesc}>{comp.desc}</div>
                <div style={styles.matrixScore}>{data[comp.key] || "—"}<span style={{ fontSize: 13, color: "#4a4a4a" }}> / 100</span></div>
                <input value={data[comp.key] || ""} onChange={e => update(comp.key, e.target.value)} placeholder="Enter score" style={{ ...styles.input, marginTop: 10, fontSize: 13 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <label style={styles.fieldLabel}>STRUCTURAL ANALYSIS</label>
            <textarea value={data.structural_analysis || ""} onChange={e => update("structural_analysis", e.target.value)} placeholder="Robert Brickey's structural analysis delivered after Session 1..." rows={6} style={styles.textarea} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 4: STRATEGIC FRAMEWORK ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 4 — PERSONALIZED STRATEGIC OPERATING FRAMEWORK</SectionLabel>
        <p style={styles.sectionCtx}>Your custom financial operating system built around your specific situation, goals, and pressure points. Delivered after Session 1.</p>
        <LockedSection unlocked={call1Complete}>
          <div style={styles.frameworkGrid}>
            {[
              { id: "fw_priority",  label: "PRIMARY STRATEGIC PRIORITY",   placeholder: "Your highest-leverage focus area based on your intake and Session 1..." },
              { id: "fw_structure", label: "STRUCTURAL FOUNDATION",         placeholder: "The core financial systems and behaviors to install first..." },
              { id: "fw_behavior",  label: "BEHAVIORAL PROTOCOL",           placeholder: "Specific behavioral changes and decision-making protocols for your situation..." },
              { id: "fw_income",    label: "INCOME AND STABILITY STRATEGY", placeholder: "Recommendations specific to your income structure and consistency..." },
              { id: "fw_debt",      label: "DEBT AND OBLIGATION FRAMEWORK", placeholder: "Prioritization and sequencing for your specific debt obligations..." },
              { id: "fw_build",     label: "WEALTH BUILDING PATHWAY",       placeholder: "The longer-term positioning and wealth-building strategy aligned with your goals..." },
            ].map(f => (
              <div key={f.id} style={styles.frameworkCard}>
                <div style={styles.frameworkLabel}>{f.label}</div>
                <textarea value={data[f.id] || ""} onChange={e => update(f.id, e.target.value)} placeholder={f.placeholder} rows={4} style={styles.textarea} />
              </div>
            ))}
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 5: DECISION RULES ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 5 — DECISION RULES AND FINANCIAL POLICY SYSTEM</SectionLabel>
        <p style={styles.sectionCtx}>Your personal financial policy: a set of clear rules that govern financial decisions so you never have to make them under pressure again.</p>
        <LockedSection unlocked={call1Complete}>
          <div style={styles.rulesIntro}>
            <p style={styles.rulesIntroText}>Decision rules remove the emotional variable from financial decisions. These rules are built specifically around your behavioral patterns, pressure points, and goals identified during intake and Session 1.</p>
          </div>
          {[
            { id: "rule_spending",   label: "SPENDING RULE" },
            { id: "rule_saving",     label: "SAVING RULE" },
            { id: "rule_debt",       label: "DEBT RULE" },
            { id: "rule_income",     label: "INCOME RULE" },
            { id: "rule_emergency",  label: "EMERGENCY FUND RULE" },
            { id: "rule_invest",     label: "INVESTMENT RULE" },
          ].map(r => (
            <div key={r.id} style={styles.ruleCard}>
              <div style={styles.ruleLabel}>{r.label}</div>
              <textarea value={data[r.id] || ""} onChange={e => update(r.id, e.target.value)} placeholder={`Your personal ${r.label.toLowerCase()} delivered after Session 1...`} rows={2} style={styles.textarea} />
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <label style={styles.fieldLabel}>ADDITIONAL FINANCIAL POLICIES</label>
            <textarea value={data.rule_additional || ""} onChange={e => update("rule_additional", e.target.value)} placeholder="Any additional policies specific to your situation..." rows={4} style={styles.textarea} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 6: 90-DAY ROADMAP ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 6 — CUSTOM 90-DAY ROADMAP</SectionLabel>
        <p style={styles.sectionCtx}>Your personalized 90-day execution plan with phase-by-phase milestones, specific actions, and measurable outcomes.</p>
        <LockedSection unlocked={call1Complete}>
          {[
            { id: "road_30", label: "DAYS 1–30: FOUNDATION",   sub: "Stabilization and structure installation", placeholder: "Specific actions, systems, and milestones for the first 30 days..." },
            { id: "road_60", label: "DAYS 31–60: MOMENTUM",    sub: "Consistency and behavioral reinforcement",  placeholder: "Specific actions, systems, and milestones for days 31 through 60..." },
            { id: "road_90", label: "DAYS 61–90: POSITIONING", sub: "Advancement and future alignment",           placeholder: "Specific actions, systems, and milestones for days 61 through 90..." },
          ].map(phase => (
            <div key={phase.id} style={styles.roadmapPhase}>
              <div style={styles.roadmapPhaseHeader}>
                <div style={styles.roadmapPhaseLabel}>{phase.label}</div>
                <div style={styles.roadmapPhaseSub}>{phase.sub}</div>
              </div>
              <textarea value={data[phase.id] || ""} onChange={e => update(phase.id, e.target.value)} placeholder={phase.placeholder} rows={5} style={styles.textarea} />
            </div>
          ))}
          <div style={styles.roadmapOutcome}>
            <label style={{ ...styles.fieldLabel, marginBottom: 10 }}>90-DAY TARGET OUTCOME</label>
            <textarea value={data.road_outcome || ""} onChange={e => update("road_outcome", e.target.value)} placeholder="The specific financial outcome you will reach by the end of 90 days..." rows={3} style={styles.textarea} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 7: SESSION NOTES ── */}
      <section style={styles.section}>
        <SectionLabel>SECTION 7 — SESSION NOTES AND DELIVERABLES</SectionLabel>
        <p style={styles.sectionCtx}>Detailed notes from both sessions, delivered by Robert Brickey after each call for your ongoing reference and implementation.</p>
        <LockedSection unlocked={call1Complete}>
          <div style={styles.notesGrid}>
            <div style={styles.notesCard}>
              <div style={styles.notesCardLabel}>SESSION 1 NOTES</div>
              <div style={styles.notesDate}>{data.session1_date || "Date pending"}</div>
              <textarea value={data.session1_notes || ""} onChange={e => update("session1_notes", e.target.value)} placeholder="Session 1 notes delivered by Robert Brickey after your first call..." rows={8} style={styles.textarea} />
              <div style={{ marginTop: 14 }}>
                <label style={styles.fieldLabel}>SESSION 1 DATE</label>
                <input value={data.session1_date || ""} onChange={e => update("session1_date", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
            </div>
            <div style={{ ...styles.notesCard, ...(call2Complete ? {} : { opacity: 0.55 }) }}>
              <div style={styles.notesCardLabel}>SESSION 2 NOTES</div>
              <div style={styles.notesDate}>{data.session2_date || "Date pending"}</div>
              <textarea value={data.session2_notes || ""} onChange={e => update("session2_notes", e.target.value)} placeholder="Session 2 notes delivered by Robert Brickey after your second call..." rows={8} style={styles.textarea} />
              <div style={{ marginTop: 14 }}>
                <label style={styles.fieldLabel}>SESSION 2 DATE</label>
                <input value={data.session2_date || ""} onChange={e => update("session2_date", e.target.value)} placeholder="MM/DD/YYYY" style={styles.input} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={styles.fieldLabel}>KEY DELIVERABLES AND ACTION COMMITMENTS</label>
            <textarea value={data.deliverables || ""} onChange={e => update("deliverables", e.target.value)} placeholder="Specific commitments, action items, and deliverables agreed upon during your sessions..." rows={4} style={styles.textarea} />
          </div>
        </LockedSection>
      </section>

      {/* ── SECTION 8: 60-DAY SUPPORT ── */}
      <section style={{ ...styles.section, paddingBottom: 80 }}>
        <SectionLabel>SECTION 8 — 60-DAY PRIORITY EMAIL SUPPORT</SectionLabel>
        <p style={styles.sectionCtx}>Direct email access to Robert Brickey for 60 days following your final session. Use this section to track your support interactions and document guidance received.</p>
        <LockedSection unlocked={call1Complete}>
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
            <label style={styles.fieldLabel}>SUPPORT LOG</label>
            <textarea value={data.support_log || ""} onChange={e => update("support_log", e.target.value)} placeholder="Log your support interactions, key questions asked, and guidance received during your 60-day support period..." rows={10} style={styles.textarea} />
          </div>
        </LockedSection>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerQuote}>Structure is permanent. The reset is complete.</span>
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

function LockedSection({ unlocked, children }) {
  if (unlocked) return <div>{children}</div>;
  return (
    <div style={{ position: "relative" }}>
      <div style={styles.lockedOverlay}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
        <div style={{ color: "#C4960F", fontSize: 13, letterSpacing: 3, marginBottom: 8 }}>UNLOCKS AFTER SESSION 1</div>
        <p style={{ color: "#4a4a4a", fontSize: 13, textAlign: "center", maxWidth: 320, lineHeight: 1.7, margin: 0 }}>Mark Session 1 as complete in Section 2 above to unlock this section.</p>
      </div>
      <div style={{ opacity: 0.12, pointerEvents: "none", userSelect: "none" }}>{children}</div>
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
  congratsBox:    { background: "#ffffff", borderLeft: "2px solid #C4960F", padding: "22px 28px", marginBottom: 28, maxWidth: 680 },
  congratsLabel:  { color: "#C4960F", fontSize: 11, letterSpacing: 4, marginBottom: 12 },
  congratsText:   { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#4a4a4a", fontSize: 17, lineHeight: 2, margin: 0 },
  heroTransition: { color: "#4a4a4a", fontSize: 17, lineHeight: 1.9, maxWidth: 640, fontWeight: 300, margin: 0 },
  section:        { padding: "50px 40px 0" },
  sectionCtx:     { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, marginBottom: 24, fontWeight: 300, maxWidth: 640 },
  // Progress
  progressWrap:   { background: "#ffffff", border: "1px solid #e8e3da", padding: "20px 24px", marginBottom: 12 },
  progressLabel:  { color: "#C4960F", fontSize: 11, letterSpacing: 3 },
  progressVal:    { color: "#4a4a4a", fontSize: 13 },
  progressTrack:  { background: "#e8e3da", height: 4, borderRadius: 2 },
  progressFill:   { background: "#C4960F", height: 4, borderRadius: 2, transition: "width 0.4s ease" },
  // Intake accordion
  intakeSec:      { background: "#ffffff", border: "1px solid #e8e3da", marginBottom: 4 },
  intakeSecOpen:  { borderColor: "#C4960F" },
  intakeHeader:   { width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  intakeNum:      { color: "#C4960F", fontSize: 20, fontFamily: "Georgia, serif", minWidth: 32 },
  intakeSecLabel: { color: "#1a1a2e", fontSize: 13, letterSpacing: 2, textAlign: "left" },
  intakeProgress: { color: "#4a4a4a", fontSize: 12, marginTop: 3, textAlign: "left" },
  checkBadge:     { background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 12, padding: "2px 8px" },
  chevron:        { color: "#4a4a4a", fontSize: 12 },
  intakeBody:     { padding: "4px 22px 22px", borderTop: "1px solid #e8e3da" },
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
  bookingMetaLabel:{ color: "#4a4a4a", fontSize: 11, letterSpacing: 2 },
  bookingMetaVal: { color: "#1a1a2e", fontSize: 13, fontWeight: 500 },
  sessionNote:    { background: "#F0EDE8", border: "1px solid #e8e3da", borderLeft: "2px solid #C4960F", padding: "16px 20px", color: "#4a4a4a", fontSize: 14, lineHeight: 1.8 },
  sessionDoneBadge:{ background: "#f0f8f0", border: "1px solid #4A8A4A", color: "#4A8A4A", fontSize: 12, padding: "13px 20px", textAlign: "center" },
  // Locked overlay
  lockedOverlay:  { position: "absolute", inset: 0, background: "rgba(250,250,248,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, gap: 4, padding: "40px 20px" },
  // Matrix
  matrixGrid:     { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 },
  matrixCard:     { background: "#F0EDE8", border: "1px solid #e8e3da", padding: 16 },
  matrixName:     { color: "#C4960F", fontSize: 13, letterSpacing: 1, marginBottom: 4 },
  matrixDesc:     { color: "#4a4a4a", fontSize: 12, lineHeight: 1.6, fontWeight: 300, marginBottom: 8 },
  matrixScore:    { fontFamily: "Georgia, serif", fontSize: 28, color: "#1a1a2e" },
  // Framework
  frameworkGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  frameworkCard:  { background: "#ffffff", border: "1px solid #e8e3da", padding: 20 },
  frameworkLabel: { color: "#C4960F", fontSize: 11, letterSpacing: 2, marginBottom: 10 },
  // Decision rules
  rulesIntro:     { background: "#F0EDE8", border: "1px solid #e8e3da", borderLeft: "2px solid #C4960F", padding: "20px 24px", marginBottom: 16 },
  rulesIntroText: { color: "#4a4a4a", fontSize: 15, lineHeight: 1.9, fontWeight: 300, margin: 0 },
  ruleCard:       { background: "#ffffff", border: "1px solid #e8e3da", padding: 18, marginBottom: 8 },
  ruleLabel:      { color: "#C4960F", fontSize: 11, letterSpacing: 2, marginBottom: 8 },
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
  footer:         { margin: "56px 40px 0", borderTop: "1px solid #e8e3da", paddingTop: 24, paddingBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerQuote:    { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#4a4a4a", fontSize: 15 },
  footerLogo:     { color: "#4a4a4a", fontFamily: "Georgia, serif", fontSize: 20, letterSpacing: 4 },
};
