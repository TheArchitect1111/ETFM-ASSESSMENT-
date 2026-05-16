import { useState, useEffect } from "react";

const LOGO_URL =
  "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";

const CALENDLY =
  "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const C = {
  bg: "#f7f4ef",
  dark: "#1a1a2e",
  gold: "#c9973a",
  goldSoft: "#c9973a18",
  text: "#1a1a2e",
  muted: "#7a7a8a",
  border: "#e8e3da",
  white: "#ffffff",
};

const SCORE_MAP = {
  no_idea: 10,
  some_inconsistent: 30,
  track_mentally: 50,
  track_most: 70,
  know_exactly: 90,
  disappears_bills: 10,
  spend_quickly: 20,
  try_save: 40,
  use_intentionally: 70,
  save_invest: 90,
  avoid: 10,
  emotional_decisions: 20,
  work_more: 40,
  ask_others: 50,
  slow_plan: 85,
  debt: 30,
  spending: 25,
  saving: 35,
  income_consistency: 40,
  planning_future: 45,
  investing: 50,
  fairly_organized: 80,
  stability: 50,
  peace_of_mind: 55,
  freedom_from_debt: 60,
  time_freedom: 65,
  ownership_wealth: 75,
  security_family: 70,
  dont_know: 20,
};

function calculateAwarenessScore(answers) {
  const scores = answers.map((a) => SCORE_MAP[a] || 40);
  return Math.round(scores.reduce((s, n) => s + n, 0) / scores.length);
}

const FREE_QUESTIONS = [
  {
    id: "awareness",
    bot: "How aware are you of where your money actually goes each month?",
    subtext: "Awareness is the first step. Be honest — there's no judgment here.",
    options: [
      { label: "I honestly have no clear idea", value: "no_idea" },
      { label: "I know some of it, but not consistently", value: "some_inconsistent" },
      { label: "I roughly track things mentally", value: "track_mentally" },
      { label: "I track most of my spending", value: "track_most" },
      { label: "I know exactly where my money goes", value: "know_exactly" },
    ],
  },
  {
    id: "extra_money",
    bot: "When extra money shows up unexpectedly, what usually happens to it?",
    subtext: "Where money goes when there's 'extra' reveals the real pattern.",
    options: [
      { label: "It disappears into bills and expenses", value: "disappears_bills" },
      { label: "I spend it quickly", value: "spend_quickly" },
      { label: "I try to save it, but something usually comes up", value: "try_save" },
      { label: "I use it intentionally toward goals", value: "use_intentionally" },
      { label: "I usually save or invest it", value: "save_invest" },
    ],
  },
  {
    id: "stress_response",
    bot: "When financial pressure increases, what usually happens?",
    subtext: "Your stress response shapes your financial decisions more than income does.",
    options: [
      { label: "I avoid thinking about it", value: "avoid" },
      { label: "I make emotional or impulsive decisions", value: "emotional_decisions" },
      { label: "I try to work more to compensate", value: "work_more" },
      { label: "I ask others for advice but still feel uncertain", value: "ask_others" },
      { label: "I slow down and make a plan", value: "slow_plan" },
    ],
  },
  {
    id: "structural_weakness",
    bot: "Which part of your financial life currently feels least under control?",
    subtext: "This identifies where the system is breaking first.",
    options: [
      { label: "Debt", value: "debt" },
      { label: "Spending", value: "spending" },
      { label: "Saving", value: "saving" },
      { label: "Income consistency", value: "income_consistency" },
      { label: "Planning for the future", value: "planning_future" },
      { label: "Investing", value: "investing" },
      { label: "I feel fairly organized financially", value: "fairly_organized" },
    ],
  },
  {
    id: "future_vision",
    bot: "What are you ultimately trying to create financially?",
    subtext: "Defining your destination is the first act of financial strategy.",
    options: [
      { label: "Stability", value: "stability" },
      { label: "Peace of mind", value: "peace_of_mind" },
      { label: "Freedom from debt", value: "freedom_from_debt" },
      { label: "Time freedom", value: "time_freedom" },
      { label: "Ownership and wealth", value: "ownership_wealth" },
      { label: "Security for my family", value: "security_family" },
      { label: "I honestly don't know yet", value: "dont_know" },
    ],
  },
];

const BLUEPRINT_QUESTIONS = [
  {
    id: "full_review",
    section: "Financial Visibility",
    bot: "When was the last time you reviewed ALL of your financial obligations and resources together?",
    subtext: "Income, bills, debt, savings, subscriptions, investments — all of it at once.",
    options: [
      { label: "Never", value: "never" },
      { label: "More than 12 months ago", value: "over_12mo" },
      { label: "Within the last few months", value: "few_months" },
      { label: "Within the last 30 days", value: "last_30_days" },
      { label: "I review everything consistently", value: "consistent" },
    ],
  },
  {
    id: "income_expense_accuracy",
    section: "Financial Visibility",
    bot: "If you had to estimate your total monthly income and total monthly spending right now, how accurate would you be?",
    subtext: "This reveals the gap between awareness and actual knowledge.",
    options: [
      { label: "I honestly would not know", value: "would_not_know" },
      { label: "I could estimate income, but not spending", value: "income_only" },
      { label: "I know most of it, but not precisely", value: "most_not_precise" },
      { label: "I know both fairly accurately", value: "fairly_accurate" },
      { label: "I track both consistently and precisely", value: "precise" },
    ],
  },
  {
    id: "least_control",
    section: "Financial Visibility",
    bot: "Which part of your financial life currently feels the least under control?",
    subtext: "Where your system breaks first is where we start building.",
    options: [
      { label: "Debt", value: "debt" },
      { label: "Spending", value: "spending" },
      { label: "Saving", value: "saving" },
      { label: "Income consistency", value: "income_consistency" },
      { label: "Investing", value: "investing" },
      { label: "Planning for the future", value: "planning" },
      { label: "I feel generally organized financially", value: "organized" },
    ],
  },
  {
    id: "extra_money_pattern",
    section: "Pattern Recognition",
    bot: "The last time you had extra money available, what happened to it?",
    subtext: "This is one of the most revealing questions about your financial pattern.",
    options: [
      { label: "It disappeared into everyday expenses", value: "disappeared" },
      { label: "I spent it on things I wanted or felt I deserved", value: "spent_deserved" },
      { label: "An emergency or unexpected situation consumed it", value: "emergency" },
      { label: "I partially saved or invested it", value: "partially_saved" },
      { label: "I intentionally allocated it toward a goal", value: "intentional" },
    ],
  },
  {
    id: "repeated_behavior",
    section: "Pattern Recognition",
    bot: "Which financial behavior has repeated most often in your life?",
    subtext: "Patterns repeat because they're structural — not because of willpower.",
    options: [
      { label: "Starting plans but not maintaining them", value: "not_maintaining" },
      { label: "Spending emotionally or impulsively", value: "emotional_spending" },
      { label: "Avoiding financial decisions until pressure builds", value: "avoidance" },
      { label: "Helping others financially at my own expense", value: "helping_others" },
      { label: "Constantly restarting financially", value: "restarting" },
      { label: "Feeling stuck despite working hard", value: "stuck_working" },
      { label: "I've built fairly consistent habits", value: "consistent_habits" },
    ],
  },
  {
    id: "pressure_response",
    section: "Pattern Recognition",
    bot: "When financial pressure increases, what is your typical response?",
    subtext: "Your response pattern under pressure is your most important financial habit.",
    options: [
      { label: "Avoid it completely", value: "avoid" },
      { label: "Make fast emotional decisions", value: "fast_emotional" },
      { label: "Try to work more to compensate", value: "work_more" },
      { label: "Talk to others but still feel uncertain", value: "talk_uncertain" },
      { label: "Step back and create a plan", value: "step_back_plan" },
      { label: "Stay structured and respond intentionally", value: "structured_response" },
    ],
  },
  {
    id: "emotional_stress",
    section: "Pattern Recognition",
    bot: "Which financial situation creates the most emotional stress for you?",
    subtext: "Emotional stress reveals where your system feels most fragile.",
    options: [
      { label: "Unexpected expenses", value: "unexpected_expenses" },
      { label: "Debt balances", value: "debt_balances" },
      { label: "Not having savings", value: "no_savings" },
      { label: "Feeling behind compared to others", value: "feeling_behind" },
      { label: "Uncertainty about the future", value: "future_uncertainty" },
      { label: "Not knowing what move to make next", value: "dont_know_move" },
      { label: "Fear of failure financially", value: "fear_failure" },
    ],
  },
  {
    id: "income_predictability",
    section: "System Architecture",
    bot: "How predictable is your income from month to month?",
    subtext: "Income volatility changes your emergency fund size, debt strategy, and automation approach.",
    options: [
      { label: "Extremely unpredictable", value: "extremely_unpredictable" },
      { label: "Somewhat inconsistent", value: "somewhat_inconsistent" },
      { label: "Mostly stable", value: "mostly_stable" },
      { label: "Very stable", value: "very_stable" },
      { label: "Multiple stable income sources", value: "multiple_stable" },
    ],
  },
  {
    id: "consumer_debt",
    section: "System Architecture",
    bot: "Approximately how much consumer debt do you currently carry?",
    subtext: "Credit cards, personal loans, auto loans — not mortgage.",
    options: [
      { label: "Under $5,000", value: "under_5k" },
      { label: "$5,000 – $25,000", value: "5k_25k" },
      { label: "$25,000 – $75,000", value: "25k_75k" },
      { label: "Over $75,000", value: "over_75k" },
      { label: "I'm currently debt free", value: "debt_free" },
    ],
  },
  {
    id: "income_runway",
    section: "System Architecture",
    bot: "If your income stopped today, how long could you maintain your current lifestyle?",
    subtext: "This is your financial runway — one of the most important numbers to know.",
    options: [
      { label: "Less than 1 month", value: "under_1mo" },
      { label: "1 – 3 months", value: "1_3mo" },
      { label: "3 – 6 months", value: "3_6mo" },
      { label: "6 – 12 months", value: "6_12mo" },
      { label: "Over 12 months", value: "over_12mo" },
    ],
  },
  {
    id: "money_organization",
    section: "System Architecture",
    bot: "How is your money currently organized?",
    subtext: "Structure determines behavior more than intention does.",
    options: [
      { label: "Everything flows through one account", value: "one_account" },
      { label: "Multiple accounts but no real structure", value: "multiple_no_structure" },
      { label: "Basic budgeting system", value: "basic_budget" },
      { label: "Organized accounts for specific purposes", value: "organized_accounts" },
      { label: "Automated and intentionally structured", value: "automated_structured" },
    ],
  },
  {
    id: "automation_level",
    section: "System Architecture",
    bot: "How much of your financial life currently operates automatically?",
    subtext: "Automation is the difference between reacting and building.",
    options: [
      { label: "Almost nothing", value: "almost_nothing" },
      { label: "A few bills only", value: "few_bills" },
      { label: "Some savings or investing", value: "some_savings" },
      { label: "Most major systems are automated", value: "most_automated" },
      { label: "My finances are intentionally systemized", value: "fully_systemized" },
    ],
  },
  {
    id: "most_pressure",
    section: "System Architecture",
    bot: "Which area currently creates the MOST financial pressure in your life?",
    subtext: "This is where your system breaks first.",
    options: [
      { label: "Monthly bills", value: "monthly_bills" },
      { label: "Debt payments", value: "debt_payments" },
      { label: "Inconsistent income", value: "inconsistent_income" },
      { label: "Lack of savings", value: "lack_savings" },
      { label: "Taxes", value: "taxes" },
      { label: "Spending habits", value: "spending_habits" },
      { label: "Supporting others financially", value: "supporting_others" },
      { label: "Not knowing what to prioritize", value: "no_priority" },
    ],
  },
  {
    id: "actively_building",
    section: "Ownership & Positioning",
    bot: "Which of these are you actively building right now?",
    subtext: "This separates survival from ownership trajectory.",
    options: [
      { label: "Emergency savings", value: "emergency_savings" },
      { label: "Retirement accounts", value: "retirement" },
      { label: "Investments", value: "investments" },
      { label: "Business ownership", value: "business" },
      { label: "Real estate or property", value: "real_estate" },
      { label: "Passive income", value: "passive_income" },
      { label: "None consistently yet", value: "none" },
    ],
  },
  {
    id: "financial_freedom_meaning",
    section: "Ownership & Positioning",
    bot: "What would financial freedom realistically mean for your life?",
    subtext: "Most people have never defined this. The answer shapes everything.",
    options: [
      { label: "Peace of mind", value: "peace_mind" },
      { label: "Freedom from debt", value: "debt_free" },
      { label: "More time freedom", value: "time_freedom" },
      { label: "Security for my family", value: "family_security" },
      { label: "Ownership and wealth building", value: "ownership_wealth" },
      { label: "Freedom to leave work I dislike", value: "leave_work" },
      { label: "The ability to stop surviving financially", value: "stop_surviving" },
    ],
  },
  {
    id: "current_financial_life",
    section: "Ownership & Positioning",
    bot: "Which statement best describes your current financial life?",
    subtext: "Honest positioning is the foundation of real strategy.",
    options: [
      { label: "I'm surviving month to month", value: "surviving" },
      { label: "I'm stable but not progressing", value: "stable_not_progressing" },
      { label: "I'm making progress slowly", value: "slow_progress" },
      { label: "I'm building intentionally", value: "building_intentionally" },
      { label: "I feel financially aligned and strategic", value: "aligned_strategic" },
    ],
  },
  {
    id: "five_year_feeling",
    section: "Future Trajectory",
    bot: "If nothing financially changed over the next 5 years, how would you honestly feel?",
    subtext: "This is your compass. Be honest with yourself.",
    options: [
      { label: "Scared", value: "scared" },
      { label: "Frustrated", value: "frustrated" },
      { label: "Disappointed", value: "disappointed" },
      { label: "Stuck", value: "stuck" },
      { label: "Mostly okay but limited", value: "okay_limited" },
      { label: "Optimistic", value: "optimistic" },
      { label: "Confident", value: "confident" },
    ],
  },
  {
    id: "biggest_barrier",
    section: "Future Trajectory",
    bot: "What is the biggest thing standing between you and the financial life you want?",
    subtext: "Your answer here shapes your entire roadmap.",
    options: [
      { label: "Lack of structure", value: "no_structure" },
      { label: "Inconsistent habits", value: "inconsistent_habits" },
      { label: "Lack of financial knowledge", value: "no_knowledge" },
      { label: "Debt", value: "debt" },
      { label: "Income limitations", value: "income_limits" },
      { label: "Fear or overwhelm", value: "fear_overwhelm" },
      { label: "No clear long-term strategy", value: "no_strategy" },
      { label: "Trying to do everything alone", value: "doing_alone" },
    ],
  },
];

const optionBtn = {
  display: "block",
  width: "100%",
  padding: "16px",
  marginBottom: "12px",
  backgroundColor: C.white,
  color: C.text,
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  textAlign: "left",
  transition: "all 0.2s ease",
};

export default function ETFMAssessment() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasSid = urlParams.get("session");
  const hasEmailDeepLink = urlParams.get("showBlueprint") && urlParams.get("email");

  const getInitialScreen = () => {
    if (hasSid) return "loading";
    if (hasEmailDeepLink) return "snapshot_confirmed";
    return "intro";
  };

  const [screen, setScreen] = useState(getInitialScreen());
  const [freeIndex, setFreeIndex] = useState(0);
  const [freeAnswers, setFreeAnswers] = useState([]);
  const [blueprintIndex, setBlueprintIndex] = useState(0);
  const [blueprintAnswers, setBlueprintAnswers] = useState([]);

  const [firstName, setFirstName] = useState(
    urlParams.get("firstName") ? decodeURIComponent(urlParams.get("firstName")) : ""
  );

  const [email, setEmail] = useState(
    urlParams.get("email") ? decodeURIComponent(urlParams.get("email")) : ""
  );

  const [loading, setLoading] = useState(false);
  const [awarenessScore, setAwarenessScore] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen, freeIndex, blueprintIndex]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session");
    const cancelled = params.get("cancelled");

    if (sid) {
      setSessionId(sid);

      if (cancelled) {
        setScreen("blueprint_cancelled");
      } else {
        checkSession(sid);
      }
    }
  }, []);

  const checkSession = async (sid) => {
    try {
      const res = await fetch(`/api/blueprint-session?session_id=${sid}`);
      const data = await res.json();

      if (data.status === "paid") {
        setFirstName(data.first_name || "");
        setEmail(data.email || "");
        setScreen("blueprint_chat");
      } else {
        setScreen("blueprint_unpaid");
      }
    } catch (err) {
      console.error(err);
      setScreen("blueprint_unpaid");
    }
  };

  const selectFreeAnswer = (value) => {
    const newAnswers = [...freeAnswers, value];
    setFreeAnswers(newAnswers);

    if (freeIndex < FREE_QUESTIONS.length - 1) {
      setFreeIndex(freeIndex + 1);
    } else {
      const score = calculateAwarenessScore(newAnswers);
      setAwarenessScore(score);
      setScreen("transition");
    }
  };

  const handleFreeSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !email.trim()) {
      return alert("Please fill in both fields");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscribe",
          firstName,
          email,
          answers: freeAnswers.map((value, i) => ({
            question: FREE_QUESTIONS[i].bot,
            answer: value,
          })),
        }),
      });

      await res.json();
      setScreen("snapshot_confirmed");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlueprintStart = async () => {
    if (!firstName.trim() || !email.trim()) {
      return alert("Please fill in both fields");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/blueprint-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          email,
          firstName,
          freeAnswers: freeAnswers.reduce((acc, val, i) => {
            acc[FREE_QUESTIONS[i].id] = val;
            return acc;
          }, {}),
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectBlueprintAnswer = (value) => {
    const newAnswers = [...blueprintAnswers, value];
    setBlueprintAnswers(newAnswers);

    if (blueprintIndex < BLUEPRINT_QUESTIONS.length - 1) {
      setBlueprintIndex(blueprintIndex + 1);
    } else {
      setScreen("blueprint_complete");
      submitBlueprintReport(newAnswers);
    }
  };

  const submitBlueprintReport = async (answers) => {
    try {
      await fetch("/api/blueprint-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          sessionId,
          blueprintAnswers: answers.map((value, i) => ({
            question: BLUEPRINT_QUESTIONS[i].bot,
            answer: value,
          })),
        }),
      });
    } catch (err) {
      console.error("Blueprint submit error:", err);
    }
  };

  const PageWrap = ({ children, maxWidth = "560px" }) => (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth, width: "100%", textAlign: "center" }}>{children}</div>
    </div>
  );

  const GoldLabel = ({ text }) => (
    <p
      style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "3px",
        color: C.gold,
        marginBottom: "16px",
      }}
    >
      {text}
    </p>
  );

  const Divider = () => (
    <div style={{ borderTop: `1px solid ${C.border}`, margin: "32px 0" }} />
  );

  if (screen === "loading") {
    return (
      <PageWrap>
        <p style={{ color: C.muted, fontSize: "14px", fontFamily: "Georgia, serif" }}>
          Loading your session...
        </p>
      </PageWrap>
    );
  }

  if (screen === "intro") {
    return (
      <PageWrap maxWidth="600px">
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            backgroundColor: C.dark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
        >
          <img
            src={LOGO_URL}
            alt="ETFM"
            style={{ width: "86px", height: "86px", objectFit: "contain" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        <GoldLabel text="Escape The Financial Matrix" />

        <h1
          style={{
            fontSize: "42px",
            fontFamily: "Georgia, serif",
            marginBottom: "20px",
            color: C.text,
            lineHeight: "1.2",
          }}
        >
          Your financial life has a pattern. It's time to see it clearly.
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: C.muted,
            marginBottom: "40px",
            lineHeight: "1.7",
          }}
        >
          The ETFM Snapshot is a 5-question diagnostic that identifies your financial
          archetype, calculates your Awareness Score, and delivers a personalized
          strategic insight — free.
        </p>

        <button
          onClick={() => setScreen("chat")}
          style={{
            backgroundColor: C.gold,
            color: C.dark,
            border: "none",
            padding: "16px 44px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Begin Your Snapshot →
        </button>

        <p style={{ fontSize: "12px", color: C.muted, marginTop: "16px" }}>
          5 questions · 2 minutes · No obligation
        </p>
      </PageWrap>
    );
  }

  if (screen === "chat") {
    const q = FREE_QUESTIONS[freeIndex];
    const progress = ((freeIndex + 1) / FREE_QUESTIONS.length) * 100;

    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "40px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                fontSize: "11px",
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              ETFM Snapshot
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
              {freeIndex + 1} of {FREE_QUESTIONS.length}
            </p>
          </div>

          <div
            style={{
              marginBottom: "36px",
              backgroundColor: C.border,
              height: "3px",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: C.gold,
                height: "100%",
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "32px",
              padding: "24px",
              backgroundColor: C.white,
              borderRadius: "10px",
              border: `1px solid ${C.border}`,
            }}
          >
            <p style={{ color: C.muted, fontSize: "13px", margin: "0 0 10px" }}>
              {q.subtext}
            </p>
            <h2
              style={{
                fontSize: "22px",
                fontFamily: "Georgia, serif",
                color: C.text,
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {q.bot}
            </h2>
          </div>

          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectFreeAnswer(opt.value)}
              style={optionBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.goldSoft;
                e.currentTarget.style.borderColor = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.white;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "transition") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: C.bg,
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "580px", width: "100%", textAlign: "center" }}>
          <GoldLabel text="Snapshot Complete" />

          <h2
            style={{
              fontSize: "32px",
              fontFamily: "Georgia, serif",
              color: C.text,
              marginBottom: "16px",
              lineHeight: "1.3",
            }}
          >
            Your evaluation has been processed.
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: C.muted,
              marginBottom: "40px",
              lineHeight: "1.7",
            }}
          >
            What you've uncovered today is not a reflection of your potential. It's a
            reflection of the systems currently shaping your financial life.
          </p>

          <div
            style={{
              backgroundColor: C.dark,
              borderRadius: "12px",
              padding: "36px 30px",
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: C.gold,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Your ETFM Strategic Score
            </p>

            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "rgba(201,151,58,0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(201,151,58,0.3)",
              }}
            >
              <span style={{ color: C.white, fontSize: "14px" }}>Awareness</span>
              <span
                style={{
                  color: C.gold,
                  fontSize: "22px",
                  fontFamily: "Georgia, serif",
                  fontWeight: "bold",
                }}
              >
                {awarenessScore}/100
              </span>
            </div>

            {["Structure", "Momentum", "Ownership Positioning", "System Strength"].map(
              (cat) => (
                <div
                  key={cat}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span style={{ color: "#6a6a7a", fontSize: "14px" }}>{cat}</span>
                  <span style={{ color: "#4a4a5a", fontSize: "13px", fontStyle: "italic" }}>
                    Locked
                  </span>
                </div>
              )
            )}

            <p
              style={{
                color: "#6a6a7a",
                fontSize: "12px",
                textAlign: "center",
                marginTop: "20px",
                marginBottom: 0,
              }}
            >
              Your full Strategic Score and Snapshot will be delivered to your inbox.
            </p>
          </div>

          <div
            style={{
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "36px 30px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontFamily: "Georgia, serif",
                color: C.text,
                marginBottom: "8px",
              }}
            >
              Send my Snapshot and Strategic Score
            </h3>

            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "24px" }}>
              Enter your details to receive your personalized results.
            </p>

            <form onSubmit={handleFreeSubmit}>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                    color: C.muted,
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px", textAlign: "left" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                    color: C.muted,
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: loading ? C.muted : C.gold,
                  color: C.dark,
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Processing..." : "Send My Snapshot →"}
              </button>
            </form>

            <p
              style={{
                fontSize: "11px",
                color: C.muted,
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              Your information is never sold or shared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "snapshot_confirmed") {
    return (
      <PageWrap>
        <GoldLabel text="Your Next Step" />

        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Georgia, serif",
            color: C.text,
            marginBottom: "20px",
            lineHeight: "1.3",
          }}
        >
          {firstName
            ? `${firstName}, your Snapshot has been delivered.`
            : "Your Snapshot has been delivered."}
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          Your Financial Snapshot, Archetype, and Awareness Score have already been
          delivered to your inbox. Your next step is deciding how deep you want to go.
        </p>

        <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: C.dark,
              borderRadius: "10px",
              padding: "28px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: C.gold,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Strategic Blueprint
            </p>

            <h3
              style={{
                color: C.white,
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                marginBottom: "12px",
                lineHeight: "1.3",
              }}
            >
              Go deeper with the 18-question diagnostic
            </h3>

            <p
              style={{
                color: "#a0a0b8",
                fontSize: "14px",
                marginBottom: "16px",
                lineHeight: "1.7",
              }}
            >
              Your Snapshot showed where you are. The Strategic Blueprint identifies
              why and delivers your personalized roadmap, structural analysis, and
              30-Day Reset Protocol.
            </p>

            <p
              style={{
                color: C.gold,
                fontSize: "13px",
                marginBottom: "16px",
                fontStyle: "italic",
              }}
            >
              ★ Your $47 will be credited toward the $499 Strategic Reset Session if
              you upgrade.
            </p>

            <button
              onClick={() => setScreen("blueprint_bridge")}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: C.gold,
                color: C.dark,
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Unlock Your Strategic Blueprint — $47 →
            </button>
          </div>

          <div
            style={{
              backgroundColor: C.white,
              border: `2px solid ${C.gold}`,
              borderRadius: "10px",
              padding: "28px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: C.gold,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Premium Strategic Reset
            </p>

            <h3
              style={{
                color: C.dark,
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                marginBottom: "12px",
                lineHeight: "1.3",
              }}
            >
              Work directly with Robert Brickey
            </h3>

            <p
              style={{
                color: C.muted,
                fontSize: "14px",
                marginBottom: "16px",
                lineHeight: "1.7",
              }}
            >
              A private 60-minute Strategic Reset Session built around your actual
              financial structure, goals, pressures, and long-term positioning.
            </p>

            <button
              onClick={() => setScreen("session_bridge")}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: C.white,
                color: C.gold,
                border: `2px solid ${C.gold}`,
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Apply for the Strategic Reset Session — $499 →
            </button>
          </div>
        </div>

        <Divider />

        <p style={{ fontSize: "13px", color: C.muted }}>
          Questions? <strong>exit@etfm.systems</strong>
        </p>
      </PageWrap>
    );
  }

  if (screen === "blueprint_bridge") {
    return (
      <PageWrap>
        <GoldLabel text="Strategic Blueprint" />

        <h2
          style={{
            fontSize: "34px",
            fontFamily: "Georgia, serif",
            color: C.text,
            marginBottom: "16px",
            lineHeight: "1.3",
          }}
        >
          Here's what happens next.
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            lineHeight: "1.7",
            marginBottom: "32px",
          }}
        >
          After completing your payment you'll answer 18 deeper diagnostic questions.
          Then your personalized Strategic Blueprint report is generated and delivered
          to your inbox within a few minutes.
        </p>

        <div
          style={{
            backgroundColor: C.dark,
            borderRadius: "10px",
            padding: "28px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: C.gold,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "16px",
            }}
          >
            What's included
          </p>

          {[
            "18-question strategic diagnostic",
            "Personalized escape roadmap",
            "5-Step ETFM Framework PDF",
            "Robert's personal video message",
            "30-Day Strategic Reset Protocol",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "8px 0",
                color: "#c8c8d8",
                fontSize: "15px",
                lineHeight: "1.6",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              ✓ &nbsp;{item}
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              backgroundColor: "rgba(201,151,58,0.12)",
              borderRadius: "6px",
              border: "1px solid rgba(201,151,58,0.3)",
            }}
          >
            <p style={{ color: C.gold, fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
              ★ <strong>Upgrade Credit:</strong> Your $47 will be fully credited
              toward the $499 Strategic Reset Session if you choose to work directly
              with Robert after receiving your Blueprint.
            </p>
          </div>
        </div>

        <button
          onClick={handleBlueprintStart}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: loading ? C.muted : C.gold,
            color: C.dark,
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "12px",
          }}
        >
          {loading ? "Setting up your Blueprint..." : "Get the Strategic Blueprint — $47"}
        </button>

        <button
          onClick={() => setScreen("snapshot_confirmed")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            color: C.muted,
            border: `1px solid ${C.border}`,
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Go back
        </button>

        <Divider />

        <p style={{ fontSize: "13px", color: C.muted }}>
          Questions? <strong>exit@etfm.systems</strong>
        </p>
      </PageWrap>
    );
  }

  if (screen === "session_bridge") {
    return (
      <PageWrap>
        <GoldLabel text="Strategic Reset Session" />

        <h2
          style={{
            fontSize: "34px",
            fontFamily: "Georgia, serif",
            color: C.text,
            marginBottom: "16px",
            lineHeight: "1.3",
          }}
        >
          Here's what happens next.
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            lineHeight: "1.7",
            marginBottom: "32px",
          }}
        >
          You'll book a private 60-minute session directly with Robert Brickey.
          Before your session, you'll complete a pre-session financial intake so
          Robert can review your situation and come prepared with a tailored plan.
        </p>

        <div
          style={{
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            padding: "28px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: C.gold,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "16px",
            }}
          >
            What's included — $499
          </p>

          {[
            "Pre-session financial intake & discovery review",
            "60-minute private strategy session with Robert Brickey",
            "Personalized financial plan & strategic framework",
            "Full Matrix Score & structural analysis",
            "Decision rules & financial policy system",
            "Custom 90-day strategic reset roadmap",
            "Session recording",
            "30 days of priority email support",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "8px 0",
                color: C.text,
                fontSize: "14px",
                lineHeight: "1.6",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              ✓ &nbsp;{item}
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              backgroundColor: C.goldSoft,
              borderRadius: "6px",
              border: `1px solid rgba(201,151,58,0.3)`,
            }}
          >
            <p style={{ color: C.dark, fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
              ★ <strong>Already purchased the Blueprint?</strong> Your $47 will be
              credited toward this session. Mention it when booking.
            </p>
          </div>
        </div>

        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            backgroundColor: C.gold,
            color: C.dark,
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            textDecoration: "none",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        >
          Book Your Strategic Reset Session →
        </a>

        <button
          onClick={() => setScreen("snapshot_confirmed")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            color: C.muted,
            border: `1px solid ${C.border}`,
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Go back
        </button>

        <Divider />

        <p style={{ fontSize: "13px", color: C.muted }}>
          Questions? <strong>exit@etfm.systems</strong>
        </p>
      </PageWrap>
    );
  }

  if (screen === "blueprint_chat") {
    const q = BLUEPRINT_QUESTIONS[blueprintIndex];
    const progress = ((blueprintIndex + 1) / BLUEPRINT_QUESTIONS.length) * 100;

    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "40px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                fontSize: "11px",
                color: C.gold,
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              Strategic Blueprint — {q.section}
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
              {blueprintIndex + 1} of {BLUEPRINT_QUESTIONS.length}
            </p>
          </div>

          <div
            style={{
              marginBottom: "36px",
              backgroundColor: C.border,
              height: "3px",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: C.gold,
                height: "100%",
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "32px",
              padding: "24px",
              backgroundColor: C.white,
              borderRadius: "10px",
              border: `1px solid ${C.border}`,
            }}
          >
            <p style={{ color: C.muted, fontSize: "13px", margin: "0 0 10px" }}>
              {q.subtext}
            </p>
            <h2
              style={{
                fontSize: "22px",
                fontFamily: "Georgia, serif",
                color: C.text,
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {q.bot}
            </h2>
          </div>

          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectBlueprintAnswer(opt.value)}
              style={optionBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.goldSoft;
                e.currentTarget.style.borderColor = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.white;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "blueprint_complete") {
    return (
      <PageWrap maxWidth="620px">
        <img
          src={LOGO_URL}
          alt="ETFM"
          style={{ width: "64px", display: "block", margin: "0 auto 16px" }}
        />

        <GoldLabel text="Blueprint Complete" />

        <h1
          style={{
            margin: 0,
            color: C.text,
            fontSize: "30px",
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            lineHeight: "1.4",
          }}
        >
          Your Strategic Blueprint has been prepared.
        </h1>

        <p
          style={{
            margin: "24px 0 16px",
            color: C.text,
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          You took an important step today.
        </p>

        <p
          style={{
            margin: "0 0 32px",
            color: C.muted,
            fontSize: "15px",
            lineHeight: "1.9",
          }}
        >
          Your personalized report, escape roadmap, 30-Day Reset Protocol, and
          Strategic Score breakdown will be delivered shortly. This typically takes
          3–5 minutes. Check your spam folder if you don't see it.
        </p>

        <Divider />

        <p
          style={{
            margin: 0,
            color: C.text,
            fontSize: "16px",
            lineHeight: "2.2",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}
        >
          Clarity creates control.
          <br />
          Control creates momentum.
          <br />
          Momentum creates freedom.
        </p>
      </PageWrap>
    );
  }

  if (screen === "blueprint_unpaid") {
    return (
      <PageWrap maxWidth="500px">
        <h2
          style={{
            fontSize: "28px",
            fontFamily: "Georgia, serif",
            color: C.text,
            marginBottom: "16px",
          }}
        >
          Payment Required
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            marginBottom: "32px",
            lineHeight: "1.7",
          }}
        >
          This session hasn't been activated yet. Complete your payment to unlock the
          Strategic Blueprint.
        </p>

        <a
          href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d"
          style={{
            display: "inline-block",
            backgroundColor: C.gold,
            color: C.dark,
            textDecoration: "none",
            padding: "14px 36px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Get the Strategic Blueprint — $47
        </a>
      </PageWrap>
    );
  }

  if (screen === "blueprint_cancelled") {
    return (
      <PageWrap maxWidth="500px">
        <h2
          style={{
            fontSize: "28px",
            fontFamily: "Georgia, serif",
            color: C.text,
            marginBottom: "16px",
          }}
        >
          No problem.
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            marginBottom: "32px",
            lineHeight: "1.7",
          }}
        >
          Your Snapshot is still in your inbox. When you're ready to go deeper, the
          Blueprint will be here.
        </p>

        <a
          href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d"
          style={{
            display: "inline-block",
            backgroundColor: C.gold,
            color: C.dark,
            textDecoration: "none",
            padding: "14px 36px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Unlock the Strategic Blueprint — $47
        </a>
      </PageWrap>
    );
  }

  return null;
}
