import { useState, useEffect } from "react";

const STORAGE_KEY = "etfm_portal_data";

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
  bg:         "#0a0f1e",
  surface:    "#111827",
  surface2:   "#0d1528",
  gold:       "#c9a84c",
  goldSoft:   "rgba(201,168,76,0.07)",
  goldBorder: "rgba(201,168,76,0.22)",
  text:       "#e8e2d4",
  muted:      "#8a8fa8",
  border:     "rgba(255,255,255,0.07)",
  success:    "rgba(80,180,120,0.35)",
  successText:"#5db88a",
};

export default function ETFMPortal() {
  const [data, setData] = useState(loadData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!document.getElementById("etfm-portal-fonts")) {
      const link = document.createElement("link");
      link.id = "etfm-portal-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("etfm-portal-anim")) {
      const style = document.createElement("style");
      style.id = "etfm-portal-anim";
      style.textContent = `
        @keyframes portalFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .p-fade { animation: portalFadeUp 0.75s ease both; }
        .p-fade-2 { animation: portalFadeUp 0.75s 0.15s ease both; }
        a.nav-link:hover { color: #c9a84c !important; }
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

  const toolsCompleted = [
    data.tool1_complete,
    data.tool2_complete,
    data.tool3_complete,
    data.tool4_complete,
  ].filter(Boolean).length;

  const overallPct   = Math.round((toolsCompleted / 4) * 15);
  const structurePct = Math.round((toolsCompleted / 4) * 22);
  const tool2Locked  = !data.tool1_complete;
  const tool3Locked  = !data.tool2_complete;
  const tool4Locked  = !data.tool3_complete;

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
            {[["Dashboard","#dashboard"],["Phase 1","#phase1"],["Tools","#tools"],["Progress","#progress"],["Roadmap","#roadmap"],["Advisory","#advisory"]].map(([label, href]) => (
              <a key={href} href={href} className="nav-link" style={S.navLink}>{label}</a>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={S.navName}>Robert Brickey</div>
          <div style={S.navStep}>STEP 3 — RESET EXPERIENCE</div>
        </div>
      </nav>

      {/* SAVE TOAST */}
      {saved && <div style={S.saveToast}>SAVED</div>}

      {/* HERO */}
      <section id="dashboard" style={S.hero} className="p-fade">
        <p style={S.eyebrow}>WELCOME TO YOUR RESET</p>
        <h1 style={S.heroTitle}>ETFM Reset<br />Command Center</h1>

        <div style={S.congratsBox}>
          <p style={S.eyebrow}>CONGRATULATIONS</p>
          <p style={S.congratsText}>
            Most people never stop long enough to rebuild their financial structure intentionally. You did. That decision matters more than you know. What you are about to begin is not a course, not a worksheet, and not a temporary fix. It is a guided reset: a complete financial operating system built around your specific situation.
          </p>
        </div>

        <p style={S.heroPara}>
          You are no longer operating in survival mode. You are building structure. This environment was designed to help you move from reaction to clarity, from stress to strategy, and from scattered financial decisions to intentional execution. Everything you need is here.
        </p>

        <div style={S.instructBox}>
          <p style={{ ...S.eyebrow, marginBottom:16 }}>HOW THIS DASHBOARD WORKS — READ THIS BEFORE ANYTHING ELSE</p>
          {[
            ["01", "Read every section from top to bottom.", "This is a guided journey. Each section flows into the next. Do not skip ahead."],
            ["02", "Your First Mission is directly below.", "It tells you exactly what to do, why it matters, and where to start."],
            ["03", "Click any gold button to open a tool.", "Complete each tool fully before returning here and moving to the next."],
            ["04", "There are five phases.", "You are starting Phase 1. Each phase unlocks after the previous one is complete."],
            ["05", "Return every week.", "This reset builds momentum over time. Come back each week to continue your journey."],
          ].map(([num, bold, rest]) => (
            <div key={num} style={S.instrStep}>
              <span style={S.instrNum}>{num}</span>
              <span style={S.instrText}><span style={{ color:C.text }}>{bold}</span> {rest}</span>
            </div>
          ))}
        </div>

        <div style={S.autosaveNote}>
          All assignments can be completed on this page. Your progress is automatically saved. You can close this page at any time and return exactly where you left off. Nothing is lost.
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section style={S.section} className="p-fade-2">
        <SectionLabel>YOUR RESET ARCHITECTURE</SectionLabel>
        <p style={S.ctx}>Your complete journey at a glance. You are beginning at Phase 1. Each phase builds on the one before it. This is where you are going.</p>
        <div style={S.archWrap}>
          {["Awareness","Stabilization","Control","Positioning","Expansion"].map((phase, i) => (
            <div key={phase} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ ...S.archDot, ...(i===0 ? S.archDotActive : {}) }} />
                <span style={{ ...S.archNum2, ...(i===0 ? { color:C.gold } : {}) }}>0{i+1}</span>
                <span style={{ ...S.archPhaseName, ...(i===0 ? { color:C.text } : {}) }}>{phase}</span>
                <span style={{ ...S.archStatus, ...(i===0 ? { color:C.gold } : {}) }}>{i===0 ? "YOU ARE HERE" : "LOCKED"}</span>
              </div>
              {i < 4 && <div style={S.archLine} />}
            </div>
          ))}
        </div>
        <div style={S.archCaption}>CHAOS — CLARITY — CONTROL — POSITIONING — OWNERSHIP</div>
      </section>

      {/* FIRST MISSION */}
      <section id="phase1" style={S.section}>
        <SectionLabel>YOUR FIRST MISSION</SectionLabel>
        <p style={S.ctx}>Everything in your reset begins here. Read through this entire section carefully before clicking anything. Understanding what you are doing and why will make the work more effective.</p>

        <div style={S.missionCard}>
          <div style={S.missionBadge}>PHASE 1: AWARENESS</div>

          <InfoBox label="WHAT THIS IS">
            Week 1 is not about fixing anything. It is entirely about seeing clearly. You will work through four guided exercises that help you identify where your financial stress is coming from, what obligations you are carrying, and what patterns have been keeping you stuck. None of this requires perfect finances. It simply requires honesty.
          </InfoBox>
          <InfoBox label="WHY THIS MATTERS">
            You cannot build structure around a problem you have not clearly identified. Most people jump straight to budgeting without first understanding their actual situation. That is why those efforts rarely stick. This week changes that. By the end of Week 1, you will have a clear, honest picture of your financial reality.
          </InfoBox>

          <div style={S.divider} />
          <p style={{ ...S.eyebrow, marginBottom:8 }}>PHASE 1 OF 5: AWARENESS</p>
          <h2 style={S.missionTitle}>Week 1: Financial Reality Audit</h2>

          <p style={{ ...S.eyebrow, marginBottom:14 }}>WHAT TO DO THIS WEEK — FOLLOW IN ORDER</p>
          {[
            "Open the Financial Reset Workbook below and complete it fully. This is your first tool.",
            "List every recurring bill, subscription, debt payment, and financial obligation you currently have.",
            "Identify the three areas creating the most financial pressure in your life right now. Be specific and honest.",
            "Review your last 30 days of spending honestly and without judgment. Simply observe what is happening.",
            "Complete your Weekly System Review at the end of the week before moving to Phase 2.",
          ].map((step, i) => (
            <div key={i} style={S.stepRow}>
              <span style={S.stepNum}>0{i+1}</span>
              <span style={S.stepText}>{step}</span>
            </div>
          ))}

          <div style={S.metaGrid}>
            {[
              ["TIME REQUIRED", "45 to 60 minutes across the week"],
              ["EXPECTED OUTCOME", "A clear, honest view of your financial position and the specific pressure points creating the most stress"],
              ["WHERE TO START", "Scroll down to Your Tools. Click the Financial Reset Workbook card. That is Step 01."],
              ["WHAT UNLOCKS NEXT", "Completing this week unlocks Phase 2: Stabilization, where you organize everything identified here."],
            ].map(([label, val]) => (
              <div key={label} style={S.metaItem}>
                <div style={S.metaLabel}>{label}</div>
                <div style={S.metaVal}>{val}</div>
              </div>
            ))}
          </div>

          <div style={S.nextUnlock}>
            <span style={S.eyebrow}>NEXT UNLOCK</span>
            <span style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:16, color:C.gold }}>Phase 2: Stabilization</span>
          </div>

          <div style={{ display:"flex", gap:12, marginTop:24 }}>
            <button style={S.btnPrimary} onClick={() => document.getElementById("tools").scrollIntoView({ behavior:"smooth" })}>BEGIN WEEK 1</button>
            <button style={S.btnSecondary} onClick={() => document.getElementById("roadmap").scrollIntoView({ behavior:"smooth" })}>VIEW FULL ROADMAP</button>
          </div>
          <p style={S.hint}>Clicking Begin Week 1 will scroll to the Financial Reset Workbook, your first tool and the beginning of your reset.</p>
        </div>

        {/* IDENTITY SHIFT */}
        <div style={S.shiftGrid}>
          <div style={S.shiftSide}>
            <p style={{ ...S.eyebrow, color:C.muted, marginBottom:22 }}>WHERE YOU ARE COMING FROM</p>
            {["Reactive decision-making","Financial avoidance","Mental overload","Scattered obligations","Emotional spending","Survival-mode thinking","Constant financial stress"].map(item => (
              <div key={item} style={S.shiftItem}>
                <div style={{ ...S.dot, background:C.muted }} />
                <span style={{ color:C.muted, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ width:1, background:C.border }} />
          <div style={S.shiftSide}>
            <p style={{ ...S.eyebrow, color:C.gold, marginBottom:22 }}>WHERE YOU ARE GOING</p>
            {["Intentional decision-making","Operational clarity","Structured financial systems","Visible obligations","Purposeful financial behavior","Future positioning","Calm financial awareness"].map(item => (
              <div key={item} style={S.shiftItem}>
                <div style={{ ...S.dot, background:C.gold }} />
                <span style={{ color:C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={S.shiftCaption}>
            You are not just organizing money. You are changing the way you operate. Most people stay financially reactive because they never stop long enough to build systems. This reset changes that.
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" style={S.section}>
        <SectionLabel>YOUR TOOLS THIS WEEK</SectionLabel>
        <p style={S.ctx}>These are the four tools you will use during Phase 1. Use them in order. Complete each one fully before moving to the next. Your answers save automatically as you type.</p>

        <div style={S.toolIntro}>
          <p style={{ ...S.eyebrow, marginBottom:10 }}>WHY THESE TOOLS EXIST</p>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.8, margin:0, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>Most financial stress is invisible until you write it down. These tools make the invisible visible. Each takes 10 to 20 minutes and builds directly into the next. Do not try to complete all four in one sitting.</p>
        </div>

        <div style={S.toolGrid}>
          <ToolCard
            phase="PHASE 1 — TOOL 01"
            name="Financial Reset Workbook"
            what="Your first tool. Identifies where your reset begins and what is creating the most pressure in your financial life right now."
            why="You cannot build a system around a problem you have not clearly defined. This workbook does that work."
            time="15 MINUTES — START HERE FIRST"
            status="ready"
            completed={data.tool1_complete}
            onComplete={() => update("tool1_complete", true)}
          >
            <WorkbookForm data={data} update={update} />
          </ToolCard>

          <ToolCard
            phase="PHASE 1 — TOOL 02"
            name="Financial Reality Audit"
            what="A structured look at your complete financial picture, including income, expenses, debt, and obligations, without avoidance."
            why="Most people have never seen their full financial picture in one place. This creates the clarity that makes every future step easier."
            time="20 MINUTES — OPEN AFTER TOOL 01"
            status={tool2Locked ? "locked" : "ready"}
            completed={data.tool2_complete}
            onComplete={() => update("tool2_complete", true)}
          >
            <AuditForm data={data} update={update} />
          </ToolCard>

          <ToolCard
            phase="PHASE 1 — TOOL 03"
            name="Spending Reflection"
            what="An honest review of where your money has been going over the last 30 days and the behavioral patterns driving those decisions."
            why="Awareness of spending patterns is the first step toward changing them. This is not about shame. It is about seeing clearly."
            time="15 MINUTES — OPEN AFTER TOOL 02"
            status={tool3Locked ? "locked" : "ready"}
            completed={data.tool3_complete}
            onComplete={() => update("tool3_complete", true)}
          >
            <SpendingForm data={data} update={update} />
          </ToolCard>

          <ToolCard
            phase="PHASE 1 — TOOL 04"
            name="Weekly System Review"
            what="Your weekly anchor. A 10-minute structured check-in completed at the end of every week throughout your entire reset."
            why="Consistency is the mechanism of change. This review closes the loop on each week and prepares you for the next one."
            time="10 MINUTES — COMPLETE AT WEEK'S END"
            status={tool4Locked ? "locked" : "ready"}
            completed={data.tool4_complete}
            onComplete={() => update("tool4_complete", true)}
          >
            <WeeklyReviewForm data={data} update={update} />
          </ToolCard>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={S.section}>
        <SectionLabel>WHAT MOST PEOPLE EXPERIENCE IN PHASE 1</SectionLabel>
        <p style={S.ctx}>Understanding what is normal during Phase 1 will help you stay on track when the process feels difficult. Read this before opening your first tool.</p>
        <div style={S.expGrid}>
          {[
            "Initial emotional resistance when looking at financial reality directly for the first time",
            "Significant relief after gaining clarity on what is actually happening financially",
            "Reduced mental clutter after organizing all obligations into one visible place",
            "Increased awareness of hidden financial stress and pressure points you had been avoiding",
            "Greater confidence after seeing the full picture clearly for the first time",
            "Emotional discomfort in the first 20 minutes before clarity begins to arrive. This is completely normal.",
          ].map((text, i) => (
            <div key={i} style={S.expItem}>
              <div style={{ ...S.dot, background:C.gold, marginTop:6, flexShrink:0 }} />
              <span style={{ color:C.muted, fontSize:14, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={S.expCaption}>Awareness often feels uncomfortable before it becomes empowering. Stay with the process. Clarity is on the other side.</div>
      </section>

      {/* PROGRESS */}
      <section id="progress" style={S.section}>
        <SectionLabel>YOUR RESET PROGRESS</SectionLabel>
        <p style={S.ctx}>These indicators update as you complete tools and phases. Progress starts at zero and grows as you do the work.</p>
        <div style={S.progGrid3}>
          <ProgressCard label="OVERALL RESET COMPLETION" value={`${overallPct}%`} pct={overallPct} note="Updates after each completed tool" text="Complete Tool 01 to begin building progress. Every tool you complete moves this forward." />
          <ProgressCard label="STRUCTURE SCORE" value={`${structurePct}%`} pct={structurePct} note="Most clients feel noticeable relief at 40%" text="Measures how much financial organization you have built. Grows as you complete each phase." />
          <ProgressCard label="WEEKLY CONSISTENCY" value={data.weeklyStreak ? `${data.weeklyStreak} weeks` : "0%"} pct={0} note="Complete your first weekly review to start your streak" text="Tracks how consistently you return each week. Consistency matters more than speed." />
        </div>
        <div style={S.progGrid2}>
          <div style={S.progCard}>
            <div style={S.progLabel}>CURRENT STREAK</div>
            <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:22, color:C.gold, marginBottom:10 }}>
              {toolsCompleted === 0 ? "Day 1: Reset Begins Today" : `${toolsCompleted} tool${toolsCompleted > 1 ? "s" : ""} completed`}
            </div>
            <p style={S.progText}>Your streak begins the moment you open your first tool. Return each week to keep it growing.</p>
          </div>
          <div style={S.progCard}>
            <div style={S.progLabel}>NEXT MILESTONE</div>
            <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:18, color:C.gold, marginBottom:10 }}>
              {toolsCompleted === 0 ? "Complete Tool 01: Financial Reset Workbook" :
               toolsCompleted === 1 ? "Complete Tool 02: Financial Reality Audit" :
               toolsCompleted === 2 ? "Complete Tool 03: Spending Reflection" :
               toolsCompleted === 3 ? "Complete Tool 04: Weekly System Review" :
               "Phase 1 Complete. Phase 2 Unlocked."}
            </div>
            <p style={S.progText}>Scroll up to Your Tools and complete the next available tool to advance your progress.</p>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" style={S.section}>
        <SectionLabel>PRIVATE CLIENT ROADMAP</SectionLabel>
        <p style={S.ctx}>Your complete reset journey from start to finish. Read all five phases so you understand where this process is taking you and why every phase exists.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {[
            ["01","CURRENT PHASE: YOU ARE HERE NOW","Awareness","Seeing your financial reality clearly before building anything. Identify pressure points, obligations, and patterns driving your financial stress.",true],
            ["02","UNLOCKS AFTER PHASE 1 IS COMPLETE","Stabilization","Organizing everything identified in Phase 1 into one structured system. Bills, due dates, and all obligations in one visible place.",false],
            ["03","UNLOCKS AFTER PHASE 2 IS COMPLETE","Control","Building consistent weekly and monthly routines that keep your financial systems running. Moving from reacting to directing intentionally.",false],
            ["04","UNLOCKS AFTER PHASE 3 IS COMPLETE","Positioning","Aligning your financial behavior with future goals. Moving from surviving month to month toward intentional positioning for stability and growth.",false],
            ["05","UNLOCKS AFTER PHASE 4 IS COMPLETE","Expansion","Building long-term systems, ownership structures, and financial freedom. The reset becomes a permanent financial operating system.",false],
          ].map(([num, tag, name, desc, active]) => (
            <div key={num} style={{ ...S.rmItem, ...(active ? S.rmItemActive : {}) }}>
              <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:34, color: active ? C.gold : C.border, flexShrink:0, width:48 }}>{num}</div>
              <div style={{ flex:1 }}>
                <div style={{ ...S.eyebrow, color: active ? C.gold : C.muted, marginBottom:5 }}>{tag}</div>
                <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:19, color: active ? C.text : C.muted, marginBottom:5 }}>{name}</div>
                <div style={{ color:C.muted, fontSize:13, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.6 }}>{desc}</div>
              </div>
              <div style={{ marginLeft:"auto", flexShrink:0 }}>
                <span style={active ? S.rmStatusActive : S.rmStatusLocked}>{active ? "ACTIVE" : "LOCKED"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY RHYTHM */}
      <section style={S.section}>
        <SectionLabel>YOUR WEEKLY RESET RHYTHM</SectionLabel>
        <p style={S.ctx}>Follow this schedule each week throughout your reset. Clients who follow this rhythm consistently complete their reset with significantly better outcomes.</p>
        <div style={S.rhythmGrid}>
          {[
            ["MONDAY","Review your obligations and upcoming payments. Know what is coming before the week begins."],
            ["WEDNESDAY","Track your spending awareness. Review financial decisions made so far this week."],
            ["FRIDAY","Complete your Weekly System Review. Close the loop on this week before the weekend."],
            ["SUNDAY","Prepare next week's financial structure and priorities. Enter the week with a plan, not a reaction."],
          ].map(([day, text]) => (
            <div key={day} style={S.rhCard}>
              <div style={S.rhDay}>{day}</div>
              <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 }}>{text}</p>
            </div>
          ))}
        </div>
        <div style={S.rhythmCaption}>Momentum is built through return, not perfection.</div>
      </section>

      {/* ADVISORY */}
      <section id="advisory" style={S.section}>
        <SectionLabel>PRIVATE CLIENT ADVISORY NOTES</SectionLabel>
        <p style={S.ctx}>Strategic observations and guidance from Robert Brickey based on your reset profile and phase. Return here whenever you need direction on what to focus on next.</p>
        <div style={S.advisorGrid}>
          {[
            ["STRATEGIC FOCUS","Phase 1: Awareness. Complete all four tools before advancing. Quality of completion matters more than speed."],
            ["ADVISOR OBSERVATION","Clients who complete Phase 1 thoroughly experience significantly better outcomes in every phase that follows."],
            ["PRIORITY ACTION","Open the Financial Reset Workbook now. Complete it before doing anything else in this portal."],
            ["RESET INTELLIGENCE","Your assessment results informed the structure of your personal reset. This journey is built around your specific situation."],
            ["FINANCIAL ARCHITECTURE","Five phases. Twelve weeks. One complete financial operating system. You are building something permanent."],
            ["NEXT MILESTONE","Complete Tool 01: Financial Reset Workbook to begin building your reset progress and unlock the next tool."],
          ].map(([label, text]) => (
            <div key={label} style={S.aiCard}>
              <div style={S.aiLabel}>{label}</div>
              <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROBERT */}
      <section style={S.robertSection}>
        <div>
          <img
            src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/public/robert-brickey.png"
            alt="Robert Brickey"
            style={S.robertImg}
          />
          <div style={S.robertImgLabel}>
            <div style={{ color:C.gold, fontSize:12, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" }}>ROBERT BRICKEY</div>
            <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginTop:4, fontFamily:"'DM Sans', sans-serif" }}>FINANCIAL STRATEGIST: ESCAPE THE FINANCIAL MATRIX</div>
          </div>
        </div>
        <div>
          <p style={{ ...S.eyebrow, marginBottom:10 }}>A PERSONAL MESSAGE FROM ROBERT BRICKEY</p>
          <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:28, fontFamily:"'DM Sans', sans-serif", borderBottom:`1px solid ${C.border}`, paddingBottom:20 }}>
            You have now read through your entire reset system. Before you begin, take two minutes to read this personal message from your strategist.
          </p>
          <p style={S.robertText}>
            Congratulations.<br /><br />
            Most people never stop long enough to rebuild their financial structure intentionally. You did. That matters.<br /><br />
            This is not about perfection. This is not about shame. This is not about trying to impress anyone.<br /><br />
            This is about awareness. Structure. Consistency. And creating a system that supports your life instead of constantly reacting to it.<br /><br />
            Right now, the goal is not speed. The goal is clarity. You are building operational awareness one decision at a time.<br /><br />
            Do not rush this process. Small actions repeated consistently create massive long-term change.<br /><br />
            One decision. One system. One week at a time.
          </p>
          <div style={{ color:C.muted, fontSize:13, marginTop:24, letterSpacing:1, fontFamily:"'DM Sans', sans-serif" }}>— Robert Brickey, Financial Strategist</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <span style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.muted, fontSize:15 }}>Structure is becoming your new normal.</span>
        <span style={{ color:C.gold, fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:22, letterSpacing:7 }}>ETFM</span>
      </footer>
    </div>
  );
}

/* ── SHARED COMPONENTS ── */

function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12 }}>
      <span style={{ color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap" }}>{children}</span>
      <div style={{ flex:1, height:1, background:C.goldBorder }} />
    </div>
  );
}

function InfoBox({ label, children }) {
  return (
    <div style={{ borderLeft:`2px solid ${C.gold}`, background:C.goldSoft, padding:"18px 22px", marginBottom:14 }}>
      <div style={{ color:C.gold, fontSize:11, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif" }}>{label}</div>
      <p style={{ color:C.muted, fontSize:15, lineHeight:1.9, fontFamily:"'DM Sans', sans-serif", fontWeight:300, margin:0 }}>{children}</p>
    </div>
  );
}

function ProgressCard({ label, value, pct, note, text }) {
  return (
    <div style={S.progCard}>
      <div style={S.progLabel}>{label}</div>
      <div style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:34, color:C.gold, marginBottom:8 }}>{value}</div>
      <p style={S.progText}>{text}</p>
      <div style={{ background:"rgba(255,255,255,0.06)", height:3, borderRadius:2, marginTop:16 }}>
        <div style={{ background:C.gold, height:3, borderRadius:2, width:`${pct}%`, transition:"width 0.6s ease" }} />
      </div>
      <div style={{ color:C.muted, fontSize:12, marginTop:8, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" }}>{note}</div>
    </div>
  );
}

function ToolCard({ phase, name, what, why, time, status, completed, onComplete, children }) {
  const [open, setOpen] = useState(false);
  const locked = status === "locked";

  return (
    <div style={{
      ...S.toolCard,
      ...(locked ? S.toolCardLocked : {}),
      ...(completed ? S.toolCardDone : {}),
      ...(!locked && !completed ? S.toolCardActive : {}),
      ...(open && !locked && !completed ? { borderColor:C.gold } : {}),
    }}>
      <div style={{ color:C.gold, fontSize:11, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif", opacity: locked ? 0.4 : 1 }}>{phase}</div>
      <div style={{ color: completed ? C.gold : locked ? C.muted : C.text, fontSize:19, fontFamily:"'Cormorant Garamond', Georgia, serif", marginBottom:10, opacity: locked ? 0.5 : 1 }}>{name}</div>
      <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, marginBottom:6, fontFamily:"'DM Sans', sans-serif", fontWeight:300, opacity: locked ? 0.5 : 1 }}>{what}</p>
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.5, fontStyle:"italic", marginBottom:14, fontFamily:"'DM Sans', sans-serif", fontWeight:300, opacity: locked ? 0.5 : 1 }}>{why}</p>
      <div style={{ color: locked ? C.muted : C.gold, fontSize:11, letterSpacing:2, marginBottom:16, fontFamily:"'DM Sans', sans-serif", opacity: locked ? 0.4 : 1 }}>{time}</div>

      {completed ? (
        <div style={S.completedBadge}>COMPLETED</div>
      ) : locked ? (
        <div style={S.lockedBadge}>LOCKED</div>
      ) : (
        <button style={S.toolBtn} onClick={() => setOpen(!open)}>
          {open ? "CLOSE TOOL" : "OPEN TOOL"}
        </button>
      )}

      {open && !locked && !completed && (
        <div style={S.toolContent}>
          {children}
          <button style={{ ...S.btnPrimary, marginTop:20, width:"100%", display:"block" }} onClick={() => { onComplete(); setOpen(false); }}>
            MARK AS COMPLETE
          </button>
        </div>
      )}
    </div>
  );
}

/* ── TOOL FORMS ── */

function Field({ label, id, data, update, multiline = false, placeholder = "" }) {
  const val = data[id] || "";
  const props = {
    value: val,
    onChange: (e) => update(id, e.target.value),
    placeholder,
    style: multiline ? S.textarea : S.input,
  };
  return (
    <div style={{ marginBottom:16 }}>
      <label style={S.fieldLabel}>{label}</label>
      {multiline ? <textarea {...props} rows={3} /> : <input {...props} />}
    </div>
  );
}

function WorkbookForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Complete each field honestly. There are no wrong answers. Your responses save automatically.</p>
      <Field label="Today's date" id="wb_date" data={data} update={update} placeholder="MM/DD/YYYY" />
      <Field label="In one sentence, how would you describe your financial situation right now?" id="wb_situation" data={data} update={update} multiline placeholder="Be honest. This is for your eyes only." />
      <Field label="On a scale of 1 to 10, how much financial stress are you carrying right now?" id="wb_stress" data={data} update={update} placeholder="1 = none, 10 = overwhelming" />
      <Field label="What does that stress feel like day to day? Describe it honestly." id="wb_stress_desc" data={data} update={update} multiline placeholder="Describe what you experience..." />
      <Field label="Priority Area 1: What is creating the most financial pressure right now?" id="wb_priority1" data={data} update={update} multiline />
      <Field label="Priority Area 2" id="wb_priority2" data={data} update={update} multiline />
      <Field label="Priority Area 3" id="wb_priority3" data={data} update={update} multiline />
      <Field label="In 90 days, if your reset is working, what would be different about your financial life?" id="wb_90days" data={data} update={update} multiline />
      <Field label="What is the one financial outcome that would create the most relief in your life right now?" id="wb_relief" data={data} update={update} multiline />
      <Field label="Your name (reset commitment)" id="wb_name" data={data} update={update} placeholder="Sign your name to commit to this process" />
    </div>
  );
}

function AuditForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>A complete look at your financial picture. Be as accurate as possible. Estimates are fine.</p>
      <Field label="Approximate monthly income (after tax)" id="audit_income" data={data} update={update} placeholder="$" />
      <Field label="Approximate total monthly fixed expenses (rent, car, insurance)" id="audit_fixed" data={data} update={update} placeholder="$" />
      <Field label="Approximate monthly variable expenses (groceries, gas, dining, subscriptions)" id="audit_variable" data={data} update={update} placeholder="$" />
      <Field label="Do you have an emergency fund? If yes, approximately how much?" id="audit_emergency" data={data} update={update} placeholder="Yes / No / Amount" />
      <Field label="Do you have debt outside of a mortgage? If yes, approximately how much?" id="audit_debt" data={data} update={update} placeholder="Yes / No / Amount" />
      <Field label="When did you last review your full financial picture?" id="audit_last_review" data={data} update={update} placeholder="Month and year" />
      <Field label="List your three most stressful financial obligations right now" id="audit_obligations" data={data} update={update} multiline placeholder="1. &#10;2. &#10;3." />
      <Field label="What is one financial habit you know is costing you money?" id="audit_habit" data={data} update={update} multiline />
    </div>
  );
}

function SpendingForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Review your last 30 days of spending honestly. This is not about judgment. It is about awareness.</p>
      <Field label="Where did most of your money go last month?" id="spend_where" data={data} update={update} multiline placeholder="Think categories: food, subscriptions, entertainment, debt payments..." />
      <Field label="Were there any purchases you regret or that felt reactive?" id="spend_regret" data={data} update={update} multiline placeholder="Be honest. No judgment here." />
      <Field label="What triggers your emotional spending? (Stress, boredom, social pressure)" id="spend_triggers" data={data} update={update} multiline />
      <Field label="Is there a recurring expense you could eliminate without major impact?" id="spend_eliminate" data={data} update={update} multiline />
      <Field label="What one spending pattern, if changed, would make the biggest difference?" id="spend_pattern" data={data} update={update} multiline />
      <Field label="What does financial discipline feel like to you right now?" id="spend_discipline" data={data} update={update} multiline placeholder="Difficult? Impossible? Improving?" />
    </div>
  );
}

function WeeklyReviewForm({ data, update }) {
  return (
    <div>
      <p style={S.formIntro}>Your 10-minute weekly anchor. Complete this every week on the same day at the same time.</p>
      <Field label="Week of" id="wr_week" data={data} update={update} placeholder="MM/DD/YYYY" />
      <Field label="What went well financially this week?" id="wr_went_well" data={data} update={update} multiline />
      <Field label="What created financial stress or friction this week?" id="wr_friction" data={data} update={update} multiline />
      <Field label="Did you follow your weekly rhythm? What did you do or miss?" id="wr_rhythm" data={data} update={update} multiline />
      <Field label="What is your top financial priority for next week?" id="wr_priority" data={data} update={update} multiline />
      <Field label="Rate your financial consistency this week (1 to 10)" id="wr_rating" data={data} update={update} placeholder="1 = no consistency, 10 = fully on track" />
      <Field label="One sentence commitment for next week" id="wr_commitment" data={data} update={update} placeholder="I will..." />
    </div>
  );
}

/* ── STYLES ── */

const S = {
  page:       { fontFamily:"'DM Sans', Inter, sans-serif", background:C.bg, color:C.text, minHeight:"100vh", paddingTop:72, paddingBottom:100 },
  nav:        { position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(10,15,30,0.97)", backdropFilter:"blur(14px)", borderBottom:`1px solid ${C.goldBorder}`, padding:"14px 48px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:       { fontFamily:"'Cormorant Garamond', Georgia, serif", color:C.gold, fontSize:22, letterSpacing:8 },
  logoSub:    { color:C.muted, fontSize:10, letterSpacing:4, marginTop:3, fontFamily:"'DM Sans', sans-serif" },
  navLinks:   { display:"flex", gap:28, marginLeft:40 },
  navLink:    { color:C.muted, fontSize:11, letterSpacing:2, textDecoration:"none", fontFamily:"'DM Sans', sans-serif" },
  navName:    { color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif" },
  navStep:    { color:C.gold, fontSize:11, letterSpacing:2, marginTop:3, fontFamily:"'DM Sans', sans-serif" },
  saveToast:  { position:"fixed", top:78, right:20, background:C.surface, border:`1px solid ${C.gold}`, color:C.gold, fontSize:11, padding:"7px 18px", zIndex:9999, letterSpacing:4, fontFamily:"'DM Sans', sans-serif" },
  hero:       { padding:"72px 48px 60px", borderBottom:`1px solid ${C.border}` },
  eyebrow:    { color:C.gold, fontSize:11, letterSpacing:4, fontFamily:"'DM Sans', sans-serif", margin:0, marginBottom:0 },
  heroTitle:  { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:58, color:C.text, fontWeight:300, lineHeight:1.08, marginBottom:36, marginTop:20 },
  congratsBox:{ borderLeft:`2px solid ${C.gold}`, background:C.goldSoft, padding:"22px 28px", marginBottom:28, maxWidth:700 },
  congratsText:{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.text, fontSize:18, lineHeight:1.9, margin:"12px 0 0" },
  heroPara:   { color:C.muted, fontSize:16, lineHeight:1.9, maxWidth:660, marginBottom:32, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  instructBox:{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.gold}`, padding:"22px 28px", maxWidth:700, marginBottom:24 },
  instrStep:  { display:"flex", gap:16, padding:"10px 0", borderBottom:`1px solid ${C.border}`, alignItems:"flex-start" },
  instrNum:   { color:C.gold, fontSize:12, minWidth:22, paddingTop:1, fontFamily:"'DM Sans', sans-serif", flexShrink:0 },
  instrText:  { color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  autosaveNote:{ background:"rgba(201,168,76,0.05)", border:`1px solid ${C.goldBorder}`, padding:"14px 22px", maxWidth:700, color:C.muted, fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  section:    { padding:"64px 48px 0" },
  ctx:        { color:C.muted, fontSize:14, lineHeight:1.8, marginBottom:28, fontFamily:"'DM Sans', sans-serif", fontWeight:300, maxWidth:660 },
  archWrap:   { display:"flex", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, padding:"28px 40px" },
  archDot:    { width:10, height:10, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:`1px solid ${C.muted}`, flexShrink:0 },
  archDotActive:{ background:C.gold, border:`1px solid ${C.gold}`, boxShadow:`0 0 10px rgba(201,168,76,0.45)` },
  archLine:   { flex:1, height:1, background:C.border },
  archNum2:   { color:C.muted, fontSize:11, letterSpacing:2, fontFamily:"'DM Sans', sans-serif" },
  archPhaseName:{ color:C.muted, fontSize:12, fontFamily:"'Cormorant Garamond', Georgia, serif", textAlign:"center" },
  archStatus: { color:C.muted, fontSize:10, letterSpacing:1, fontFamily:"'DM Sans', sans-serif" },
  archCaption:{ background:C.surface2, border:`1px solid ${C.border}`, borderTop:"none", padding:"14px 40px", color:C.muted, fontSize:12, letterSpacing:2, textAlign:"center", fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic" },
  missionCard:{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${C.gold}`, padding:40, position:"relative", marginBottom:14 },
  missionBadge:{ position:"absolute", top:20, right:20, background:"rgba(201,168,76,0.1)", border:`1px solid ${C.goldBorder}`, color:C.gold, fontSize:10, letterSpacing:3, padding:"5px 14px", fontFamily:"'DM Sans', sans-serif" },
  divider:    { height:1, background:C.border, marginBottom:24 },
  missionTitle:{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:30, color:C.text, marginBottom:24, fontWeight:400, marginTop:8 },
  stepRow:    { display:"flex", gap:14, padding:"11px 0", borderBottom:`1px solid ${C.border}` },
  stepNum:    { color:C.gold, fontSize:12, minWidth:22, fontFamily:"'DM Sans', sans-serif", flexShrink:0, paddingTop:1 },
  stepText:   { color:C.muted, fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  metaGrid:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"24px 0" },
  metaItem:   { background:C.surface2, padding:"14px 18px", border:`1px solid ${C.border}` },
  metaLabel:  { color:C.gold, fontSize:10, letterSpacing:2, marginBottom:6, fontFamily:"'DM Sans', sans-serif" },
  metaVal:    { color:C.muted, fontSize:13, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  nextUnlock: { background:"rgba(201,168,76,0.05)", border:`1px solid ${C.goldBorder}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:20 },
  btnPrimary: { background:C.gold, color:"#0a0f1e", border:"none", padding:"13px 30px", fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600 },
  btnSecondary:{ background:"transparent", color:C.gold, border:`1px solid ${C.goldBorder}`, padding:"13px 30px", fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  hint:       { color:C.muted, fontSize:12, marginTop:14, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" },
  shiftGrid:  { display:"grid", gridTemplateColumns:"1fr 1px 1fr", background:C.surface, border:`1px solid ${C.border}`, marginTop:2 },
  shiftSide:  { padding:32 },
  shiftItem:  { display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderBottom:`1px solid ${C.border}` },
  dot:        { width:4, height:4, borderRadius:"50%", marginTop:7, flexShrink:0 },
  shiftCaption:{ padding:"20px 32px", borderTop:`1px solid ${C.border}`, gridColumn:"1/4", background:C.surface2, textAlign:"center", fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.muted, fontSize:15, lineHeight:1.9 },
  toolIntro:  { background:C.surface, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.gold}`, padding:"18px 24px", marginBottom:16 },
  toolGrid:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  toolCard:   { background:C.surface, border:`1px solid ${C.border}`, padding:24 },
  toolCardActive:{ borderColor:C.goldBorder },
  toolCardDone:{ borderColor:"rgba(80,180,120,0.3)", background:"rgba(80,180,120,0.03)" },
  toolCardLocked:{ opacity:0.42 },
  toolContent:{ marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:20 },
  toolBtn:    { background:C.gold, color:"#0a0f1e", border:"none", padding:"10px 20px", fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, width:"100%" },
  completedBadge:{ background:"rgba(80,180,120,0.1)", border:"1px solid rgba(80,180,120,0.35)", color:C.successText, fontSize:11, letterSpacing:2, padding:"7px 14px", display:"inline-block", fontFamily:"'DM Sans', sans-serif" },
  lockedBadge:{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, letterSpacing:2, padding:"7px 14px", display:"inline-block", fontFamily:"'DM Sans', sans-serif" },
  formIntro:  { color:C.muted, fontSize:13, lineHeight:1.8, marginBottom:20, fontStyle:"italic", fontFamily:"'Cormorant Garamond', Georgia, serif" },
  fieldLabel: { display:"block", color:C.muted, fontSize:11, letterSpacing:2, marginBottom:7, fontFamily:"'DM Sans', sans-serif" },
  input:      { width:"100%", background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", boxSizing:"border-box" },
  textarea:   { width:"100%", background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, padding:"10px 14px", fontFamily:"'DM Sans', sans-serif", outline:"none", resize:"vertical", boxSizing:"border-box" },
  expGrid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:0 },
  expItem:    { background:C.surface, border:`1px solid ${C.border}`, padding:"16px 20px", display:"flex", gap:14, alignItems:"flex-start" },
  expCaption: { background:C.surface2, border:`1px solid ${C.border}`, borderTop:"none", padding:"16px 24px", textAlign:"center", fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.muted, fontSize:15, lineHeight:1.8 },
  progGrid3:  { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginBottom:12 },
  progGrid2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  progCard:   { background:C.surface, border:`1px solid ${C.border}`, padding:26 },
  progLabel:  { color:C.gold, fontSize:10, letterSpacing:3, marginBottom:12, fontFamily:"'DM Sans', sans-serif" },
  progText:   { color:C.muted, fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans', sans-serif", fontWeight:300 },
  rmItem:     { background:C.surface, border:`1px solid ${C.border}`, padding:"20px 28px", display:"flex", alignItems:"center", gap:22 },
  rmItemActive:{ borderColor:C.goldBorder, background:"rgba(201,168,76,0.03)" },
  rmStatusActive:{ background:"rgba(201,168,76,0.1)", color:C.gold, border:`1px solid ${C.goldBorder}`, fontSize:10, letterSpacing:2, padding:"4px 14px", fontFamily:"'DM Sans', sans-serif" },
  rmStatusLocked:{ background:C.surface2, color:C.muted, border:`1px solid ${C.border}`, fontSize:10, letterSpacing:2, padding:"4px 14px", fontFamily:"'DM Sans', sans-serif" },
  rhythmGrid: { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 },
  rhCard:     { background:C.surface, border:`1px solid ${C.border}`, padding:22 },
  rhDay:      { color:C.gold, fontSize:11, letterSpacing:3, marginBottom:10, fontFamily:"'DM Sans', sans-serif" },
  rhythmCaption:{ background:C.surface2, border:`1px solid ${C.border}`, borderTop:"none", padding:"14px 24px", textAlign:"center", fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.muted, fontSize:15 },
  advisorGrid:{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 },
  aiCard:     { background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${C.goldBorder}`, padding:20 },
  aiLabel:    { color:C.gold, fontSize:10, letterSpacing:2, marginBottom:8, fontFamily:"'DM Sans', sans-serif" },
  robertSection:{ padding:"64px 48px 64px", borderTop:`1px solid ${C.border}`, display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:52, alignItems:"start", marginTop:64, background:C.surface },
  robertImg:  { width:"100%", display:"block", objectFit:"cover", height:460, filter:"grayscale(15%) contrast(1.05)" },
  robertImgLabel:{ background:C.surface2, border:`1px solid ${C.border}`, padding:"10px 18px" },
  robertText: { fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:"italic", color:C.text, fontSize:18, lineHeight:2.1, opacity:0.85 },
  footer:     { margin:"64px 48px 0", borderTop:`1px solid ${C.border}`, paddingTop:28, paddingBottom:64, display:"flex", justifyContent:"space-between", alignItems:"center" },
};
