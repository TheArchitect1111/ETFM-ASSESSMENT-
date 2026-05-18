import { useState, useEffect } from "react";

const LOGO_URL = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";
const CALENDLY = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const C = {
  bg: "#f7f4ef", dark: "#1a1a2e", gold: "#c9973a", goldSoft: "#c9973a18",
  text: "#1a1a2e", muted: "#7a7a8a", border: "#e8e3da", white: "#ffffff",
};

const SCORE_MAP = {
  no_idea:10,some_inconsistent:30,track_mentally:50,track_most:70,know_exactly:90,
  disappears_bills:10,spend_quickly:20,try_save:40,use_intentionally:70,save_invest:90,
  avoid:10,emotional_decisions:20,work_more:40,ask_others:50,slow_plan:85,
  debt:30,spending:25,saving:35,income_consistency:40,planning_future:45,investing:50,fairly_organized:80,
  stability:50,peace_of_mind:55,freedom_from_debt:60,time_freedom:65,ownership_wealth:75,security_family:70,dont_know:20,
};

function calcScore(answers){
  const scores=answers.map(a=>SCORE_MAP[a]||40);
  return Math.round(scores.reduce((s,n)=>s+n,0)/scores.length);
}

const FQ=[
  {id:"awareness",bot:"How aware are you of where your money actually goes each month?",subtext:"Awareness is the first step. Be honest — there's no judgment here.",options:[{label:"I honestly have no clear idea",value:"no_idea"},{label:"I know some of it, but not consistently",value:"some_inconsistent"},{label:"I roughly track things mentally",value:"track_mentally"},{label:"I track most of my spending",value:"track_most"},{label:"I know exactly where my money goes",value:"know_exactly"}]},
  {id:"extra_money",bot:"When extra money shows up unexpectedly, what usually happens to it?",subtext:"Where money goes when there's 'extra' reveals the real pattern.",options:[{label:"It disappears into bills and expenses",value:"disappears_bills"},{label:"I spend it quickly",value:"spend_quickly"},{label:"I try to save it, but something usually comes up",value:"try_save"},{label:"I use it intentionally toward goals",value:"use_intentionally"},{label:"I usually save or invest it",value:"save_invest"}]},
  {id:"stress_response",bot:"When financial pressure increases, what usually happens?",subtext:"Your stress response shapes your financial decisions more than income does.",options:[{label:"I avoid thinking about it",value:"avoid"},{label:"I make emotional or impulsive decisions",value:"emotional_decisions"},{label:"I try to work more to compensate",value:"work_more"},{label:"I ask others for advice but still feel uncertain",value:"ask_others"},{label:"I slow down and make a plan",value:"slow_plan"}]},
  {id:"structural_weakness",bot:"Which part of your financial life currently feels least under control?",subtext:"This identifies where the system is breaking first.",options:[{label:"Debt",value:"debt"},{label:"Spending",value:"spending"},{label:"Saving",value:"saving"},{label:"Income consistency",value:"income_consistency"},{label:"Planning for the future",value:"planning_future"},{label:"Investing",value:"investing"},{label:"I feel fairly organized financially",value:"fairly_organized"}]},
  {id:"future_vision",bot:"What are you ultimately trying to create financially?",subtext:"Defining your destination is the first act of financial strategy.",options:[{label:"Stability",value:"stability"},{label:"Peace of mind",value:"peace_of_mind"},{label:"Freedom from debt",value:"freedom_from_debt"},{label:"Time freedom",value:"time_freedom"},{label:"Ownership and wealth",value:"ownership_wealth"},{label:"Security for my family",value:"security_family"},{label:"I honestly don't know yet",value:"dont_know"}]},
];

const BQ=[
  {id:"full_review",section:"Financial Visibility",bot:"When was the last time you reviewed ALL of your financial obligations and resources together?",subtext:"Income, bills, debt, savings, subscriptions, investments — all of it at once.",options:[{label:"Never",value:"never"},{label:"More than 12 months ago",value:"over_12mo"},{label:"Within the last few months",value:"few_months"},{label:"Within the last 30 days",value:"last_30_days"},{label:"I review everything consistently",value:"consistent"}]},
  {id:"income_expense_accuracy",section:"Financial Visibility",bot:"If you had to estimate your total monthly income and total monthly spending right now, how accurate would you be?",subtext:"This reveals the gap between awareness and actual knowledge.",options:[{label:"I honestly would not know",value:"would_not_know"},{label:"I could estimate income, but not spending",value:"income_only"},{label:"I know most of it, but not precisely",value:"most_not_precise"},{label:"I know both fairly accurately",value:"fairly_accurate"},{label:"I track both consistently and precisely",value:"precise"}]},
  {id:"least_control",section:"Financial Visibility",bot:"Which part of your financial life currently feels the least under control?",subtext:"Where your system breaks first is where we start building.",options:[{label:"Debt",value:"debt"},{label:"Spending",value:"spending"},{label:"Saving",value:"saving"},{label:"Income consistency",value:"income_consistency"},{label:"Investing",value:"investing"},{label:"Planning for the future",value:"planning"},{label:"I feel generally organized financially",value:"organized"}]},
  {id:"extra_money_pattern",section:"Pattern Recognition",bot:"The last time you had extra money available, what happened to it?",subtext:"This is one of the most revealing questions about your financial pattern.",options:[{label:"It disappeared into everyday expenses",value:"disappeared"},{label:"I spent it on things I wanted or felt I deserved",value:"spent_deserved"},{label:"An emergency or unexpected situation consumed it",value:"emergency"},{label:"I partially saved or invested it",value:"partially_saved"},{label:"I intentionally allocated it toward a goal",value:"intentional"}]},
  {id:"repeated_behavior",section:"Pattern Recognition",bot:"Which financial behavior has repeated most often in your life?",subtext:"Patterns repeat because they're structural — not because of willpower.",options:[{label:"Starting plans but not maintaining them",value:"not_maintaining"},{label:"Spending emotionally or impulsively",value:"emotional_spending"},{label:"Avoiding financial decisions until pressure builds",value:"avoidance"},{label:"Helping others financially at my own expense",value:"helping_others"},{label:"Constantly restarting financially",value:"restarting"},{label:"Feeling stuck despite working hard",value:"stuck_working"},{label:"I've built fairly consistent habits",value:"consistent_habits"}]},
  {id:"pressure_response",section:"Pattern Recognition",bot:"When financial pressure increases, what is your typical response?",subtext:"Your response pattern under pressure is your most important financial habit.",options:[{label:"Avoid it completely",value:"avoid"},{label:"Make fast emotional decisions",value:"fast_emotional"},{label:"Try to work more to compensate",value:"work_more"},{label:"Talk to others but still feel uncertain",value:"talk_uncertain"},{label:"Step back and create a plan",value:"step_back_plan"},{label:"Stay structured and respond intentionally",value:"structured_response"}]},
  {id:"emotional_stress",section:"Pattern Recognition",bot:"Which financial situation creates the most emotional stress for you?",subtext:"Emotional stress reveals where your system feels most fragile.",options:[{label:"Unexpected expenses",value:"unexpected_expenses"},{label:"Debt balances",value:"debt_balances"},{label:"Not having savings",value:"no_savings"},{label:"Feeling behind compared to others",value:"feeling_behind"},{label:"Uncertainty about the future",value:"future_uncertainty"},{label:"Not knowing what move to make next",value:"dont_know_move"},{label:"Fear of failure financially",value:"fear_failure"}]},
  {id:"income_predictability",section:"System Architecture",bot:"How predictable is your income from month to month?",subtext:"Income volatility changes your emergency fund size, debt strategy, and automation approach.",options:[{label:"Extremely unpredictable",value:"extremely_unpredictable"},{label:"Somewhat inconsistent",value:"somewhat_inconsistent"},{label:"Mostly stable",value:"mostly_stable"},{label:"Very stable",value:"very_stable"},{label:"Multiple stable income sources",value:"multiple_stable"}]},
  {id:"consumer_debt",section:"System Architecture",bot:"Approximately how much consumer debt do you currently carry?",subtext:"Credit cards, personal loans, auto loans — not mortgage.",options:[{label:"Under $5,000",value:"under_5k"},{label:"$5,000 – $25,000",value:"5k_25k"},{label:"$25,000 – $75,000",value:"25k_75k"},{label:"Over $75,000",value:"over_75k"},{label:"I'm currently debt free",value:"debt_free"}]},
  {id:"income_runway",section:"System Architecture",bot:"If your income stopped today, how long could you maintain your current lifestyle?",subtext:"This is your financial runway — one of the most important numbers to know.",options:[{label:"Less than 1 month",value:"under_1mo"},{label:"1 – 3 months",value:"1_3mo"},{label:"3 – 6 months",value:"3_6mo"},{label:"6 – 12 months",value:"6_12mo"},{label:"Over 12 months",value:"over_12mo"}]},
  {id:"money_organization",section:"System Architecture",bot:"How is your money currently organized?",subtext:"Structure determines behavior more than intention does.",options:[{label:"Everything flows through one account",value:"one_account"},{label:"Multiple accounts but no real structure",value:"multiple_no_structure"},{label:"Basic budgeting system",value:"basic_budget"},{label:"Organized accounts for specific purposes",value:"organized_accounts"},{label:"Automated and intentionally structured",value:"automated_structured"}]},
  {id:"automation_level",section:"System Architecture",bot:"How much of your financial life currently operates automatically?",subtext:"Automation is the difference between reacting and building.",options:[{label:"Almost nothing",value:"almost_nothing"},{label:"A few bills only",value:"few_bills"},{label:"Some savings or investing",value:"some_savings"},{label:"Most major systems are automated",value:"most_automated"},{label:"My finances are intentionally systemized",value:"fully_systemized"}]},
  {id:"most_pressure",section:"System Architecture",bot:"Which area currently creates the MOST financial pressure in your life?",subtext:"This is where your system breaks first.",options:[{label:"Monthly bills",value:"monthly_bills"},{label:"Debt payments",value:"debt_payments"},{label:"Inconsistent income",value:"inconsistent_income"},{label:"Lack of savings",value:"lack_savings"},{label:"Taxes",value:"taxes"},{label:"Spending habits",value:"spending_habits"},{label:"Supporting others financially",value:"supporting_others"},{label:"Not knowing what to prioritize",value:"no_priority"}]},
  {id:"actively_building",section:"Ownership & Positioning",bot:"Which of these are you actively building right now?",subtext:"This separates survival from ownership trajectory.",options:[{label:"Emergency savings",value:"emergency_savings"},{label:"Retirement accounts",value:"retirement"},{label:"Investments",value:"investments"},{label:"Business ownership",value:"business"},{label:"Real estate or property",value:"real_estate"},{label:"Passive income",value:"passive_income"},{label:"None consistently yet",value:"none"}]},
  {id:"financial_freedom_meaning",section:"Ownership & Positioning",bot:"What would financial freedom realistically mean for your life?",subtext:"Most people have never defined this. The answer shapes everything.",options:[{label:"Peace of mind",value:"peace_mind"},{label:"Freedom from debt",value:"debt_free"},{label:"More time freedom",value:"time_freedom"},{label:"Security for my family",value:"family_security"},{label:"Ownership and wealth building",value:"ownership_wealth"},{label:"Freedom to leave work I dislike",value:"leave_work"},{label:"The ability to stop surviving financially",value:"stop_surviving"}]},
  {id:"current_financial_life",section:"Ownership & Positioning",bot:"Which statement best describes your current financial life?",subtext:"Honest positioning is the foundation of real strategy.",options:[{label:"I'm surviving month to month",value:"surviving"},{label:"I'm stable but not progressing",value:"stable_not_progressing"},{label:"I'm making progress slowly",value:"slow_progress"},{label:"I'm building intentionally",value:"building_intentionally"},{label:"I feel financially aligned and strategic",value:"aligned_strategic"}]},
  {id:"five_year_feeling",section:"Future Trajectory",bot:"If nothing financially changed over the next 5 years, how would you honestly feel?",subtext:"This is your compass. Be honest with yourself.",options:[{label:"Scared",value:"scared"},{label:"Frustrated",value:"frustrated"},{label:"Disappointed",value:"disappointed"},{label:"Stuck",value:"stuck"},{label:"Mostly okay but limited",value:"okay_limited"},{label:"Optimistic",value:"optimistic"},{label:"Confident",value:"confident"}]},
  {id:"biggest_barrier",section:"Future Trajectory",bot:"What is the biggest thing standing between you and the financial life you want?",subtext:"Your answer here shapes your entire roadmap.",options:[{label:"Lack of structure",value:"no_structure"},{label:"Inconsistent habits",value:"inconsistent_habits"},{label:"Lack of financial knowledge",value:"no_knowledge"},{label:"Debt",value:"debt"},{label:"Income limitations",value:"income_limits"},{label:"Fear or overwhelm",value:"fear_overwhelm"},{label:"No clear long-term strategy",value:"no_strategy"},{label:"Trying to do everything alone",value:"doing_alone"}]},
];

const OPT={display:"block",width:"100%",padding:"16px",marginBottom:"12px",backgroundColor:"#ffffff",color:"#1a1a2e",border:"1px solid #e8e3da",borderRadius:"8px",cursor:"pointer",fontSize:"15px",textAlign:"left",transition:"all 0.2s ease"};

const CreditNote=({dark=false})=>(
  <div style={{marginTop:"20px",padding:"16px",backgroundColor:dark?"rgba(201,151,58,0.12)":C.goldSoft,borderRadius:"6px",border:"1px solid rgba(201,151,58,0.3)"}}>
    <p style={{color:C.gold,fontSize:"14px",margin:"0 0 10px",lineHeight:"1.6",fontWeight:"bold"}}>🧩 Thank you for investing in your ETFM Blueprint.</p>
    <p style={{color:dark?"#c8c8d8":C.body,fontSize:"14px",margin:0,lineHeight:"1.8"}}>
      Your Blueprint is more than a standalone assessment. It becomes the foundation for deeper strategic planning if you decide to continue. When you upgrade to the Strategic Reset Partnership, your original $47 investment will be fully credited and will activate an additional upgrade incentive, reducing your total investment for Package 3 to just $425. This allows you to begin with clarity and move into full implementation without losing the value of your first step.
    </p>
  </div>
);

export default function ETFMAssessment(){
  const p=new URLSearchParams(window.location.search);
  const hasSid=p.get("session");
  const showBlueprint=p.get("showBlueprint")==="true";
  const showSession=p.get("showSession")==="true";
  const sessionPaid=p.get("sessionPaid")==="true";
  const hasBlueprint=p.get("hasBlueprint")==="true";

  const initScreen=()=>{
    if(hasSid&&p.get("cancelled")==="true") return "blueprint_cancelled";
    if(hasSid) return "loading";
    if(sessionPaid) return "session_confirmed";
    if(showBlueprint) return "blueprint_offer";
    if(showSession) return "session_offer";
    return "intro";
  };

  const[screen,setScreen]=useState(initScreen());
  const[freeIdx,setFreeIdx]=useState(0);
  const[freeAns,setFreeAns]=useState([]);
  const[bpIdx,setBpIdx]=useState(0);
  const[bpAns,setBpAns]=useState([]);
  const[firstName,setFirstName]=useState(p.get("firstName")?decodeURIComponent(p.get("firstName")):"");
  const[email,setEmail]=useState(p.get("email")?decodeURIComponent(p.get("email")):"");
  const[loading,setLoading]=useState(false);
  const[score,setScore]=useState(null);
  const[sid,setSid]=useState(null);
  const[blueprintClient,setBlueprintClient]=useState(hasBlueprint);

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[screen,freeIdx,bpIdx]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const s=params.get("session");
    const cancelled=params.get("cancelled");
    if(s&&!params.get("sessionPaid")){
      setSid(s);
      if(cancelled==="true"){setScreen("blueprint_cancelled");}
      else{checkBlueprintSession(s);}
    }
  },[]);

  const checkBlueprintSession=async(s)=>{
    try{
      const res=await fetch(`/api/blueprint-session?session_id=${s}`);
      const data=await res.json();
      if(data.status==="paid"){
        setFirstName(data.first_name||"");
        setEmail(data.email||"");
        setBlueprintClient(true);
        setScreen("blueprint_chat");
      }else{setScreen("blueprint_unpaid");}
    }catch(e){setScreen("blueprint_unpaid");}
  };

  const selectFree=(val)=>{
    const a=[...freeAns,val];
    setFreeAns(a);
    if(freeIdx<FQ.length-1){setFreeIdx(freeIdx+1);}
    else{setScore(calcScore(a));setScreen("transition");}
  };

  const submitFree=async(e)=>{
    e.preventDefault();
    if(!firstName.trim()||!email.trim()) return alert("Please fill in both fields");
    setLoading(true);
    try{
      await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"subscribe",firstName,email,answers:freeAns.map((v,i)=>({question:FQ[i].bot,answer:v}))})});
      setScreen("snapshot_confirmed");
    }catch(e){alert("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const payBlueprint=async()=>{
    if(!email.trim()) return alert("Please enter your email");
    setLoading(true);
    try{
      const res=await fetch("/api/blueprint-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create",email,firstName,freeAnswers:{}})});
      const data=await res.json();
      if(data.checkoutUrl) window.location.href=data.checkoutUrl;
    }catch(e){alert("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const paySession=async()=>{
    if(!email.trim()) return alert("Please enter your email");
    setLoading(true);
    try{
      const res=await fetch("/api/session-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,firstName,hasBlueprint:blueprintClient})});
      const data=await res.json();
      if(data.checkoutUrl) window.location.href=data.checkoutUrl;
    }catch(e){alert("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const selectBp=(val)=>{
    const a=[...bpAns,val];
    setBpAns(a);
    if(bpIdx<BQ.length-1){setBpIdx(bpIdx+1);}
    else{setScreen("blueprint_complete");submitBpReport(a);}
  };

  const submitBpReport=async(answers)=>{
    try{
      await fetch("/api/blueprint-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"complete",sessionId:sid,blueprintAnswers:answers.map((v,i)=>({question:BQ[i].bot,answer:v}))})});
    }catch(e){console.error(e);}
  };

  const Wrap=({children,max="560px"})=>(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 20px"}}>
      <div style={{maxWidth:max,width:"100%",textAlign:"center"}}>{children}</div>
    </div>
  );
  const Tag=({t})=><p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"16px"}}>{t}</p>;
  const Hr=()=><div style={{borderTop:`1px solid ${C.border}`,margin:"32px 0"}}/>;
  const BtnPrimary=({onClick,disabled,children})=>(
    <button onClick={onClick} disabled={disabled} style={{display:"block",width:"100%",padding:"16px",backgroundColor:disabled?C.muted:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:disabled?"not-allowed":"pointer",marginBottom:"12px"}}>
      {children}
    </button>
  );

  // LOADING
  if(screen==="loading") return <Wrap><p style={{color:C.muted,fontFamily:"Georgia, serif"}}>Loading your session...</p></Wrap>;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(screen==="intro") return(
    <Wrap max="600px">
      <div style={{width:"110px",height:"110px",borderRadius:"50%",backgroundColor:C.dark,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 30px",boxShadow:"0 4px 24px rgba(0,0,0,0.18)"}}>
        <img src={LOGO_URL} alt="ETFM" style={{width:"86px",height:"86px",objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
      </div>
      <Tag t="Escape The Financial Matrix"/>
      <h1 style={{fontSize:"42px",fontFamily:"Georgia, serif",marginBottom:"20px",color:C.text,lineHeight:"1.2"}}>Your financial life has a pattern. It's time to see it clearly.</h1>
      <p style={{fontSize:"17px",color:C.muted,marginBottom:"40px",lineHeight:"1.7"}}>The ETFM Snapshot is a 5-question diagnostic that identifies your financial archetype, calculates your Awareness Score, and delivers a personalized strategic insight — free.</p>

      {/* ── WHO IS ROBERT BRICKEY ── */}
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"32px",marginBottom:"36px",textAlign:"left"}}>
        <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"20px",textAlign:"center"}}>Who Built This</p>
        <p style={{fontSize:"16px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"20px",fontStyle:"italic"}}>
          "I've spent 12 years watching people do everything right and still feel lost when it comes to money. They work hard. They try to save. They Google their questions at midnight. But nobody ever sat down with them, looked at their actual situation, and helped them build something real. That's why I created this."
        </p>
        <p style={{fontSize:"14px",color:C.muted,marginBottom:"20px",lineHeight:"1.7",fontWeight:"bold",textAlign:"right"}}>— Robert Brickey, Creator of ETFM</p>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          {[
            {icon:"🎓", text:"Duke University Graduate"},
            {icon:"🏀", text:"Former Basketball Team Captain"},
            {icon:"📊", text:"12 Years in Financial Advisory"},
            {icon:"🎙️", text:"Radio Host — WIDU 1600 AM"},
            {icon:"🏟️", text:"Seminar Speaker, The Carolinas"},
            {icon:"💡", text:"Creator of ETFM"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",backgroundColor:C.bg,borderRadius:"8px"}}>
              <span style={{fontSize:"18px"}}>{item.icon}</span>
              <span style={{fontSize:"13px",color:C.text,lineHeight:"1.4"}}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>setScreen("chat")} style={{backgroundColor:C.gold,color:C.dark,border:"none",padding:"16px 44px",fontSize:"16px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer"}}>Begin Your Snapshot →</button>
      <p style={{fontSize:"12px",color:C.muted,marginTop:"16px"}}>5 questions · 2 minutes · No obligation</p>
    </Wrap>
  );

  // FREE CHAT
  if(screen==="chat"){
    const q=FQ[freeIdx];
    const prog=((freeIdx+1)/FQ.length)*100;
    return(
      <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <div style={{marginBottom:"8px",display:"flex",justifyContent:"space-between"}}>
            <p style={{fontSize:"11px",color:C.muted,textTransform:"uppercase",letterSpacing:"1px",margin:0}}>ETFM Snapshot</p>
            <p style={{fontSize:"11px",color:C.muted,margin:0}}>{freeIdx+1} of {FQ.length}</p>
          </div>
          <div style={{marginBottom:"36px",backgroundColor:C.border,height:"3px",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{backgroundColor:C.gold,height:"100%",width:`${prog}%`,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{marginBottom:"32px",padding:"24px",backgroundColor:C.white,borderRadius:"10px",border:`1px solid ${C.border}`}}>
            <p style={{color:C.muted,fontSize:"13px",margin:"0 0 10px"}}>{q.subtext}</p>
            <h2 style={{fontSize:"22px",fontFamily:"Georgia, serif",color:C.text,margin:0,lineHeight:"1.4"}}>{q.bot}</h2>
          </div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>selectFree(opt.value)} style={OPT}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor=C.goldSoft;e.currentTarget.style.borderColor=C.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor=C.white;e.currentTarget.style.borderColor=C.border;}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // TRANSITION
  if(screen==="transition") return(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <div style={{maxWidth:"580px",width:"100%",textAlign:"center"}}>
        <Tag t="Snapshot Complete"/>
        <h2 style={{fontSize:"32px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Your evaluation has been processed.</h2>
        <p style={{fontSize:"16px",color:C.muted,marginBottom:"40px",lineHeight:"1.7"}}>What you've uncovered today is not a reflection of your potential — it's a reflection of the systems currently shaping your financial life.</p>
        <div style={{backgroundColor:C.dark,borderRadius:"12px",padding:"36px 30px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"24px",textAlign:"center"}}>Your ETFM Strategic Score</p>
          <div style={{marginBottom:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",backgroundColor:"rgba(201,151,58,0.1)",borderRadius:"6px",border:"1px solid rgba(201,151,58,0.3)"}}>
            <span style={{color:C.white,fontSize:"14px"}}>Awareness</span>
            <span style={{color:C.gold,fontSize:"22px",fontFamily:"Georgia, serif",fontWeight:"bold"}}>{score}/100</span>
          </div>
          {["Structure","Momentum","Ownership Positioning","System Strength"].map(cat=>(
            <div key={cat} style={{marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",backgroundColor:"rgba(255,255,255,0.04)",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.08)"}}>
              <span style={{color:"#6a6a7a",fontSize:"14px"}}>{cat}</span>
              <span style={{color:"#4a4a5a",fontSize:"13px",fontStyle:"italic"}}>Locked</span>
            </div>
          ))}
          <p style={{color:"#6a6a7a",fontSize:"12px",textAlign:"center",marginTop:"20px",marginBottom:0}}>Your full Strategic Score and Snapshot will be delivered to your inbox.</p>
        </div>

        {/* ── ROBERT NOTE ON RESULTS ── */}
        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"28px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",color:C.gold,marginBottom:"16px"}}>A Note From Robert</p>
          <p style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"16px",fontStyle:"italic"}}>
            "I've worked with hundreds of people who had scores just like yours. Where you are right now is not the full story — what matters is what you do next. That's exactly what the Strategic Reset Session is designed for."
          </p>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"16px",display:"flex",flexWrap:"wrap",gap:"8px"}}>
            {["🎓 Duke Graduate","🏀 Former Team Captain","📊 12 Yrs Advisory","🎙️ WIDU 1600 AM"].map((c,i)=>(
              <span key={i} style={{fontSize:"12px",color:C.muted,backgroundColor:C.bg,padding:"6px 12px",borderRadius:"20px",border:`1px solid ${C.border}`}}>{c}</span>
            ))}
          </div>
          <div style={{marginTop:"20px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>
              "I left that call knowing exactly what to do for the first time."
            </p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>— Strategic Reset Client</p>
          </div>
          <div style={{marginTop:"12px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>
              "Most advisors talk at you. Robert actually looked at my situation."
            </p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>— ETFM Client</p>
          </div>
        </div>

        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"36px 30px"}}>
          <h3 style={{fontSize:"18px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"8px"}}>Send my Snapshot and Strategic Score</h3>
          <p style={{fontSize:"14px",color:C.muted,marginBottom:"24px"}}>Enter your details to receive your personalized results.</p>
          <form onSubmit={submitFree}>
            <div style={{marginBottom:"16px",textAlign:"left"}}>
              <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>First Name</label>
              <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Your first name" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:"20px",textAlign:"left"}}>
              <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
            </div>
            <button type="submit" disabled={loading} style={{width:"100%",padding:"14px",backgroundColor:loading?C.muted:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontSize:"16px",fontWeight:"bold",cursor:loading?"not-allowed":"pointer"}}>
              {loading?"Processing...":"Send My Snapshot →"}
            </button>
          </form>
          <p style={{fontSize:"11px",color:C.muted,marginTop:"16px",textAlign:"center"}}>Your information is never sold or shared.</p>
        </div>
      </div>
    </div>
  );

  // SNAPSHOT CONFIRMED
  if(screen==="snapshot_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>🎉</div>
      <Tag t="Congratulations"/>
      <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        {firstName?`${firstName}, your Snapshot is on its way!`:"Your Snapshot is on its way!"}
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"16px"}}>
        You just completed something most people never do — you took an honest look at your financial patterns. That awareness is where real change begins.
      </p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"40px"}}>
        Your Financial Archetype, Awareness Score, and personalized strategic insight are heading to your inbox right now. Check your spam folder if you don't see it within 5 minutes.
      </p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"24px",textAlign:"left"}}>
        <p style={{color:C.gold,fontSize:"13px",marginBottom:"12px",fontWeight:"bold"}}>What to do next:</p>
        {["Open your Snapshot email","Read your Financial Archetype and Awareness Score","Review your personalized strategic insight","Follow the next steps inside the email"].map((item,i)=>(
          <div key={i} style={{padding:"8px 0",color:"#c8c8d8",fontSize:"14px",borderBottom:i<3?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}. &nbsp;{item}</div>
        ))}
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // BLUEPRINT OFFER
  if(screen==="blueprint_offer") return(
    <Wrap>
      <Tag t="Strategic Blueprint"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Go deeper with the 18-question diagnostic.</h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>Your Snapshot showed you where you are. The Blueprint identifies exactly <em>why</em> — and delivers a personalized escape roadmap and 30-Day Strategic Reset Protocol built around your specific patterns.</p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What's included — $47</p>
        {["18-question deep strategic diagnostic","Personalized financial escape roadmap","5-Step ETFM Framework PDF","Robert's personal video message","30-Day Strategic Reset Protocol"].map(item=>(
          <div key={item} style={{padding:"8px 0",color:"#c8c8d8",fontSize:"15px",lineHeight:"1.6",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>✓ &nbsp;{item}</div>
        ))}
        <CreditNote dark={true}/>
      </div>
      <p style={{fontSize:"14px",color:C.muted,marginBottom:"20px",lineHeight:"1.7"}}>After payment you'll answer 18 diagnostic questions. Robert's team then generates your personalized Blueprint report and delivers it to your inbox within minutes.</p>
      {!email&&(
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Confirm your email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
        </div>
      )}
      <BtnPrimary onClick={payBlueprint} disabled={loading}>{loading?"Setting up your Blueprint...":"Get the Strategic Blueprint — $47"}</BtnPrimary>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // BLUEPRINT CHAT
  if(screen==="blueprint_chat"){
    const q=BQ[bpIdx];
    const prog=((bpIdx+1)/BQ.length)*100;
    return(
      <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <div style={{marginBottom:"8px",display:"flex",justifyContent:"space-between"}}>
            <p style={{fontSize:"11px",color:C.gold,textTransform:"uppercase",letterSpacing:"1px",margin:0}}>Strategic Blueprint — {q.section}</p>
            <p style={{fontSize:"11px",color:C.muted,margin:0}}>{bpIdx+1} of {BQ.length}</p>
          </div>
          <div style={{marginBottom:"36px",backgroundColor:C.border,height:"3px",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{backgroundColor:C.gold,height:"100%",width:`${prog}%`,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{marginBottom:"32px",padding:"24px",backgroundColor:C.white,borderRadius:"10px",border:`1px solid ${C.border}`}}>
            <p style={{color:C.muted,fontSize:"13px",margin:"0 0 10px"}}>{q.subtext}</p>
            <h2 style={{fontSize:"22px",fontFamily:"Georgia, serif",color:C.text,margin:0,lineHeight:"1.4"}}>{q.bot}</h2>
          </div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>selectBp(opt.value)} style={OPT}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor=C.goldSoft;e.currentTarget.style.borderColor=C.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor=C.white;e.currentTarget.style.borderColor=C.border;}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // BLUEPRINT COMPLETE
  if(screen==="blueprint_complete") return(
    <Wrap max="620px">
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <img src={LOGO_URL} alt="ETFM" style={{width:"64px",display:"block",margin:"0 auto 16px"}}/>
        <Tag t="Blueprint Complete"/>
      </div>
      <div style={{backgroundColor:C.white,borderRadius:"12px",border:`1px solid ${C.border}`,overflow:"hidden",textAlign:"left"}}>
        <div style={{backgroundColor:C.dark,padding:"32px 40px",textAlign:"center"}}>
          <h1 style={{margin:0,color:C.white,fontSize:"26px",fontFamily:"Georgia, serif",fontWeight:"normal",lineHeight:"1.4"}}>Your Strategic Blueprint<br/>has been prepared.</h1>
        </div>
        <div style={{padding:"40px"}}>
          <p style={{color:C.text,fontSize:"16px",lineHeight:"1.8",marginBottom:"16px"}}>You took an important step today.</p>
          <p style={{color:C.muted,fontSize:"15px",lineHeight:"1.9",marginBottom:"32px"}}>Most people avoid looking closely at their financial patterns. You didn't. Your personalized report, escape roadmap, and 30-Day Reset Protocol will be in your inbox shortly — typically within 3–5 minutes. Check your spam folder if you don't see it.</p>
          <div style={{backgroundColor:C.bg,borderRadius:"8px",padding:"20px 24px",marginBottom:"32px",borderLeft:`3px solid ${C.gold}`}}>
            <p style={{margin:"0 0 10px",color:C.gold,fontSize:"14px",fontWeight:"bold",lineHeight:"1.6"}}>🧩 Thank you for investing in your ETFM Blueprint.</p>
            <p style={{margin:0,color:C.muted,fontSize:"14px",lineHeight:"1.8"}}>Your Blueprint is more than a standalone assessment. It becomes the foundation for deeper strategic planning if you decide to continue. When you upgrade to the Strategic Reset Partnership, your original $47 investment will be fully credited and will activate an additional upgrade incentive, reducing your total investment for Package 3 to just $425. This allows you to begin with clarity and move into full implementation without losing the value of your first step.</p>
          </div>
          <div style={{textAlign:"center",padding:"24px 0",borderTop:`1px solid ${C.border}`}}>
            <p style={{margin:0,color:C.text,fontSize:"16px",lineHeight:"2.2",fontFamily:"Georgia, serif",fontStyle:"italic"}}>Clarity creates control.<br/>Control creates momentum.<br/>Momentum creates freedom.</p>
          </div>
        </div>
        <div style={{backgroundColor:C.bg,padding:"20px 40px",textAlign:"center",borderTop:`1px solid ${C.border}`}}>
          <p style={{margin:0,color:C.muted,fontSize:"13px"}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>
        </div>
      </div>
    </Wrap>
  );

  // ── SESSION OFFER ───────────────────────────────────────────────────────────
  if(screen==="session_offer") return(
    <Wrap>
      <Tag t="Strategic Reset Session"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Work directly with Robert Brickey.</h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"24px"}}>Two private 30-minute strategy calls — one before, one after — built entirely around your numbers, your patterns, and your life. Robert reviews your situation before you ever speak. You leave with a real plan.</p>

      {/* Who is Robert — trust bridge */}
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"28px",marginBottom:"24px",textAlign:"left"}}>
        <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",color:C.gold,marginBottom:"16px"}}>Who Is Robert Brickey?</p>
        <p style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"20px",fontStyle:"italic"}}>
          "I've spent 12 years watching people do everything right and still feel lost when it comes to money. Nobody ever sat down with them, looked at their actual situation, and helped them build something real. That's what this session is."
        </p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"20px"}}>
          {["🎓 Duke Graduate","🏀 Former Team Captain","📊 12 Yrs Advisory","🎙️ WIDU 1600 AM","🏟️ Seminar Speaker"].map((c,i)=>(
            <span key={i} style={{fontSize:"12px",color:C.muted,backgroundColor:C.bg,padding:"6px 12px",borderRadius:"20px",border:`1px solid ${C.border}`}}>{c}</span>
          ))}
        </div>
        <div style={{padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`,marginBottom:"10px"}}>
          <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"I left that call knowing exactly what to do for the first time."</p>
          <p style={{margin:0,fontSize:"12px",color:C.gold}}>— Strategic Reset Client</p>
        </div>
        <div style={{padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
          <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"Most advisors talk at you. Robert actually looked at my situation."</p>
          <p style={{margin:0,fontSize:"12px",color:C.gold}}>— ETFM Client</p>
        </div>
      </div>

      {/* What you get */}
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>{blueprintClient?"What's included — $425 (Blueprint client rate)":"What's included — $499"}</p>
        {[
          {title:"Robert studies your situation before you ever speak",body:"You fill out a short intake form. He reviews it. You don't waste time explaining yourself — he already knows where you are."},
          {title:"Pre-session strategy call — just you and Robert",body:"No group calls. No assistants. The first 30 minutes are focused entirely on your money, your patterns, and what needs to change."},
          {title:"A plan built for your life — not a template",body:"Not 'spend less, save more.' A real plan with real steps written specifically for your situation."},
          {title:"Your financial score — and what it actually means",body:"See exactly where you stand. Most people have never seen this clearly before. It changes how you make decisions."},
          {title:"Your personal money rules",body:"Know exactly what to do — and what not to do — when financial decisions come up. No more second-guessing at midnight."},
          {title:"A 90-day roadmap so you know what to do first",body:"You walk away knowing what to do in the next 30, 60, and 90 days — in order."},
          {title:"Post-session strategy call to lock in your direction",body:"The second 30-minute call happens after you've had time to review your plan. Robert checks in, answers questions, and makes sure you're moving with confidence."},
          {title:"Both sessions recorded and sent to you",body:"Go back and watch anytime. The clarity doesn't expire."},
          {title:"30 days of direct email access to Robert's team",body:"Questions come up after the calls. We're there when they do."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 4px",color:C.text,fontSize:"14px",fontWeight:"bold"}}>✓ &nbsp;{item.title}</p>
            <p style={{margin:"0 0 0 20px",color:C.muted,fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
        <CreditNote dark={false}/>
      </div>

      {/* How it works */}
      <div style={{backgroundColor:C.bg,borderRadius:"8px",padding:"20px 24px",marginBottom:"24px",textAlign:"left",border:`1px solid ${C.border}`}}>
        <p style={{color:C.dark,fontSize:"14px",fontWeight:"bold",marginBottom:"12px"}}>How it works:</p>
        {[
          "Book your pre-session call using the button below",
          "Complete your secure payment",
          "Robert's team sends your intake form within 24 hours",
          "Complete the intake so Robert arrives fully prepared",
          "Attend your first 30-minute pre-session strategy call",
          "Review your personalized plan and roadmap",
          "Attend your second 30-minute post-session call to lock in your direction",
        ].map((step,i)=>(
          <div key={i} style={{padding:"6px 0",color:C.muted,fontSize:"14px"}}>{i+1}. &nbsp;{step}</div>
        ))}
      </div>

      {!email&&(
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Your email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
        </div>
      )}
      <a href={`${CALENDLY}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(firstName)}`} target="_blank" rel="noopener noreferrer"
        style={{display:"block",width:"100%",padding:"16px",backgroundColor:C.gold,color:C.dark,borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer",textDecoration:"none",marginBottom:"12px",boxSizing:"border-box",textAlign:"center"}}>
        Book Your Pre-Session Call →
      </a>
      <p style={{fontSize:"13px",color:C.muted,textAlign:"center",marginBottom:"24px"}}>One session. One plan. No more fog.</p>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // ── SESSION CONFIRMED ───────────────────────────────────────────────────────
  if(screen==="session_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
      <Tag t="Session Confirmed"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        {firstName?`${firstName}, you're all set.`:"You're all set."}
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>Your Strategic Reset Session with Robert Brickey is confirmed and your payment has been received. Check your Calendly confirmation email for your pre-session call date and time.</p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What happens next</p>
        {[
          "Check your email for your Calendly pre-session call confirmation",
          "Robert's team will send your intake form within 24 hours",
          "Complete the intake thoroughly before your first call",
          "Attend your first 30-minute pre-session strategy call with Robert",
          "Review your personalized plan, roadmap, and financial score",
          "Attend your second 30-minute post-session call to lock in your direction",
          "Receive your session recordings within 24 hours of each call",
        ].map((step,i)=>(
          <div key={i} style={{padding:"8px 0",color:"#c8c8d8",fontSize:"14px",lineHeight:"1.6",borderBottom:i<6?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}. &nbsp;{step}</div>
        ))}
      </div>
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",textAlign:"left"}}>
        <p style={{color:C.text,fontSize:"14px",fontWeight:"bold",marginBottom:"8px"}}>Your session includes:</p>
        <p style={{color:C.muted,fontSize:"14px",lineHeight:"1.7",margin:0}}>Two 30-minute strategy calls (pre & post) · Personalized financial plan · Full financial score analysis · Decision rules system · 90-day reset roadmap · Session recordings · 30 days of priority email support</p>
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>
    </Wrap>
  );

  // BLUEPRINT UNPAID
  if(screen==="blueprint_unpaid") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>Payment Required</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>This session hasn't been activated yet. Complete your payment to unlock the Strategic Blueprint.</p>
      <a href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d" style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",borderRadius:"6px",fontWeight:"bold",fontSize:"16px"}}>Get the Strategic Blueprint — $47</a>
    </Wrap>
  );

  // BLUEPRINT CANCELLED
  if(screen==="blueprint_cancelled") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>No problem.</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Your Snapshot is still in your inbox. When you're ready to go deeper, the Blueprint will be here.</p>
      <a href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d" style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",borderRadius:"6px",fontWeight:"bold",fontSize:"16px"}}>Unlock the Strategic Blueprint — $47</a>
    </Wrap>
  );

  return null;
}
