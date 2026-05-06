import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#f7f4ef",
  card: "#ffffff",
  dark: "#1a1a2e",
  darkMid: "#16213e",
  gold: "#c9973a",
  goldLight: "#f0c97a",
  goldSoft: "#c9973a18",
  teal: "#2a7f6f",
  tealSoft: "#2a7f6f15",
  text: "#1a1a2e",
  muted: "#7a7a8a",
  border: "#e8e3da",
  white: "#ffffff",
  amber: "#b45309",
  amberSoft: "#fef3c7",
  greenSoft: "#ecfdf5",
  green: "#065f46",
  blueSoft: "#eff6ff",
  blue: "#1e40af",
  purpleSoft: "#f5f3ff",
  purple: "#4c1d95",
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

const SYSTEM_PROMPT = `You are the ETFM Financial Roadmap AI — a calm, emotionally intelligent, and empowering guide built on the Escaping the Financial Matrix framework.

Your core mission: Help people move from financial confusion and survival mode to clarity, structure, and ownership.

TONE REQUIREMENTS:
- Calm, clear, emotionally intelligent, practical, reflective, non-judgmental
- Empowering without being artificially motivational or hype-driven
- Sound like a thoughtful coach, not a corporate finance app
- Never use shame, fear tactics, heavy jargon, or unrealistic promises

GUARDRAILS (NON-NEGOTIABLE):
- Educational guidance and behavioral insight ONLY — never financial, legal, tax, investment, or clinical advice
- Never make the user feel judged, shamed, or labeled
- Avoid false certainty or one-size-fits-all solutions
- Do not overwhelm — prioritize clarity
- Never use fear-based language
- Build confidence and capability, not dependency on the AI

OUTPUT FORMAT — You must respond with ONLY valid JSON (no markdown, no backticks, no preamble). Use this exact structure:

{
  "patternLabel": "Short 3-5 word label for their pattern (e.g. 'Reactive Financial Pressure')",
  "patternSummary": "1-2 sentences: reflect their emotional state with empathy. Make them feel seen.",
  "keyObservation": "1-2 sentences: name the core behavioral pattern or system gap driving their situation.",
  "immediateOpportunity": "1-2 sentences: one accessible shift that could create real movement for them.",
  "recommendedFirstStep": "1-2 sentences: the single most important place to focus first and why.",
  "actions": [
    "Concrete action step 1 — specific and immediately doable",
    "Concrete action step 2 — specific and immediately doable"
  ]
}`;

function buildPrompt(answers) {
  const lines = answers.map(a => `${a.question}: ${a.answer}`).join("\n");
  return `A user completed the ETFM free assessment. Here are their responses:\n\n${lines}\n\nGenerate their personalized ETFM Financial Snapshot as JSON. Be specific to their answers — not generic. Make them feel truly seen.`;
}

const ProgressBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        flex: 1, height: 3, borderRadius: 999,
        background: i < current ? C.gold : C.border,
        transition: "background 0.4s ease",
      }} />
    ))}
  </div>
);

const BotMessage = ({ text, subtext, animate }) => {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.5s ease",
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: subtext ? 8 : 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: C.dark,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: 14, color: C.gold, fontWeight: 700,
        }}>E</div>
        <div style={{
          background: C.dark, color: C.white,
          borderRadius: "4px 18px 18px 18px",
          padding: "14px 18px",
          fontSize: 16, lineHeight: 1.6,
          fontFamily: "'Lora', serif",
          maxWidth: "85%",
        }}>{text}</div>
      </div>
      {subtext && (
        <p style={{
          color: C.muted, fontSize: 13, margin: "0 0 0 48px",
          fontStyle: "italic", lineHeight: 1.5,
        }}>{subtext}</p>
      )}
    </div>
  );
};

const OptionButton = ({ label, selected, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: "block", width: "100%", textAlign: "left",
      padding: "14px 18px", marginBottom: 8,
      background: selected ? C.goldSoft : C.white,
      border: `1.5px solid ${selected ? C.gold : C.border}`,
      borderRadius: 10, cursor: disabled ? "default" : "pointer",
      color: selected ? C.dark : C.text,
      fontSize: 15, lineHeight: 1.5,
      fontFamily: "'Lora', serif",
      fontWeight: selected ? 600 : 400,
      transition: "all 0.2s ease",
      outline: "none",
    }}
  >{label}</button>
);

const UserBubble = ({ text }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
    <div style={{
      background: C.gold, color: C.dark,
      borderRadius: "18px 4px 18px 18px",
      padding: "12px 18px",
      fontSize: 15, lineHeight: 1.5,
      fontFamily: "'Lora', serif",
      fontWeight: 600, maxWidth: "80%",
    }}>{text}</div>
  </div>
);

const InsightCard = ({ icon, label, color, bgColor, children }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: "20px",
    marginBottom: 12,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: bgColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, flexShrink: 0,
      }}>{icon}</div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: color,
      }}>{label}</span>
    </div>
    <div style={{
      fontFamily: "'Lora', serif",
      fontSize: 15, lineHeight: 1.7,
      color: C.text,
    }}>{children}</div>
  </div>
);

const ActionStep = ({ number, text }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 14,
    padding: "14px 0",
    borderBottom: number === 1 ? `1px solid ${C.border}` : "none",
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: C.dark, color: C.gold,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13, fontWeight: 700,
      flexShrink: 0, marginTop: 1,
    }}>{number}</div>
    <p style={{
      fontFamily: "'Lora', serif",
      fontSize: 15, lineHeight: 1.7,
      color: C.text, margin: 0,
    }}>{text}</p>
  </div>
);

const RoadmapFeature = ({ text }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
    <div style={{
      width: 20, height: 20, borderRadius: "50%",
      background: "rgba(201,151,58,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, marginTop: 2,
      fontSize: 11, color: C.goldLight,
    }}>✓</div>
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14, lineHeight: 1.6,
      color: "rgba(255,255,255,0.8)",
    }}>{text}</span>
  </div>
);

const SnapshotResult = ({ data, loading, firstName }) => {
  if (loading) {
    return (
      <div>
        <div style={{
          background: C.dark, borderRadius: 16,
          padding: "28px 24px", marginBottom: 20,
          textAlign: "center",
        }}>
          <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Your Personalized
          </div>
          <div style={{ color: C.white, fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            ETFM Financial Snapshot
          </div>
          <div style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Based on your assessment responses</div>
        </div>
        <div style={{ textAlign: "center", padding: "40px 20px", background: C.white, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: `3px solid ${C.border}`,
            borderTop: `3px solid ${C.gold}`,
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: C.muted, fontSize: 14, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
            Analyzing your patterns and generating your snapshot...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div style={{
        background: C.dark, borderRadius: 16,
        padding: "28px 24px", marginBottom: 20,
        textAlign: "center",
      }}>
        <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
          Your Personalized
        </div>
        <div style={{ color: C.white, fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          {firstName ? `${firstName}'s ETFM Financial Snapshot` : "ETFM Financial Snapshot"}
        </div>
        <div style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Based on your assessment responses</div>
      </div>

      <div style={{
        background: C.goldSoft, border: `1px solid ${C.gold}30`,
        borderRadius: 14, padding: "16px 20px", marginBottom: 16,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: 14,
          color: C.amber, margin: 0, lineHeight: 1.6,
        }}>
          🌱 {firstName ? `Thank you, ${firstName}.` : "Thank you."} Your roadmap is on its way to your inbox.
        </p>
      </div>

      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 12,
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          color: C.muted, margin: "0 0 8px",
        }}>Your current pattern reflects</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{
            fontFamily: "'Lora', serif", fontSize: 19,
            fontWeight: 700, color: C.dark,
          }}>{data.patternLabel}</span>
        </div>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: 15,
          lineHeight: 1.7, color: C.text, margin: "12px 0 0",
        }}>{data.patternSummary}</p>
      </div>

      <InsightCard icon="🔍" label="Key Observation" color={C.blue} bgColor={C.blueSoft}>
        {data.keyObservation}
      </InsightCard>

      <InsightCard icon="💡" label="Immediate Opportunity" color={C.green} bgColor={C.greenSoft}>
        {data.immediateOpportunity}
      </InsightCard>

      <InsightCard icon="🛠️" label="Recommended First Step" color={C.purple} bgColor={C.purpleSoft}>
        {data.recommendedFirstStep}
      </InsightCard>

      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>
            Your Two Action Steps
          </span>
        </div>
        {data.actions && data.actions.map((action, i) => (
          <ActionStep key={i} number={i + 1} text={action} />
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, margin: "20px 0" }} />

      <div style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #2a1a4e 100%)`,
        borderRadius: 16, padding: "28px 24px",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: C.goldLight, margin: "0 0 8px",
        }}>Your Full ETFM Financial Roadmap Includes</p>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: 16,
          color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 20px",
        }}>
          Your snapshot reveals the surface. The expanded ETFM Roadmap uncovers the <em>why</em> behind your patterns and builds a strategic path forward — personalized to your specific situation.
        </p>
        <div style={{ marginBottom: 24 }}>
          {[
            "Deeper behavioral pattern analysis",
            "Personalized financial \"system leak\" identification",
            "Custom action priorities",
            "Financial mindset insights",
            "Strategic next-step recommendations",
            "Long-term positioning guidance",
          ].map((f, i) => <RoadmapFeature key={i} text={f} />)}
        </div>
        <button
          onClick={() => window.open("https://calendly.com/rbrickey", "_blank")}
          style={{
            background: C.gold, color: C.dark,
            border: "none", borderRadius: 10,
            padding: "16px 28px", fontSize: 16,
            fontWeight: 700, cursor: "pointer",
            fontFamily: "'Lora', serif", width: "100%",
            letterSpacing: "0.01em",
          }}>
          Book a Free Call with Robert →
        </button>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textAlign: "center", marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
          Deeper analysis · Priority action plan · Implementation strategy
        </p>
      </div>
    </div>
  );
};

const EmailCapture = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setError("");
    setSubmitting(true);

    // Subscribe to Mailchimp
    try {
      await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscribe",
          firstName: firstName.trim(),
          email: email.trim(),
        }),
      });
    } catch (e) {
      console.error("Mailchimp subscribe error:", e);
      // Don't block the user if Mailchimp fails
    }

    setSubmitting(false);
    onSubmit({ firstName: firstName.trim(), email: email.trim() });
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: C.text, background: C.white,
    outline: "none", boxSizing: "border-box",
    marginBottom: 12,
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.5s ease",
      maxWidth: 520, margin: "0 auto",
    }}>
      <div style={{
        background: C.dark, borderRadius: 16,
        padding: "32px 24px", marginBottom: 20,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
        <div style={{
          color: C.gold, fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", marginBottom: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}>Assessment Complete</div>
        <h2 style={{
          fontFamily: "'Lora', serif", fontSize: 22,
          color: C.white, margin: "0 0 14px", lineHeight: 1.3,
        }}>Your ETFM Assessment Is Complete</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0,
        }}>
          Your responses revealed important financial behavior patterns, stress points, and opportunities for growth.
        </p>
      </div>

      <div style={{
        background: C.white, borderRadius: 16,
        border: `1px solid ${C.border}`,
        padding: "28px 24px", marginBottom: 16,
      }}>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: 15,
          lineHeight: 1.7, color: C.text,
          margin: "0 0 24px", textAlign: "center",
        }}>
          Your personalized ETFM Financial Snapshot is ready. Enter your details to receive it now.
        </p>

        <label style={{
          display: "block", fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: C.muted, marginBottom: 6,
        }}>First Name</label>
        <input
          type="text"
          placeholder="Your first name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          style={inputStyle}
        />

        <label style={{
          display: "block", fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: C.muted, marginBottom: 6,
        }}>Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ ...inputStyle, marginBottom: error ? 8 : 20 }}
        />

        {error && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: "#b91c1c", margin: "0 0 16px",
          }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%", padding: "16px",
            background: submitting ? C.muted : C.dark,
            color: C.white,
            border: "none", borderRadius: 10,
            fontSize: 16, fontWeight: 600,
            fontFamily: "'Lora', serif",
            cursor: submitting ? "default" : "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {submitting ? "Saving..." : "Send My Roadmap →"}
        </button>

        <p style={{
          textAlign: "center", color: C.muted,
          fontSize: 12, marginTop: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Your responses are used only to generate your personalized snapshot and will never be sold or shared.
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
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const snapshotRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, phase, showOptions]);

  useEffect(() => {
    if (phase === "chat") {
      setTimeout(() => setShowOptions(true), 800);
    }
  }, [phase, currentQ]);

  const handleStart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowOptions(false);
    setChatLog([{ type: "bot", q: QUESTIONS[0] }]);
    setResultData(null);
    setLoading(false);
    setUserData(null);
    snapshotRef.current = null;
    setPhase("chat");
  };

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowOptions(false);

    const newAnswers = [...answers, {
      question: QUESTIONS[currentQ].bot,
      answer: option.label,
      tone: option.tone,
      id: QUESTIONS[currentQ].id,
    }];
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
        setTimeout(() => {
          setPhase("email");
          snapshotRef.current = generateSnapshot(newAnswers);
        }, 800);
      }
    }, 300);
  };

  const handleEmailSubmit = async (info) => {
    setUserData(info);
    setPhase("result");
    if (snapshotRef.current) await snapshotRef.current;
  };

  const generateSnapshot = async (finalAnswers) => {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt(finalAnswers) }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultData(parsed);
    } catch (e) {
      setResultData({
        patternLabel: "Reactive Financial Pressure",
        patternSummary: "You may be working hard to stay afloat while lacking a clear financial structure that creates long-term stability and control.",
        keyObservation: "Your responses suggest that stress may be driven more by inconsistency, overwhelm, or lack of system design than by effort alone.",
        immediateOpportunity: "Creating even small financial routines and clearer organization could significantly reduce mental pressure and improve decision-making clarity.",
        recommendedFirstStep: "Focus on building awareness before attempting major financial changes. Structure often creates momentum before income increases do.",
        actions: [
          "Track every dollar you spend for the next 7 days — no judgment, just awareness.",
          "Write down your three most important financial priorities and put them somewhere visible.",
        ],
      });
    }
    setLoading(false);
  };

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: C.dark, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 24, color: C.gold, fontWeight: 700,
              fontFamily: "'Lora', serif",
            }}>E</div>
            <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
              Escaping the Financial Matrix
            </div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, color: C.dark, margin: "0 0 12px", lineHeight: 1.3 }}>
              Your ETFM Financial Snapshot
            </h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              A guided self-awareness conversation — not a quiz, not a judgment. Just clarity about where you are and what's possible.
            </p>
          </div>

          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 24 }}>
            {[
              ["6 questions", "Takes about 2 minutes"],
              ["No numbers required", "No income, debt totals, or personal data"],
              ["Immediate insight", "AI-generated snapshot at the end"],
            ].map(([bold, light], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text }}>
                  <strong>{bold}</strong> — {light}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            style={{
              width: "100%", padding: "16px", background: C.dark, color: C.white,
              border: "none", borderRadius: 12, fontSize: 16,
              fontFamily: "'Lora', serif", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.02em",
            }}
          >
            Begin the Conversation →
          </button>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Your responses are used only to generate your personalized snapshot and will never be sold or shared.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "email") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 20px 60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ width: "100%", maxWidth: 520 }}>
          <EmailCapture onSubmit={handleEmailSubmit} />
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 20px 60px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <SnapshotResult data={resultData} loading={loading} firstName={userData?.firstName} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 20px 120px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
            ETFM Assessment
          </div>
          <div style={{ color: C.muted, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            {currentQ + 1} of {QUESTIONS.length}
          </div>
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
              <OptionButton
                key={i}
                label={opt.label}
                selected={selectedOption?.value === opt.value}
                onClick={() => handleSelect(opt)}
                disabled={!!selectedOption}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
