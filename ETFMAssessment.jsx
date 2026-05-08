// /src/ETFMAssessment.jsx

import React, { useState, useEffect, useRef } from 'react';

const C = {
  dark: '#1a1a2e',
  gold: '#c9973a',
  cream: '#f7f4ef',
  white: '#ffffff',
  lightGray: '#444',
  borderGray: '#555',
};

const questions = [
  {
    id: 1,
    text: "How would you describe your current emotional relationship with money?",
    options: [
      "Anxious and uncertain",
      "Frustrated but hopeful",
      "Disconnected or avoidant",
      "Cautiously optimistic"
    ]
  },
  {
    id: 2,
    text: "When money comes in, what typically happens to it?",
    options: [
      "It disappears without me knowing where",
      "I spend it on essentials + some impulse buys",
      "I save some but feel like it's never enough",
      "I have a clear plan for it"
    ]
  },
  {
    id: 3,
    text: "How consistent are you with financial habits?",
    options: [
      "I start strong but don't follow through",
      "I'm all over the place",
      "I'm somewhat disciplined",
      "I'm very consistent"
    ]
  },
  {
    id: 4,
    text: "What's your core belief about your financial future?",
    options: [
      "I'll never have enough",
      "It depends on luck or circumstances",
      "I can improve it with effort",
      "I'm in control of my financial destiny"
    ]
  },
  {
    id: 5,
    text: "What's your biggest obstacle to financial progress?",
    options: [
      "Lack of knowledge or education",
      "Emotional spending or impulsive decisions",
      "Low income or unstable work",
      "Overwhelm or not knowing where to start"
    ]
  },
  {
    id: 6,
    text: "What's one thing that's already going well for you?",
    options: [
      "I earn decent money",
      "I have some savings or investments",
      "I'm willing to learn and change",
      "I have supportive people around me"
    ]
  }
];

function ETFMAssessment() {
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // AUTO SCROLL TO TOP ON SCREEN CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  // AUTO SCROLL TO BOTTOM FOR MESSAGES
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startAssessment = () => {
    setCurrentScreen('chat');
    setMessages([
      {
        type: 'bot',
        text: "Welcome to the Escape The Financial Matrix assessment. I'm here to help you understand where you stand financially and what your next steps could be. Ready?"
      }
    ]);
  };

  const selectAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    const newMessages = [...messages];
    newMessages.push({
      type: 'user',
      text: option
    });

    if (currentQuestionIndex < questions.length - 1) {
      newMessages.push({
        type: 'bot',
        text: questions[currentQuestionIndex + 1].text
      });
      setMessages(newMessages);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setMessages(newMessages);
      setTimeout(() => {
        setCurrentScreen('transition');
      }, 800);
    }
  };

  const handleSendSnapshot = async (e) => {
    e.preventDefault();
    
    if (!firstName.trim() || !email.trim()) {
      alert('Please fill in both fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send snapshot');
      }

      const data = await response.json();
      setCurrentScreen('confirmation');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ INTRO SCREEN ============
  if (currentScreen === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: C.dark,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <img 
          src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/refs/heads/main/file_00000000e10471f5bb36fabf63d29869.png" 
          alt="ETFM Logo"
          style={{ width: '80px', marginBottom: '30px' }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23c9973a" width="100" height="100"/%3E%3Ctext x="50" y="50" fontSize="40" fill="%231a1a2e" textAnchor="middle" dy=".3em"%3EETFM%3C/text%3E%3C/svg%3E';
          }}
        />
        
        <h1 style={{
          fontSize: '48px',
          fontFamily: 'Lora, serif',
          marginBottom: '20px',
          fontWeight: 'normal'
        }}>
          Escape The Financial Matrix
        </h1>

        <p style={{
          fontSize: '18px',
          color: C.cream,
          maxWidth: '600px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Get clarity on your financial situation and discover your personalized path forward.
        </p>

        <button
          onClick={startAssessment}
          style={{
            backgroundColor: C.gold,
            color: C.dark,
            border: 'none',
            padding: '16px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'DM Sans, sans-serif'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Begin the Conversation →
        </button>
      </div>
    );
  }

  // ============ CHAT SCREEN ============
  if (currentScreen === 'chat') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: C.dark,
        color: C.white,
        padding: '20px',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          paddingTop: '20px'
        }}>
          {/* PROGRESS BAR */}
          <div style={{
            marginBottom: '30px',
            backgroundColor: C.borderGray,
            height: '4px',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: C.gold,
              height: '100%',
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* MESSAGES */}
          <div style={{ marginBottom: '30px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                  marginBottom: '20px',
                  animation: `fadeSlide 0.4s ease forwards`,
                  opacity: 0,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.type === 'bot' ? C.gold : C.borderGray,
                    color: msg.type === 'bot' ? C.dark : C.white,
                    padding: '16px 20px',
                    borderRadius: '12px',
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* OPTIONS */}
          <div style={{ marginBottom: '40px' }}>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(option)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '12px',
                  backgroundColor: C.borderGray,
                  color: C.white,
                  border: `1px solid ${C.gold}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = C.gold;
                  e.target.style.color = C.dark;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = C.borderGray;
                  e.target.style.color = C.white;
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // ============ TRANSITION SCREEN ============
  if (currentScreen === 'transition') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: C.dark,
        color: C.white,
        padding: '40px 20px',
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontFamily: 'Lora, serif',
            marginBottom: '20px',
            fontWeight: 'normal'
          }}>
            You stopped. You looked honestly at where you are. And you decided it matters.
          </h2>

          <p style={{
            fontSize: '18px',
            color: C.gold,
            fontStyle: 'italic',
            marginBottom: '50px',
            lineHeight: '1.6'
          }}>
            Thank you for investing in your own future. This is a big step — keep going.
          </p>

          <div style={{
            backgroundColor: C.lightGray,
            border: `1px solid ${C.gold}`,
            borderRadius: '12px',
            padding: '40px 30px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'Lora, serif',
              marginBottom: '12px',
              fontWeight: 'normal'
            }}>
              Your personalized ETFM Financial Snapshot is ready.
            </h3>

            <p style={{
              fontSize: '14px',
              color: '#aaa',
              marginBottom: '30px'
            }}>
              Enter your details and we'll send it directly to your inbox.
            </p>

            <form onSubmit={handleSendSnapshot} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                  color: '#bbb'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: C.dark,
                    border: `1px solid ${C.borderGray}`,
                    borderRadius: '6px',
                    color: C.white,
                    fontSize: '15px',
                    fontFamily: 'DM Sans, sans-serif',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                  color: '#bbb'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: C.dark,
                    border: `1px solid ${C.borderGray}`,
                    borderRadius: '6px',
                    color: C.white,
                    fontSize: '15px',
                    fontFamily: 'DM Sans, sans-serif',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isLoading ? '#666' : C.gold,
                  color: C.dark,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {isLoading ? 'Sending...' : 'Send My Snapshot →'}
              </button>
            </form>

            <p style={{
              fontSize: '12px',
              color: '#777',
              marginTop: '20px'
            }}>
              Your information will never be sold or shared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============ CONFIRMATION SCREEN ============
  if (currentScreen === 'confirmation') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: C.dark,
        color: C.white,
        padding: '40px 20px',
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontSize: '42px',
              fontFamily: 'Lora, serif',
              marginBottom: '20px',
              fontWeight: 'normal'
            }}>
              You're officially out of the matrix.
            </h2>

            <p style={{
              fontSize: '18px',
              color: C.cream,
              lineHeight: '1.6'
            }}>
              Your personalized snapshot and full Matrix Score are on their way to your inbox. Check it out and take that first step.
            </p>
          </div>

          {/* MATRIX SCORE TEASER */}
          <div style={{
            backgroundColor: C.borderGray,
            border: `1px solid ${C.gold}`,
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>
              Your Matrix Score
            </p>
            <h3 style={{
              fontSize: '64px',
              fontFamily: 'Lora, serif',
              color: C.gold,
              margin: '0 0 15px 0',
              fontWeight: 'normal'
            }}>
              ??/100
            </h3>
            <p style={{ fontSize: '13px', color: '#999' }}>
              Your full score breakdown will be in your email.
            </p>
          </div>

          {/* FOOTER */}
          <div style={{
            borderTop: `1px solid ${C.borderGray}`,
            paddingTop: '30px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#aaa'
          }}>
            <p>
              Questions? Reach out: <strong>info@etfm.systems</strong>
            </p>
            <p style={{ marginTop: '10px' }}>
              © 2024 Escape The Financial Matrix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ETFMAssessment;
