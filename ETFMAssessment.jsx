import { useState, useEffect, useRef } from "react";

const LOGO_URL = "https://raw.githubusercontent...

const C = {
  bg: "#f7f4ef",
  dark: "#1a1a2e",
  gold: "#c9973a",
  goldLight: "#f0c97a",
  goldSoft: "#c9973a18",
  text: "#1a1a2e",
  muted: "#7a7a8a",
  border: "#e8e3da",
  white: "#ffffff",
  amber: "#b45309",
};

const QUESTIONS = [
  {
    id: "emotional_state",
    bot: "How would you describe your current relationship with money right now?",
    subtext: "There's no right or wrong answer here — just be honest with yourself.",
    options: [
      { label: "Stressed and overwhelmed", value: "stressed", tone: "high_stress" },
      { label: "Stuck — I know something needs to change but I don't know where to start", value: "stuck", tone: "stuck" },
      { label: "Avoidant — I try not to think about it too much", value: "avoidant", tone: "avoidant" },
      { label: "Uncertain — I'm doing okay but I'm not confident", value: "uncertain", tone: "uncertain" },
      { label: "Motivated but lost — I want to do better but I'm unclear on how", value: "motivated_lost", tone: "motivated" },
      { label: "In control and building — I have structure and I'm growing", value: "in_control", tone: "growth" },
    ],
  },
  {
    id: "money_flow",
    bot: "When money comes in, what typically happens next?",
    subtext: "Think about your actual patterns, not what you wish would happen.",
    options: [
      { label: "It goes to bills and I deal with what's left", value: "reactive_bills", tone: "reactive" },
      { label: "It disappears faster than I expect", value: "disappears", tone: "reactive" },
      { label: "I have a rough idea of where it goes but no real system", value: "rough_idea", tone: "awareness" },
      { label: "I follow a loose budget or plan most of the time", value: "loose_plan", tone: "structure" },
      { label: "I have a clear system — savings, bills, and goals are organized", value: "clear_system", tone: "structured" },
    ],
  },
  {
    id: "habits",
    bot: "How would you describe your financial habits and consistency?",
    subtext: "Habits are patterns — not character flaws. Honesty here creates clarity.",
    options: [
      { label: "I often make decisions in the moment without a plan", value: "impulsive", tone: "impulsive" },
      { label: "I start strong but struggle to maintain consistency", value: "inconsistent", tone: "inconsistent" },
      { label: "I avoid dealing with finances until I have to", value: "avoidant_habits", tone: "avoidant" },
      { label: "I'm somewhat consistent but have gaps I haven't addressed", value: "partial", tone: "partial" },
      { label: "I'm fairly disciplined and consistent with my financial routines", value: "disciplined", tone: "disciplined" },
    ],
  },
  {
    id: "mindset",
    bot: "When you think about building financial stability, what comes up for you most?",
    subtext: "Our beliefs about money often shape our behavior more than our income does.",
    options: [
      { label: "It feels out of reach — like it's not really possible for someone like me", value: "hopeless", tone: "scarcity" },
      { label: "Fear of failing or making the wrong move keeps me stuck", value: "fear", tone: "fear" },
      { label: "I didn't grow up learning this — I'm still figuring it out", value: "learned", tone: "learning" },
      { label: "I believe it's possible but I'm not sure I have what it takes", value: "uncertain_belief", tone: "uncertain" },
      { label: "I'm confident it's possible — I just need the right system and direction", value: "confident", tone: "confident" },
    ],
  },
  {
    id: "obstacle",
    bot: "What feels like your biggest obstacle to financial progress right now?",
    subtext: "Sometimes naming it clearly is the first step to moving past it.",
    options: [
      { label: "Not enough income to work with", value: "income", tone: "income" },
      { label: "Debt that feels impossible to get ahead of", value: "debt", tone: "debt" },
      { label: "Disorganization — I don't have a clear system", value: "disorganized", tone: "structure" },
      { label: "Stress and overwhelm that makes it hard to think clearly", value: "stress", tone: "stress" },
      { label: "Lack of knowledge — I don't know enough about how it all works", value: "knowledge", tone: "education" },
      { label: "Inconsistency — I start but don't follow through", value: "inconsistency", tone: "behavior" },
      { label: "External pressure — family, emergencies, or circumstances outside my control", value: "external", tone: "external" },
    ],
  },
  {
    id: "strengths",
    bot: "Before we look at your results — what's one thing you know you have going for you?",
    subtext: "Every financial journey has assets. Let's identify yours.",
    options: [
      { label: "I'm resilient — I've survived and kept going through hard times", value: "resilient", tone: "resilient" },
      { label: "I'm resourceful — I figure things out even with limited resources", value: "resourceful", tone: "resourceful" },
      { label: "I'm motivated — I genuinely want to change and I'm willing to put in the work", value: "motivated", tone: "motivated" },
      { label: "I'm disciplined in other areas of my life — I can apply that here", value: "disciplined", tone: "disciplined" },
      { label: "I have people around me who support my growth", value: "support", tone: "support" },
      { label: "I'm already taking steps — I'm not starting from zero", value: "taking_steps", tone: "momentum" },
    ],
  },
];

// Calculates a teased partial score (0–100) based on tone patterns
function calcTeasedScore(answers) {
  const scoreMap = {
    high_stress: 10, stuck: 20, avoidant: 15, uncertain: 35, motivated: 50, growth: 85,
    reactive: 15, awareness: 40, structure: 60, structured: 80,
    impulsive: 15, inconsistent: 30, avoidant_habits: 20, partial: 50, disciplined: 80,
    scarcity: 10, fear: 20, learning: 45, confident: 75,
    income: 20, debt: 25, stress: 20, education: 35, behavior: 30, external: 40,
    resilient: 70, resourceful: 70, momentum: 75,
    support: 60,
  };
  const total = answers.reduce((sum, a) => sum + (scoreMap[a.tone] || 30), 0);
  return Math.round(total / answers.length);
}

const ProgressBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < current ? C.gold : C.border, transition: "background 0.4s ease" }} />
    ))}
  </div>
);

const BotMessage = ({ text, subtext, animate }) => {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }
  }, [animate]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: subtext ? 8 : 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={LOGO_URL} alt="ETFM" style={{ width: 36, height: 36, objectFit: "cover" }} />
        </div>
        <div style={{ background: C.dark, color: C.white, borderRadius: "4px 18px 18px 18px", padding: "14px 18px", fontSize: 16, lineHeight: 1.6, fontFamily: "'Lora', serif", maxWidth: "85%" }}>{text}</div>
      </div>
      {subtext && <p style={{ color: C.muted, fontSize: 13, margin: "0 0 0 48px", fontStyle: "italic", lineHeight: 1.5 }}>{subtext}</p>}
    </div>
  );
};

const OptionButton = ({ label, selected, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 18px", marginBottom: 8, background: selected ? C.goldSoft : C.white, border: `1.5px solid ${selected ? C.gold : C.border}`, borderRadius: 10, cursor: disabled ? "default" : "pointer", color: C.text, fontSize: 15, lineHeight: 1.5, fontFamily: "'Lora', serif", fontWeight: selected ? 600 : 400, transition: "all 0.2s ease", outline: "none" }}>{label}</button>
);

const UserBubble = ({ text }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
    <div style={{ background: C.gold, color: C.dark, borderRadius: "18px 4px 18px 18px", padding: "12px 18px", fontSize: 15, lineHeight: 1.5, fontFamily: "'Lora', serif", fontWeight: 600, maxWidth: "80%" }}>{text}</div>
  </div>
);

// Logo component — always renders on dark background to prevent white bleed
const ETFMLogo = ({ size = 90, style = {} }) => (
  <div style={{ width: size, height: size, borderRadius: 16, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, ...style }}>
    <img src={LOGO_URL} alt="ETFM" style={{ width: size, height: size, objectFit: "contain" }} />
  </div>
);

const TransitionScreen = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setLine1(true), 600);
    const t3 = setTimeout(() => setLine2(true), 1800);
    const t4 = setTimeout(() => setLine3(true), 3000);
    const t5 = setTimeout(() => setShowForm(true), 4200);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const fadeIn = (show) => ({ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "all 0.8s ease" });

  const handleSubmit = async () => {
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setError("");
    setSubmitting(true);
    try {
      await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscribe", firstName: firstName.trim(), email: email.trim() }),
      });
    } catch (e) { console.error("Subscribe error:", e); }
    setSubmitting(false);
    onSubmit({ firstName: firstName.trim(), email: email.trim() });
  };

  const inputStyle = { width: "100%", padding: "14px 16px", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", color: C.white, background: "rgba(255,255,255,0.08)", outline: "none", boxSizing: "border-box", marginBottom: 12 };

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: 32, ...fadeIn(line1) }}>
          <ETFMLogo size={90} style={{ margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Lora', serif", fontSize: 24, color: C.white, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
            You just did something most people never do.
          </p>
        </div>
        <div style={{ marginBottom: 24, ...fadeIn(line2) }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>
            You stopped. You looked honestly at where you are. And you decided it matters.
          </p>
        </div>
        <div style={{ marginBottom: 36, ...fadeIn(line3) }}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: 17, color: C.gold, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            Thank you for investing in your own future. This is a big step — keep going.
          </p>
        </div>
        <div style={{ ...fadeIn(showForm) }}>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,151,58,0.3)", borderRadius: 16, padding: "28px 24px", textAlign: "left" }}>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 16, color: C.white, textAlign: "center", margin: "0 0 6px", fontWeight: 600 }}>
              Your personalized ETFM Financial Snapshot is ready.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "0 0 24px" }}>
              Enter your details and we'll send it directly to your inbox.
            </p>
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>First Name</label>
            <input type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Email Address</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, marginBottom: error ? 8 : 20 }} />
            {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#f87171", margin: "0 0 16px" }}>{error}</p>}
            <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", padding: "16px", background: submitting ? "rgba(201,151,58,0.5)" : C.gold, color: C.dark, border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: submitting ? "default" : "pointer", fontFamily: "'Lora', serif" }}>
              {submitting ? "Sending..." : "Send My Snapshot →"}
            </button>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
              Your information will never be sold or shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Teased score bar component
const TeasedScoreBar = ({ score }) => {
  const bars = 10;
  const filledBars = Math.round((score / 100) * bars);
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,151,58,0.25)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          Your Matrix Score
        </span>
        <span style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>
          {score}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>/100</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 8, borderRadius: 4,
            background: i < filledBars ? `rgba(201,151,58,${0.4 + (i / bars) * 0.6})` : "rgba(255,255,255,0.08)",
            transition: `background 0.3s ease ${i * 60}ms`
          }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(201,151,58,0.2)", border: "1px solid rgba(201,151,58,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: C.gold }}>🔒</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.4 }}>
          Full breakdown — behavioral patterns, system leaks, and score analysis — unlocked in the <span style={{ color: C.gold }}>ETFM Financial Escape Blueprint</span>.
        </p>
      </div>
    </div>
  );
};

const ConfirmationScreen = ({ firstName, answers }) => {
  const score = answers ? calcTeasedScore(answers) : 42;

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 500, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <ETFMLogo size={90} style={{ margin: "0 auto 20px" }} />
          <div style={{ background: "rgba(201,151,58,0.12)", border: `1px solid ${C.gold}40`, borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: C.white, margin: "0 0 12px", lineHeight: 1.3 }}>
              {firstName ? `You're on your way, ${firstName}.` : "You're on your way."}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 10px" }}>
              Your ETFM Financial Snapshot is on its way to your inbox. Check your email — including spam.
            </p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 14, color: C.gold, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
              "The first step toward change is awareness. The second step is acceptance."
            </p>
          </div>
        </div>

        {/* Teased Score */}
        <TeasedScoreBar score={score} />

        {/* Tier 2 — $47 */}
        <div style={{ background: "rgba(201,151,58,0.07)", border: `1px solid rgba(201,151,58,0.35)`, borderRadius: 16, padding: "24px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, margin: "0 0 4px" }}>Most Popular</p>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: C.white, margin: 0, lineHeight: 1.3 }}>ETFM Financial Escape Blueprint</h3>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <span style={{ fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 700, color: C.gold }}>$47</span>
            </div>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 14px" }}>
            Go beyond the snapshot. 8 additional deep-dive questions unlock a full AI-generated report built around your exact financial patterns.
          </p>

          {[
            "Full Matrix Score with complete breakdown",
            "Financial Identity deep analysis",
            "Behavioral pattern profile",
            "System leak identification — where money is silently escaping",
            "\"What This Is Costing You\" projection",
            "Personalized 30-day action plan",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ color: C.gold, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}

          <button
            onClick={() => window.open("https://buy.stripe.com/9B6dRad5653g7d77028Vi0b", "_blank")}
            style={{ width: "100%", padding: "15px", background: C.gold, color: C.dark, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Lora', serif", marginTop: 16 }}
          >
            Get My Full Blueprint — $47 →
          </button>
        </div>

        {/* Tier 3 — $499 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Premium</p>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: C.white, margin: 0, lineHeight: 1.3 }}>ETFM Strategic Reset Session</h3>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <span style={{ fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 700, color: C.white }}>$499</span>
            </div>
          </div>

          {[
            {
              title: "Strategic Wealth Blueprint Session",
              desc: "A personalized financial game plan to identify hidden leaks, restructure money flow, prioritize debt and ownership moves, uncover overlooked opportunities, and build long-term financial stability and leverage."
            },
            {
              title: "Pre-Session Financial Audit Form",
              desc: "Robert reviews your current financial structure, habits, and challenges before the session so time is focused on strategy, not discovery."
            },
            {
              title: "Custom 90-Day Execution Roadmap",
              desc: "A personalized action roadmap outlining your next 90 days of financial moves, priorities, and system adjustments."
            },
            {
              title: "Priority Email Access",
              desc: "30 days of follow-up support and strategic Q&A with Robert after the session."
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <span style={{ color: C.gold, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✦</span>
              <div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", display: "block", marginBottom: 2 }}>{item.title}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            </div>
          ))}

          <button
            onClick={() => window.open("https://buy.stripe.com/7sY14o7KMbrE693ckm8Vi0c", "_blank")}
            style={{ width: "100%", padding: "15px", background: "transparent", color: C.white, border: `1.5px solid rgba(255,255,255,0.25)`, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Lora', serif", marginTop: 8 }}
          >
            Book My Strategic Reset Session — $499 →
          </button>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          Questions? Email us at info@etfm.systems
        </p>
      </div>
    </div>
  );
};

export default function ETFMAssessment() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [userData, setUserData] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, phase, showOptions]);

  useEffect(() => {
    if (phase === "chat") setTimeout(() => setShowOptions(true), 800);
  }, [phase, currentQ]);

  const handleStart = () => {
    setCurrentQ(0); setAnswers([]); setSelectedOption(null);
    setShowOptions(false); setChatLog([{ type: "bot", q: QUESTIONS[0] }]);
    setUserData(null); setPhase("chat");
  };

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowOptions(false);
    const newAnswers = [...answers, { question: QUESTIONS[currentQ].bot, answer: option.label, tone: option.tone, id: QUESTIONS[currentQ].id }];
    setAnswers(newAnswers);
    setTimeout(() => {
      setChatLog(prev => [...prev, { type: "user", text: option.label }]);
      setSelectedOption(null);
      if (currentQ + 1 < QUESTIONS.length) {
        const next = currentQ + 1;
        setTimeout(() => {
          setChatLog(prev => [...prev, { type: "bot", q: QUESTIONS[next] }]);
          setCurrentQ(next);
          setTimeout(() => setShowOptions(true), 800);
        }, 600);
      } else {
        setTimeout(() => setPhase("transition"), 800);
      }
    }, 300);
  };

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            {/* Logo on dark pill so it never bleeds on light bg */}
            <div style={{ display: "inline-block", background: C.dark, borderRadius: 20, padding: 8, marginBottom: 20 }}>
              <img src={LOGO_URL} alt="ETFM Logo" style={{ width: 104, height: 104, objectFit: "contain", display: "block" }} />
            </div>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Escaping the Financial Matrix</div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, color: C.dark, margin: "0 0 12px", lineHeight: 1.3 }}>Your ETFM Financial Snapshot</h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>A guided self-awareness conversation — not a quiz, not a judgment. Just clarity about where you are and what's possible.</p>
          </div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 24 }}>
            {[["6 questions", "Takes about 2 minutes"], ["No numbers required", "No income, debt totals, or personal data"], ["Personalized snapshot", "Delivered to your inbox"]].map(([bold, light], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text }}><strong>{bold}</strong> — {light}</span>
              </div>
            ))}
          </div>
          <button onClick={handleStart} style={{ width: "100%", padding: "16px", background: C.dark, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontFamily: "'Lora', serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em" }}>
            Begin the Conversation →
          </button>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Your responses are used only to generate your personalized snapshot and will never be sold or shared.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "transition") return <TransitionScreen onSubmit={(info) => { setUserData(info); setPhase("confirmation"); }} />;
  if (phase === "confirmation") return <ConfirmationScreen firstName={userData?.firstName} answers={answers} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 20px 120px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          {/* Logo in dark container for chat header */}
          <div style={{ background: C.dark, borderRadius: 10, padding: 4, display: "inline-flex" }}>
            <img src={LOGO_URL} alt="ETFM" style={{ height: 28, width: 28, objectFit: "contain" }} />
          </div>
          <div style={{ color: C.muted, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{currentQ + 1} of {QUESTIONS.length}</div>
        </div>
        <ProgressBar current={currentQ + (selectedOption ? 1 : 0)} total={QUESTIONS.length} />
        {chatLog.map((entry, i) => (
          entry.type === "bot"
            ? <BotMessage key={i} text={entry.q.bot} subtext={entry.q.subtext} animate={i > 0} />
            : <UserBubble key={i} text={entry.text} />
        ))}
        {showOptions && currentQ < QUESTIONS.length && (
          <div style={{ paddingLeft: 48 }}>
            {QUESTIONS[currentQ].options.map((opt, i) => (
              <OptionButton key={i} label={opt.label} selected={selectedOption?.value === opt.value} onClick={() => handleSelect(opt)} disabled={!!selectedOption} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
