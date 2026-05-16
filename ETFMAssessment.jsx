import { useState } from "react";

const C = {
  bg: "#f7f4ef",
  dark: "#16162b",
  gold: "#c9973a",
  text: "#1f1f2e",
  muted: "#6f7185",
  border: "#ddd8cf",
  white: "#ffffff",
};

export default function ETFMAssessment() {
  const [screen, setScreen] = useState("snapshot_confirmed");

  const firstName = "Robert";

  const PageWrap = ({ children, maxWidth = "720px" }) => (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth }}>{children}</div>
    </div>
  );

  const GoldLabel = ({ text }) => (
    <p
      style={{
        color: C.gold,
        textTransform: "uppercase",
        letterSpacing: "3px",
        fontSize: "11px",
        marginBottom: "16px",
      }}
    >
      {text}
    </p>
  );

  const Divider = () => (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        margin: "36px 0",
      }}
    />
  );

  if (screen === "snapshot_confirmed") {
    return (
      <PageWrap>
        <GoldLabel text="Your Next Step" />

        <h2
          style={{
            fontSize: "42px",
            fontFamily: "Georgia, serif",
            color: C.text,
            lineHeight: "1.25",
            marginBottom: "24px",
          }}
        >
          {firstName}, your Snapshot has been delivered.
        </h2>

        <p
          style={{
            fontSize: "17px",
            color: C.muted,
            lineHeight: "1.8",
            marginBottom: "42px",
          }}
        >
          Your Financial Snapshot, Archetype, and Awareness Score have already
          been delivered to your inbox. Choose the next level of clarity,
          structure, and strategic direction below.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* $47 Blueprint */}

          <div
            style={{
              backgroundColor: C.dark,
              borderRadius: "14px",
              padding: "34px",
            }}
          >
            <p
              style={{
                color: C.gold,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "11px",
                marginBottom: "12px",
              }}
            >
              Strategic Blueprint
            </p>

            <h3
              style={{
                color: C.white,
                fontFamily: "Georgia, serif",
                fontSize: "30px",
                lineHeight: "1.3",
                marginBottom: "16px",
              }}
            >
              Unlock the $47 Strategic Blueprint
            </h3>

            <p
              style={{
                color: "#c6c7d8",
                fontSize: "15px",
                lineHeight: "1.8",
                marginBottom: "26px",
              }}
            >
              Go beyond awareness and uncover the patterns, behaviors,
              structural weaknesses, and system leaks shaping your financial
              life.
            </p>

            {[
              "18-question advanced diagnostic",
              "Personalized Strategic Blueprint report",
              "System leak & behavior analysis",
              "30-Day Reset Protocol",
              "Custom financial roadmap",
              "ETFM Framework PDF",
              "$47 credit toward the $499 Strategic Reset",
            ].map((item) => (
              <div
                key={item}
                style={{
                  color: "#ececf7",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                ✓ {item}
              </div>
            ))}

            <button
              onClick={() => setScreen("blueprint")}
              style={{
                width: "100%",
                marginTop: "28px",
                backgroundColor: C.gold,
                color: C.dark,
                border: "none",
                borderRadius: "8px",
                padding: "16px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Unlock Your Strategic Blueprint — $47 →
            </button>
          </div>

          {/* $499 Session */}

          <div
            style={{
              backgroundColor: C.white,
              border: `2px solid ${C.gold}`,
              borderRadius: "14px",
              padding: "34px",
            }}
          >
            <p
              style={{
                color: C.gold,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "11px",
                marginBottom: "12px",
              }}
            >
              Premium Strategic Reset
            </p>

            <h3
              style={{
                color: C.text,
                fontFamily: "Georgia, serif",
                fontSize: "30px",
                lineHeight: "1.3",
                marginBottom: "16px",
              }}
            >
              Work Directly With Robert Brickey — $499
            </h3>

            <p
              style={{
                color: C.muted,
                fontSize: "15px",
                lineHeight: "1.8",
                marginBottom: "26px",
              }}
            >
              A private strategic advisory experience built around your actual
              financial structure, habits, pressure points, goals, and long-term
              direction.
            </p>

            {[
              "Pre-session financial intake review",
              "60-minute private strategy session",
              "Personalized financial plan",
              "Full ETFM Matrix Score analysis",
              "Custom 90-day execution roadmap",
              "Decision framework & structure planning",
              "Session recording",
              "30 days of priority email support",
              "$47 Blueprint credit applied if purchased",
            ].map((item) => (
              <div
                key={item}
                style={{
                  color: C.text,
                  fontSize: "14px",
                  lineHeight: "1.8",
                  padding: "8px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                ✓ {item}
              </div>
            ))}

            <button
              onClick={() => setScreen("session")}
              style={{
                width: "100%",
                marginTop: "28px",
                backgroundColor: C.white,
                color: C.gold,
                border: `2px solid ${C.gold}`,
                borderRadius: "8px",
                padding: "16px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Apply for the Strategic Reset Session — $499 →
            </button>
          </div>
        </div>

        <Divider />

        <p
          style={{
            color: C.muted,
            fontSize: "13px",
          }}
        >
          Questions? <strong>exit@etfm.systems</strong>
        </p>
      </PageWrap>
    );
  }

  if (screen === "blueprint") {
    return (
      <PageWrap>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            color: C.text,
          }}
        >
          Blueprint Page Placeholder
        </h2>
      </PageWrap>
    );
  }

  if (screen === "session") {
    return (
      <PageWrap>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            color: C.text,
          }}
        >
          Session Page Placeholder
        </h2>
      </PageWrap>
    );
  }

  return null;
}
