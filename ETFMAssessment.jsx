import { useState, useEffect, useRef } from "react";

const LOGO_URL = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";

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
      { label: "I'm already taking steps — I'm not starting from zero", value: "steps", tone: "progress" },
    ],
  },
];

export default function ETFMAssessment() {
  const [screen, setScreen] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // AUTO SCROLL TO TOP ON SCREEN CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const startAssessment = () => {
    setScreen("chat");
  };

  const selectAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setScreen("transition");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !email.trim()) {
      alert("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          answers,
        }),
      });

      if (!response.ok) throw new Error("Failed");

      setScreen("confirmation");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // INTRO SCREEN
  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", textAlign: "center" }}>
        <img src={LOGO_URL} alt="ETFM" style={{ width: "80px", marginBottom: "30px" }} onError={(e) => (e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23c9973a' width='100' height='100'/%3E%3Ctext x='50' y='50' fontSize='40' fill='%231a1a2e' textAnchor='middle' dy='.3em'%3EETFM%3C/text%3E%3C/svg%3E")} />
        <h1 style={{ fontSize: "48px", fontFamily: "Lora, serif", marginBottom: "20px", color: C.text }}>Escape The Financial Matrix</h1>
        <p style={{ fontSize: "18px", color: C.muted, maxWidth: "600px", marginBottom: "40px" }}>Get clarity on your financial situation and discover your personalized path forward.</p>
        <button onClick={startAssessment} style={{ backgroundColor: C.gold, color: C.text, border: "none", padding: "16px 40px", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}>
          Begin the Conversation →
        </button>
      </div>
    );
  }

  // CHAT SCREEN
  if (screen === "chat") {
    const currentQuestion = QUESTIONS[questionIndex];
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "40px 20px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px", backgroundColor: C.border, height: "4px", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ backgroundColor: C.gold, height: "100%", width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%`, transition: "width 0.3s ease" }} />
          </div>

          <div style={{ marginBottom: "40px", padding: "20px", backgroundColor: C.white, borderRadius: "8px", border: `1px solid ${C.border}` }}>
            <p style={{ color: C.muted, fontSize: "14px", marginBottom: "10px" }}>{currentQuestion.subtext}</p>
            <h2 style={{ fontSize: "24px", fontFamily: "Lora, serif", color: C.text, margin: "0" }}>{currentQuestion.bot}</h2>
          </div>

          <div>
            {currentQuestion.options.map((option, idx) => (
              <button key={idx} onClick={() => selectAnswer(option.value)} style={{ display: "block", width: "100%", padding: "16px", marginBottom: "12px", backgroundColor: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "pointer", fontSize: "15px", textAlign: "left", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.target.style.backgroundColor = C.goldSoft; e.target.style.borderColor = C.gold; }} onMouseLeave={(e) => { e.target.style.backgroundColor = C.white; e.target.style.borderColor = C.border; }}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TRANSITION SCREEN
  if (screen === "transition") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "40px 20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", fontFamily: "Lora, serif", color: C.text, marginBottom: "20px" }}>You stopped. You looked honestly at where you are. And you decided it matters.</h2>
          <p style={{ fontSize: "18px", color: C.gold, fontStyle: "italic", marginBottom: "50px" }}>Thank you for investing in your own future. This is a big step — keep going.</p>

          <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "40px 30px" }}>
            <h3 style={{ fontSize: "20px", fontFamily: "Lora, serif", color: C.text, marginBottom: "12px" }}>Your personalized ETFM Financial Snapshot is ready.</h3>
            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "30px" }}>Enter your details and we'll send it directly to your inbox.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: C.muted }}>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" style={{ width: "100%", padding: "12px", backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "15px", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: C.muted }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: "100%", padding: "12px", backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: "6px", fontSize: "15px", boxSizing: "border-box" }} />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: loading ? C.muted : C.gold, color: C.text, border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending..." : "Send My Snapshot →"}
              </button>
            </form>

            <p style={{ fontSize: "12px", color: C.muted, marginTop: "20px" }}>Your information will never be sold or shared.</p>
          </div>
        </div>
      </div>
    );
  }

  // CONFIRMATION SCREEN
  if (screen === "confirmation") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "40px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "42px", fontFamily: "Lora, serif", color: C.text, marginBottom: "20px" }}>You're officially out of the matrix.</h2>
            <p style={{ fontSize: "18px", color: C.text }}>Your personalized snapshot and full Matrix Score are on their way to your inbox. Check it out and take that first step.</p>
          </div>

          <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "30px", textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "15px" }}>Your Matrix Score</p>
            <h3 style={{ fontSize: "64px", fontFamily: "Lora, serif", color: C.gold, margin: "0 0 15px 0" }}>??/100</h3>
            <p style={{ fontSize: "13px", color: C.muted }}>Your full score breakdown will be in your email.</p>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "30px", textAlign: "center", fontSize: "14px", color: C.muted }}>
            <p>Questions? Reach out: <strong>info@etfm.systems</strong></p>
            <p style={{ marginTop: "10px" }}>© 2024 Escape The Financial Matrix. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }
}
