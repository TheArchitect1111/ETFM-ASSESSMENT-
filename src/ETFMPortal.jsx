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

export default function ETFMPortal() {
  const [data, setData] = useState(loadData);
  const [saved, setSaved] = useState(false);

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

  const overallPct = Math.round((toolsCompleted / 4) * 15);
  const structurePct = Math.round((toolsCompleted / 4) * 22);
  const tool2Locked = !data.tool1_complete;
  const tool3Locked = !data.tool2_complete;
  const tool4Locked = !data.tool3_complete;

  return (
    <div style={styles.page}>
      {/* BANNER */}
      <img
        src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/public/Gemini_Generated_Image_ux3dfhux3dfhux3d.png"
        alt="ETFM"
        style={styles.banner}
      />

      {/* NAV */}
      <nav style={styles.nav}>
        <div>
          <div style={styles.logo}>ETFM</div>
          <div style={styles.logoSub}>ESCAPE THE FINANCIAL MATRIX</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={styles.navName}>Robert Brickey</div>
          <div style={styles.navStep}>STEP 3 — RESET EXPERIENCE</div>
        </div>
      </nav>

      {/* SAVE INDICATOR */}
      {saved && (
        <div style={styles.saveToast}>✓ Progress saved</div>
      )}

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroLabel}>WELCOME TO YOUR RESET</div>
        <h1 style={styles.heroTitle}>ETFM Reset<br />Command Center</h1>

        <div style={styles.congratsBox}>
          <div style={styles.congratsLabel}>CONGRATULATIONS</div>
          <p style={styles.congratsText}>
            Most people never stop long enough to rebuild their financial structure intentionally. You did. That decision matters more than you know. What you are about to begin is not a course, not a worksheet, and not a temporary fix. It is a guided reset: a complete financial operating system built around your specific situation.
          </p>
        </div>

        <p style={styles.heroTransition}>
          <strong style={{ color: "#AAA", fontWeight: 400 }}>You are no longer operating in survival mode.</strong> You are building structure. This environment was designed to help you move from reaction to clarity, from stress to strategy, and from scattered financial decisions to intentional execution. Everything you need is here. Start at the top and read every section before clicking anything.
        </p>

        <div style={styles.howBox}>
          <div style={styles.howLabel}>HOW THIS DASHBOARD WORKS — READ THIS BEFORE ANYTHING ELSE</div>
          {[
            ["1", "Read every section from top to bottom.", "This is a guided journey. Each section flows into the next. Do not skip ahead."],
            ["2", "Your First Mission is directly below.", "It tells you exactly what to do, why it matters, and where to start."],
            ["3", "Click any gold button to open a tool.", "Complete each tool fully before returning here and moving to the next."],
            ["4", "There are five phases.", "You are starting Phase 1. Each phase unlocks after the previous one is complete."],
            ["5", "Return every week.", "This reset builds momentum over time. Come back each week to continue your journey."],
          ].map(([num, bold, rest]) => (
            <div key={num} style={styles.howStep}>
              <span style={styles.howNum}>{num}</span>
              <span style={styles.howText}><strong style={{ color: "#AAA", fontWeight: 400 }}>{bold}</strong> {rest}</span>
            </div>
          ))}
        </div>

        <div style={styles.autosaveBar}>
          <strong style={{ color: "#C4960F" }}>All assignments can be completed on this page.</strong> Your progress is automatically saved. You can close this page at any time and return exactly where you left off. Nothing is lost.
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section style={styles.section}>
        <SectionLabel>YOUR RESET ARCHITECTURE</SectionLabel>
        <p style={styles.sectionCtx}>Here is your complete journey at a glance. You are beginning at Phase 1. Each phase builds on the one before it. This is where you are going.</p>
        <div style={styles.archTrack}>
          {["Awareness", "Stabilization", "Control", "Positioning", "Expansion"].map((phase, i) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ ...styles.archDot, ...(i === 0 ? styles.archDotActive : i === 1 ? styles.archDotNear : {}) }} />
                <span style={{ ...styles.archNum, ...(i === 0 ? { color: "#C4960F" } : {}) }}>0{i + 1}</span>
                <span style={{ ...styles.archName, ...(i === 0 ? { color: "#FAF8F4" } : i === 1 ? { color: "#444" } : {}) }}>{phase}</span>
                <span style={{ ...styles.archStatus, ...(i === 0 ? { color: "#C4960F" } : {}) }}>{i === 0 ? "YOU ARE HERE" : "LOCKED"}</span>
              </div>
              {i < 4 && <div style={styles.archLine} />}
            </div>
          ))}
        </div>
        <div style={styles.archBottom}>CHAOS — CLARITY — CONTROL — POSITIONING — OWNERSHIP</div>
      </section>

      {/* FIRST MISSION */}
      <section style={styles.section}>
        <SectionLabel>YOUR FIRST MISSION</SectionLabel>
        <p style={styles.sectionCtx}>Everything in your reset begins here. Read through this entire section carefully before clicking anything. Understanding what you are doing and why will make the work more effective.</p>

        <div style={styles.missionCard}>
          <div style={styles.missionBadge}>PHASE 1: AWARENESS</div>

          <InfoBox label="WHAT THIS IS">
            Week 1 is not about fixing anything. It is entirely about seeing clearly. You will work through four guided exercises that help you identify where your financial stress is coming from, what obligations you are carrying, and what patterns have been keeping you stuck. None of this requires perfect finances. It simply requires honesty.
          </InfoBox>

          <InfoBox label="WHY THIS MATTERS" style={{ background: "#0F0F0F", borderLeft: "none", padding: "20px 24px", marginBottom: 24 }}>
            You cannot build structure around a problem you have not clearly identified. Most people jump straight to budgeting without first understanding their actual situation. That is why those efforts rarely stick. This week changes that. By the end of Week 1, you will have a clear, honest picture of your financial reality.
          </InfoBox>

          <div style={styles.divider} />
          <div style={styles.mcPhase}>PHASE 1 OF 5: AWARENESS</div>
          <h2 style={styles.mcTitle}>Week 1: Financial Reality Audit</h2>

          <div style={styles.stepsLabel}>WHAT TO DO THIS WEEK — FOLLOW IN ORDER</div>
          {[
            "Open the Financial Reset Workbook below and complete it fully. This is your first tool.",
            "List every recurring bill, subscription, debt payment, and financial obligation you currently have.",
            "Identify the three areas creating the most financial pressure in your life right now. Be specific and honest.",
            "Review your last 30 days of spending honestly and without judgment. Simply observe what is happening.",
            "Complete your Weekly System Review at the end of the week before moving to Phase 2.",
          ].map((step, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.stepNum}>0{i + 1}</span>
              <span style={styles.stepText}>{step}</span>
            </div>
          ))}

          <div style={styles.metaGrid}>
            {[
              ["TIME REQUIRED", "45 to 60 minutes across the week"],
              ["EXPECTED OUTCOME", "A clear, honest view of your financial position and the specific pressure points creating the most stress"],
              ["WHERE TO START", "Scroll down to Your Tools. Click the Financial Reset Workbook card. That is Step 01."],
              ["WHAT UNLOCKS NEXT", "Completing this week unlocks Phase 2: Stabilization, where you organize everything identified here."],
            ].map(([label, val]) => (
              <div key={label} style={styles.metaItem}>
                <div style={styles.metaLabel}>{label}</div>
                <div style={styles.metaVal}>{val}</div>
              </div>
            ))}
          </div>

          <div style={styles.nextUnlock}>
            <span style={styles.nextLabel}>NEXT UNLOCK</span>
            <span style={styles.nextVal}>Phase 2: Stabilization</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={styles.btnPrimary} onClick={() => document.getElementById("tools").scrollIntoView({ behavior: "smooth" })}>BEGIN WEEK 1</button>
            <button style={styles.btnSecondary} onClick={() => document.getElementById("roadmap").scrollIntoView({ behavior: "smooth" })}>VIEW FULL ROADMAP</button>
          </div>
          <p style={styles.mcHint}>Clicking Begin Week 1 will scroll to the Financial Reset Workbook, your first tool and the beginning of your reset.</p>
        </div>

        {/* IDENTITY SHIFT */}
        <div style={styles.shiftGrid}>
          <div style={styles.shiftSide}>
            <div style={{ ...styles.shiftLabel, color: "#2A2A2A" }}>WHERE YOU ARE COMING FROM</div>
            {["Reactive decision-making", "Financial avoidance", "Mental overload", "Scattered obligations", "Emotional spending", "Survival-mode thinking", "Constant financial stress"].map(item => (
              <div key={item} style={styles.shiftItem}>
                <div style={{ ...styles.shiftDot, background: "#222" }} />
                <span style={{ color: "#2A2A2A", fontSize: 12, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ width: 1, background: "#1A1A1A" }} />
          <div style={styles.shiftSide}>
            <div style={{ ...styles.shiftLabel, color: "#C4960F" }}>WHERE YOU ARE GOING</div>
            {["Intentional decision-making", "Operational clarity", "Structured financial systems", "Visible obligations", "Purposeful financial behavior", "Future positioning", "Calm financial awareness"].map(item => (
              <div key={item} style={styles.shiftItem}>
                <div style={{ ...styles.shiftDot, background: "#C4960F" }} />
                <span style={{ color: "#888", fontSize: 12, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={styles.shiftBottom}>
            You are not just organizing money. You are changing the way you operate. Most people stay financially reactive because they never stop long enough to build systems. This reset changes that.
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" style={styles.section}>
        <SectionLabel>YOUR TOOLS THIS WEEK</SectionLabel>
        <p style={styles.sectionCtx}>These are the four tools you will use during Phase 1. Use them in order. Complete each one fully before moving to the next. Your answers save automatically as you type.</p>

        <div style={styles.toolIntro}>
          <div style={styles.toolIntroLabel}>WHY THESE TOOLS EXIST</div>
          <p style={styles.toolIntroText}>Most financial stress is invisible until you write it down. These tools make the invisible visible. Each takes 10 to 20 minutes and builds directly into the next. Do not try to complete all four in one sitting.</p>
        </div>

        <div style={styles.toolGrid}>
          <ToolCard
            phase="PHASE 1 — TOOL 01"
            icon="📋"
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
            icon="📊"
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
            icon="💳"
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
            icon="🔄"
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
      <section style={styles.section}>
        <SectionLabel>WHAT MOST PEOPLE EXPERIENCE IN PHASE 1</SectionLabel>
        <p style={styles.sectionCtx}>Understanding what is normal during Phase 1 will help you stay on track when the process feels difficult. Read this before opening your first tool.</p>
        <div style={styles.expGrid}>
          {[
            "Initial emotional resistance when looking at financial reality directly for the first time",
            "Significant relief after gaining clarity on what is actually happening financially",
            "Reduced mental clutter after organizing all obligations into one visible place",
            "Increased awareness of hidden financial stress and pressure points you had been avoiding",
            "Greater confidence after seeing the full picture clearly for the first time",
            "Emotional discomfort in the first 20 minutes before clarity begins to arrive. This is completely normal.",
          ].map((text, i) => (
            <div key={i} style={styles.expItem}>
              <div style={styles.expDot} />
              <span style={styles.expText}>{text}</span>
            </div>
          ))}
        </div>
        <div style={styles.expBottom}>
          This is normal. Awareness often feels uncomfortable before it becomes empowering. Stay with the process. Clarity is on the other side.
        </div>
      </section>

      {/* PROGRESS */}
      <section style={styles.section}>
        <SectionLabel>YOUR RESET PROGRESS</SectionLabel>
        <p style={styles.sectionCtx}>These indicators update as you complete tools and phases. Progress starts at zero and grows as you do the work.</p>
        <div style={styles.progGrid3}>
          <ProgressCard label="OVERALL RESET COMPLETION" value={`${overallPct}%`} pct={overallPct} note="Updates after each completed tool" text="Complete Tool 01 to begin building progress. Every tool you complete moves this forward." />
          <ProgressCard label="STRUCTURE SCORE" value={`${structurePct}%`} pct={structurePct} note="Most clients feel noticeable relief at 40%" text="Measures how much financial organization you have built. Grows as you complete each phase." />
          <ProgressCard label="WEEKLY CONSISTENCY" value={data.weeklyStreak ? `${data.weeklyStreak} weeks` : "0%"} pct={0} note="Complete your first weekly review to start your streak" text="Tracks how consistently you return each week. Consistency matters more than speed." />
        </div>
        <div style={styles.progGrid2}>
          <div style={styles.progCard}>
            <div style={styles.progLabel}>CURRENT STREAK</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#C4960F", marginBottom: 8 }}>
              {toolsCompleted === 0 ? "Day 1: Reset Begins Today" : `${toolsCompleted} tool${toolsCompleted > 1 ? "s" : ""} completed`}
            </div>
            <p style={styles.progText}>Your streak begins the moment you open your first tool. Return each week to keep it growing.</p>
          </div>
          <div style={styles.progCard}>
            <div style={styles.progLabel}>NEXT MILESTONE</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#C4960F", marginBottom: 8 }}>
              {toolsCompleted === 0 ? "Complete Tool 01: Financial Reset Workbook" :
               toolsCompleted === 1 ? "Complete Tool 02: Financial Reality Audit" :
               toolsCompleted === 2 ? "Complete Tool 03: Spending Reflection" :
               toolsCompleted === 3 ? "Complete Tool 04: Weekly System Review" :
               "Phase 1 Complete. Phase 2 Unlocked."}
            </div>
            <p style={styles.progText}>Scroll up to Your Tools and complete the next available tool to advance your progress.</p>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" style={styles.section}>
        <SectionLabel>PRIVATE CLIENT ROADMAP</SectionLabel>
        <p style={styles.sectionCtx}>Your complete reset journey from start to finish. Read all five phases so you understand where this process is taking you and why every phase exists.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            ["01", "CURRENT PHASE: YOU ARE HERE NOW", "Awareness", "Seeing your financial reality clearly before building anything. Identify pressure points, obligations, and patterns driving your financial stress.", true],
            ["02", "UNLOCKS AFTER PHASE 1 IS COMPLETE", "Stabilization", "Organizing everything identified in Phase 1 into one structured system. Bills, due dates, and all obligations in one visible place.", false],
            ["03", "UNLOCKS AFTER PHASE 2 IS COMPLETE", "Control", "Building consistent weekly and monthly routines that keep your financial systems running. Moving from reacting to directing intentionally.", false],
            ["04", "UNLOCKS AFTER PHASE 3 IS COMPLETE", "Positioning", "Aligning your financial behavior with future goals. Moving from surviving month to month toward intentional positioning for stability and growth.", false],
            ["05", "UNLOCKS AFTER PHASE 4 IS COMPLETE", "Expansion", "Building long-term systems, ownership structures, and financial freedom. The reset becomes a permanent financial operating system.", false],
          ].map(([num, tag, name, desc, active]) => (
            <div key={num} style={{ ...styles.rmItem, ...(active ? styles.rmItemActive : {}) }}>
              <div style={{ ...styles.rmNum, ...(active ? { color: "#C4960F" } : {}) }}>{num}</div>
              <div>
                <div style={{ ...styles.rmTag, ...(active ? { color: "#C4960F" } : {}) }}>{tag}</div>
                <div style={{ ...styles.rmName, ...(active ? { color: "#FAF8F4" } : {}) }}>{name}</div>
                <div style={{ ...styles.rmDesc, ...(active ? { color: "#555" } : {}) }}>{desc}</div>
              </div>
              <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                <span style={active ? styles.rmStatusActive : styles.rmStatusLocked}>{active ? "ACTIVE" : "LOCKED"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY RHYTHM */}
      <section style={styles.section}>
        <SectionLabel>YOUR WEEKLY RESET RHYTHM</SectionLabel>
        <p style={styles.sectionCtx}>Follow this schedule each week throughout your reset. Clients who follow this rhythm consistently complete their reset with significantly better outcomes.</p>
        <div style={styles.rhythmGrid}>
          {[
            ["MONDAY", "Review your obligations and upcoming payments. Know what is coming before the week begins."],
            ["WEDNESDAY", "Track your spending awareness. Review financial decisions made so far this week."],
            ["FRIDAY", "Complete your Weekly System Review. Close the loop on this week before the weekend."],
            ["SUNDAY", "Prepare next week's financial structure and priorities. Enter the week with a plan, not a reaction."],
          ].map(([day, text]) => (
            <div key={day} style={styles.rhCard}>
              <div style={styles.rhDay}>{day}</div>
              <p style={styles.rhText}>{text}</p>
            </div>
          ))}
        </div>
        <div style={styles.rhBottom}>Momentum is built through return, not perfection.</div>
      </section>

      {/* ADVISORY NOTES */}
      <section style={styles.section}>
        <SectionLabel>PRIVATE CLIENT ADVISORY NOTES</SectionLabel>
        <p style={styles.sectionCtx}>Strategic observations and guidance from Robert Brickey based on your reset profile and phase. Return here whenever you need direction on what to focus on next.</p>
        <div style={styles.advisor}>
          <div style={styles.advisorLabel}>STRATEGIC GUIDANCE: PHASE 1</div>
          <div style={styles.advisorGrid}>
            {[
              ["STRATEGIC FOCUS", "Phase 1: Awareness. Complete all four tools before advancing. Quality of completion matters more than speed."],
              ["ADVISOR OBSERVATION", "Clients who complete Phase 1 thoroughly experience significantly better outcomes in every phase that follows."],
              ["PRIORITY ACTION", "Open the Financial Reset Workbook now. Complete it before doing anything else in this portal."],
              ["RESET INTELLIGENCE", "Your assessment results informed the structure of your personal reset. This journey is built around your specific situation."],
              ["FINANCIAL ARCHITECTURE", "Five phases. Twelve weeks. One complete financial operating system. You are building something permanent."],
              ["NEXT MILESTONE", "Complete Tool 01: Financial Reset Workbook to begin building your reset progress and unlock the next tool."],
            ].map(([label, text]) => (
              <div key={label} style={styles.aiCard}>
                <div style={styles.aiLabel}>{label}</div>
                <p style={styles.aiText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROBERT */}
      <section style={{ ...styles.robertSection }}>
        <div>
          <img
            src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/public/robert-brickey.png"
            alt="Robert Brickey"
            style={styles.robertImg}
          />
          <div style={styles.robertImgLabel}>
            <div style={styles.robertImgName}>ROBERT BRICKEY</div>
            <div style={styles.robertImgTitle}>FINANCIAL STRATEGIST: ESCAPE THE FINANCIAL MATRIX</div>
          </div>
        </div>
        <div>
          <div style={styles.robertLabel}>A PERSONAL MESSAGE FROM ROBERT BRICKEY</div>
          <p style={styles.robertContext}>You have now read through your entire reset system. Before you begin, take two minutes to read this personal message from your strategist.</p>
          <p style={styles.robertText}>
            Congratulations.<br /><br />
            Most people never stop long enough to rebuild their financial structure intentionally. You did. That matters.<br /><br />
            This is not about perfection. This is not about shame. This is not about trying to impress anyone.<br /><br />
            This is about awareness. Structure. Consistency. And creating a system that supports your life instead of constantly reacting to it.<br /><br />
            Right now, the goal is not speed. The goal is clarity. You are building operational awareness one decision at a time.<br /><br />
            Do not rush this process. Small actions repeated consistently create massive long-term change.<br /><br />
            One decision. One system. One week at a time.
          </p>
          <div style={styles.robertSig}>— Robert Brickey, Financial Strategist</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerQuote}>Structure is becoming your new normal.</span>
        <span style={styles.footerLogo}>ETFM</span>
      </footer>
    </div>
  );
}

/* ── SHARED COMPONENTS ── */

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
      <span style={{ color: "#C4960F", fontSize: 10, letterSpacing: 4 }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "#1A1A1A" }} />
    </div>
  );
}

function InfoBox({ label, children }) {
  return (
    <div style={{ background: "#0F0F0F", borderLeft: "2px solid #C4960F", padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ color: "#C4960F", fontSize: 9, letterSpacing: 3, marginBottom: 10 }}>{label}</div>
      <p style={{ color: "#777", fontSize: 13, lineHeight: 1.9, fontWeight: 300 }}>{children}</p>
    </div>
  );
}

function ProgressCard({ label, value, pct, note, text }) {
  return (
    <div style={styles.progCard}>
      <div style={styles.progLabel}>{label}</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#C4960F", marginBottom: 6 }}>{value}</div>
      <p style={styles.progText}>{text}</p>
      <div style={{ background: "#1A1A1A", height: 1, marginTop: 14 }}>
        <div style={{ background: "#C4960F", height: 1, width: `${pct}%`, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ color: "#333", fontSize: 10, marginTop: 8, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{note}</div>
    </div>
  );
}

function ToolCard({ phase, icon, name, what, why, time, status, completed, onComplete, children }) {
  const [open, setOpen] = useState(false);
  const locked = status === "locked";

  return (
    <div style={{ ...styles.toolCard, ...(status === "ready" && !completed ? styles.toolCardActive : {}), ...(completed ? styles.toolCardDone : {}), ...(locked ? styles.toolCardLocked : {}) }}>
      <div style={{ fontSize: 24, marginBottom: 10, opacity: locked ? 0.3 : 1 }}>{icon}</div>
      <div style={{ color: locked ? "#2A2A2A" : "#C4960F", fontSize: 9, letterSpacing: 3, marginBottom: 8 }}>{phase}</div>
      <div style={{ color: locked ? "#2A2A2A" : completed ? "#C4960F" : "#DDD", fontSize: 15, fontFamily: "Georgia, serif", marginBottom: 8 }}>{name}</div>
      <p style={{ color: locked ? "#1E1E1E" : "#555", fontSize: 11, lineHeight: 1.6, marginBottom: 4, fontWeight: 300 }}>{what}</p>
      <p style={{ color: locked ? "#141414" : "#3A3A3A", fontSize: 11, lineHeight: 1.5, fontStyle: "italic", marginBottom: 12, fontWeight: 300 }}>{why}</p>
      <div style={{ color: locked ? "#1A1A1A" : "#333", fontSize: 10, letterSpacing: 1, marginBottom: 12 }}>{time}</div>

      {completed ? (
        <div style={styles.completedBadge}>✓ COMPLETED</div>
      ) : locked ? (
        <div style={styles.lockedBadge}>LOCKED</div>
      ) : (
        <button style={styles.toolBtn} onClick={() => setOpen(!open)}>
          {open ? "CLOSE TOOL" : "OPEN TOOL"}
        </button>
      )}

      {open && !locked && !completed && (
        <div style={styles.toolContent}>
          {children}
          <button style={{ ...styles.btnPrimary, marginTop: 20, width: "100%" }} onClick={() => { onComplete(); setOpen(false); }}>
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
    style: multiline ? styles.textarea : styles.input,
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={styles.fieldLabel}>{label}</label>
      {multiline ? <textarea {...props} rows={3} /> : <input {...props} />}
    </div>
  );
}

function WorkbookForm({ data, update }) {
  return (
    <div>
      <p style={styles.formIntro}>Complete each field honestly. There are no wrong answers. Your responses save automatically.</p>
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
      <p style={styles.formIntro}>A complete look at your financial picture. Be as accurate as possible. Estimates are fine.</p>
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
      <p style={styles.formIntro}>Review your last 30 days of spending honestly. This is not about judgment. It is about awareness.</p>
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
      <p style={styles.formIntro}>Your 10-minute weekly anchor. Complete this every week on the same day at the same time.</p>
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

const styles = {
  page: { fontFamily: "'Inter', sans-serif", background: "#0D0D0D", color: "#E8E4DC", minHeight: "100vh", paddingBottom: 80 },
  banner: { width: "100%", display: "block", maxHeight: 260, objectFit: "cover", objectPosition: "center 30%" },
  nav: { background: "#090909", borderBottom: "1px solid #2A2414", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontFamily: "Georgia, serif", color: "#C4960F", fontSize: 24, letterSpacing: 6 },
  logoSub: { color: "#3A3A3A", fontSize: 9, letterSpacing: 4, marginTop: 3 },
  navName: { color: "#888", fontSize: 13 },
  navStep: { color: "#C4960F", fontSize: 10, letterSpacing: 2, marginTop: 3 },
  saveToast: { position: "fixed", top: 16, right: 16, background: "#1A1505", border: "1px solid #C4960F", color: "#C4960F", fontSize: 12, padding: "8px 16px", zIndex: 9999, letterSpacing: 1 },
  hero: { padding: "60px 40px 52px", borderBottom: "1px solid #1A1A1A" },
  heroLabel: { color: "#C4960F", fontSize: 10, letterSpacing: 5, marginBottom: 20 },
  heroTitle: { fontFamily: "Georgia, serif", fontSize: 44, color: "#FAF8F4", fontWeight: 400, lineHeight: 1.15, marginBottom: 20 },
  congratsBox: { background: "#111", borderLeft: "2px solid #C4960F", padding: "22px 28px", marginBottom: 28, maxWidth: 680 },
  congratsLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 4, marginBottom: 12 },
  congratsText: { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#888", fontSize: 15, lineHeight: 2 },
  heroTransition: { color: "#666", fontSize: 15, lineHeight: 1.9, maxWidth: 640, marginBottom: 32, fontWeight: 300 },
  howBox: { background: "#111", border: "1px solid #1A1A1A", borderLeft: "2px solid #C4960F", padding: "22px 28px", maxWidth: 680 },
  howLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 3, marginBottom: 14 },
  howStep: { display: "flex", gap: 14, padding: "9px 0", borderBottom: "1px solid #141414", alignItems: "flex-start" },
  howNum: { color: "#C4960F", fontSize: 11, minWidth: 18, paddingTop: 1 },
  howText: { color: "#777", fontSize: 13, lineHeight: 1.7, fontWeight: 300 },
  autosaveBar: { background: "#1A1505", border: "1px solid #2A2414", padding: "14px 20px", maxWidth: 680, marginTop: 16, color: "#888", fontSize: 12, lineHeight: 1.7, fontWeight: 300 },
  section: { padding: "50px 40px 0" },
  sectionCtx: { color: "#444", fontSize: 12, lineHeight: 1.8, marginBottom: 24, fontWeight: 300, maxWidth: 640 },
  archTrack: { display: "flex", alignItems: "center", background: "#111", border: "1px solid #1A1A1A", padding: "24px 32px" },
  archDot: { width: 10, height: 10, borderRadius: "50%", background: "#1A1A1A", border: "1px solid #222", flexShrink: 0 },
  archDotActive: { background: "#C4960F", border: "1px solid #C4960F" },
  archDotNear: { border: "1px solid #333" },
  archLine: { flex: 1, height: 1, background: "#1A1A1A" },
  archNum: { color: "#333", fontSize: 9, letterSpacing: 2 },
  archName: { color: "#2A2A2A", fontSize: 10, fontFamily: "Georgia, serif", textAlign: "center" },
  archStatus: { color: "#333", fontSize: 9, letterSpacing: 1 },
  archBottom: { background: "#111", border: "1px solid #1A1A1A", borderTop: "none", padding: "14px 32px", color: "#2A2A2A", fontSize: 11, letterSpacing: 1, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic" },
  missionCard: { background: "#111", border: "1px solid #2A2414", borderTop: "2px solid #C4960F", padding: 40, position: "relative" },
  missionBadge: { position: "absolute", top: 20, right: 20, background: "#1A1505", border: "1px solid #C4960F", color: "#C4960F", fontSize: 9, letterSpacing: 3, padding: "5px 14px" },
  divider: { height: 1, background: "#1A1A1A", marginBottom: 24 },
  mcPhase: { color: "#C4960F", fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  mcTitle: { fontFamily: "Georgia, serif", fontSize: 26, color: "#FAF8F4", marginBottom: 24, fontWeight: 400 },
  stepsLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 3, marginBottom: 12 },
  step: { display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid #141414" },
  stepNum: { color: "#C4960F", fontSize: 11, minWidth: 20 },
  stepText: { color: "#777", fontSize: 12, lineHeight: 1.7, fontWeight: 300 },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "24px 0" },
  metaItem: { background: "#0F0F0F", padding: "14px 18px" },
  metaLabel: { color: "#333", fontSize: 9, letterSpacing: 2, marginBottom: 5 },
  metaVal: { color: "#666", fontSize: 12, lineHeight: 1.6, fontWeight: 300 },
  nextUnlock: { background: "#0F0F0F", borderTop: "1px solid #1A1A1A", padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 },
  nextLabel: { color: "#333", fontSize: 9, letterSpacing: 3 },
  nextVal: { color: "#C4960F", fontSize: 12, fontFamily: "Georgia, serif" },
  btnPrimary: { background: "#C4960F", color: "#0D0D0D", border: "none", padding: "13px 28px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 },
  btnSecondary: { background: "transparent", color: "#C4960F", border: "1px solid #2A2414", padding: "13px 28px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Inter, sans-serif" },
  mcHint: { color: "#333", fontSize: 11, marginTop: 12, fontStyle: "italic", fontFamily: "Georgia, serif" },
  shiftGrid: { display: "grid", gridTemplateColumns: "1fr 1px 1fr", background: "#111", border: "1px solid #1A1A1A", marginTop: 2 },
  shiftSide: { padding: 32 },
  shiftLabel: { fontSize: 9, letterSpacing: 4, marginBottom: 20 },
  shiftItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid #141414" },
  shiftDot: { width: 4, height: 4, borderRadius: "50%", marginTop: 6, flexShrink: 0 },
  shiftBottom: { padding: "20px 32px", borderTop: "1px solid #1A1A1A", gridColumn: "1/4", background: "#0F0F0F", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#555", fontSize: 13, lineHeight: 1.9 },
  toolIntro: { background: "#111", border: "1px solid #1A1A1A", borderLeft: "2px solid #C4960F", padding: "20px 24px", marginBottom: 14 },
  toolIntroLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 3, marginBottom: 8 },
  toolIntroText: { color: "#555", fontSize: 12, lineHeight: 1.8, fontWeight: 300 },
  toolGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  toolCard: { background: "#111", border: "1px solid #1A1A1A", padding: 22 },
  toolCardActive: { borderColor: "#C4960F" },
  toolCardDone: { borderColor: "#2A3A1A", background: "#0F110D" },
  toolCardLocked: { opacity: 0.5 },
  toolContent: { marginTop: 20, marginLeft: -22, marginRight: -22, marginBottom: -22, borderTop: "1px solid #e8e3da", padding: "20px 22px 22px", background: "#FAFAF8" },
  toolBtn: { background: "#C4960F", color: "#0D0D0D", border: "none", padding: "10px 20px", fontSize: 10, letterSpacing: 2, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, width: "100%" },
  completedBadge: { background: "#1A3A1A", border: "1px solid #2A5A2A", color: "#4A8A4A", fontSize: 10, letterSpacing: 2, padding: "6px 12px", display: "inline-block" },
  lockedBadge: { background: "#0F0F0F", border: "1px solid #141414", color: "#222", fontSize: 10, letterSpacing: 2, padding: "6px 12px", display: "inline-block" },
  formIntro: { color: "#4a4a4a", fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" },
  fieldLabel: { display: "block", color: "#1a1a2e", fontSize: 12, letterSpacing: 2, marginBottom: 6 },
  input: { width: "100%", background: "#ffffff", border: "1px solid #e8e3da", color: "#1a1a2e", fontSize: 15, padding: "10px 14px", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#ffffff", border: "1px solid #e8e3da", color: "#1a1a2e", fontSize: 15, padding: "10px 14px", fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" },
  expGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 },
  expItem: { background: "#111", border: "1px solid #1A1A1A", padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" },
  expDot: { width: 4, height: 4, borderRadius: "50%", background: "#C4960F", marginTop: 6, flexShrink: 0 },
  expText: { color: "#555", fontSize: 12, lineHeight: 1.6, fontWeight: 300 },
  expBottom: { background: "#0F0F0F", border: "1px solid #1A1A1A", padding: "16px 20px", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#444", fontSize: 13, lineHeight: 1.8 },
  progGrid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 },
  progGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  progCard: { background: "#111", border: "1px solid #1A1A1A", padding: 24 },
  progLabel: { color: "#333", fontSize: 9, letterSpacing: 3, marginBottom: 12 },
  progText: { color: "#3A3A3A", fontSize: 11, lineHeight: 1.7, fontWeight: 300 },
  rmItem: { background: "#111", border: "1px solid #1A1A1A", padding: "20px 28px", display: "flex", alignItems: "center", gap: 20 },
  rmItemActive: { borderColor: "#C4960F" },
  rmNum: { fontFamily: "Georgia, serif", fontSize: 28, color: "#1A1A1A", flexShrink: 0 },
  rmTag: { fontSize: 9, letterSpacing: 3, color: "#222", marginBottom: 3 },
  rmName: { fontFamily: "Georgia, serif", fontSize: 14, color: "#222", marginBottom: 2 },
  rmDesc: { color: "#1E1E1E", fontSize: 11, fontWeight: 300 },
  rmStatusActive: { background: "#1A1505", color: "#C4960F", border: "1px solid #2A2414", fontSize: 9, letterSpacing: 2, padding: "4px 12px" },
  rmStatusLocked: { background: "#0D0D0D", color: "#1A1A1A", border: "1px solid #141414", fontSize: 9, letterSpacing: 2, padding: "4px 12px" },
  rhythmGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 },
  rhCard: { background: "#111", border: "1px solid #1A1A1A", padding: 20 },
  rhDay: { color: "#C4960F", fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  rhText: { color: "#555", fontSize: 12, lineHeight: 1.7, fontWeight: 300 },
  rhBottom: { background: "#111", border: "1px solid #1A1A1A", borderTop: "none", padding: "14px 20px", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#3A3A3A", fontSize: 13 },
  advisor: { background: "#111", border: "1px solid #1A1A1A", padding: 28 },
  advisorLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 4, marginBottom: 16 },
  advisorGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  aiCard: { background: "#0F0F0F", padding: 16 },
  aiLabel: { color: "#333", fontSize: 9, letterSpacing: 2, marginBottom: 6 },
  aiText: { color: "#444", fontSize: 11, lineHeight: 1.6, fontWeight: 300 },
  robertSection: { padding: "50px 40px", borderTop: "1px solid #1A1A1A", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, alignItems: "start", marginTop: 50 },
  robertImg: { width: "100%", display: "block", objectFit: "cover", height: 420, border: "1px solid #1A1A1A" },
  robertImgLabel: { background: "#090909", border: "1px solid #2A2414", padding: "10px 16px" },
  robertImgName: { color: "#C4960F", fontSize: 11, letterSpacing: 2 },
  robertImgTitle: { color: "#3A3A3A", fontSize: 10, letterSpacing: 1, marginTop: 2 },
  robertLabel: { color: "#C4960F", fontSize: 9, letterSpacing: 4, marginBottom: 4 },
  robertContext: { color: "#3A3A3A", fontSize: 11, lineHeight: 1.7, marginBottom: 18, fontWeight: 300, borderBottom: "1px solid #141414", paddingBottom: 14 },
  robertText: { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#777", fontSize: 14, lineHeight: 2.1 },
  robertSig: { color: "#2A2A2A", fontSize: 11, marginTop: 18, letterSpacing: 1 },
  footer: { margin: "56px 40px 0", borderTop: "1px solid #1A1A1A", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerQuote: { fontFamily: "Georgia, serif", fontStyle: "italic", color: "#222", fontSize: 14 },
  footerLogo: { color: "#1A1A1A", fontFamily: "Georgia, serif", fontSize: 18, letterSpacing: 4 },
};
