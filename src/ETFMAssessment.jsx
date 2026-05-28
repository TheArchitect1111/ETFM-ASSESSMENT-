import { useState, useEffect } from "react";

const LOGO_URL = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";
const CALENDLY = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const C = {
  bg: "#f7f4ef", dark: "#1a1a2e", gold: "#c9973a", goldSoft: "#c9973a18",
  text: "#1a1a2e", muted: "#7a7a8a", border: "#e8e3da", white: "#ffffff",
};

const STAGES = ["VISIBILITY","PRESSURE","CONTROL","DIRECTION","AWARENESS"];
const Q_TRANSITIONS = [
  "Awareness changes behavior.",
  "Pressure reveals structure.",
  "Patterns repeat until they are seen.",
  "Naming your destination is the first real act of financial strategy.",
];

const SCORE_MAP = {
  no_idea:2,some_inconsistent:7,track_mentally:11,track_most:16,know_exactly:20,
  disappears_bills:2,spend_quickly:4,try_save:9,use_intentionally:16,save_invest:20,
  avoid:2,emotional_decisions:5,work_more:9,ask_others:12,slow_plan:20,
  debt:6,spending:6,saving:9,income_consistency:10,planning_future:11,investing:13,fairly_organized:20,
  stability:13,peace_of_mind:15,freedom_from_debt:16,time_freedom:17,ownership_wealth:20,security_family:19,dont_know:5,
};

function calcScore(answers){
  const scores=answers.map(a=>SCORE_MAP[a]||0);
  return Math.min(100,scores.reduce((s,n)=>s+n,0));
}

const FQ=[
  {id:"awareness",
   bot:"How clearly do you see where your money actually goes each month?",
   subtext:"Financial visibility is the first indicator of system health. What you can see, you can change.",
   highlight:"What stays hidden keeps repeating.",
   options:[
     {label:"Honestly? I have no real idea",value:"no_idea"},
     {label:"I know some of it, but not consistently",value:"some_inconsistent"},
     {label:"I have a rough sense, mostly in my head",value:"track_mentally"},
     {label:"I track most of my spending",value:"track_most"},
     {label:"I know exactly where every dollar goes",value:"know_exactly"},
   ]},
  {id:"extra_money",
   bot:"When unexpected money comes in, what usually happens to it?",
   subtext:"How you treat extra money reveals your real financial pattern, not your intentions.",
   highlight:"Your response under pressure shapes your financial life more than your income ever will.",
   options:[
     {label:"It gets absorbed into bills and everyday expenses",value:"disappears_bills"},
     {label:"I spend it, sometimes without thinking",value:"spend_quickly"},
     {label:"I try to save it, but something usually comes up",value:"try_save"},
     {label:"I put it toward something intentional",value:"use_intentionally"},
     {label:"I save or invest it without hesitation",value:"save_invest"},
   ]},
  {id:"stress_response",
   bot:"When financial pressure builds, how do you usually respond?",
   highlight:"Pressure reveals structure.",
   options:[
     {label:"I avoid thinking about it as long as I can",value:"avoid"},
     {label:"I react, emotionally or impulsively",value:"emotional_decisions"},
     {label:"I try to work more to compensate",value:"work_more"},
     {label:"I ask others, but still feel uncertain about what to do",value:"ask_others"},
     {label:"I slow down and make a plan",value:"slow_plan"},
   ]},
  {id:"structural_weakness",
   bot:"Which part of your financial life currently feels the most out of control?",
   subtext:"Where your system is breaking is where we begin building.",
   highlight:"Naming your destination changes your behavior.",
   options:[
     {label:"Debt",value:"debt"},
     {label:"Spending",value:"spending"},
     {label:"Saving",value:"saving"},
     {label:"Income consistency",value:"income_consistency"},
     {label:"Planning for the future",value:"planning_future"},
     {label:"Investing",value:"investing"},
     {label:"Honestly, I feel fairly organized",value:"fairly_organized"},
   ]},
  {id:"future_vision",
   bot:"What are you ultimately trying to build, financially?",
   highlight:"Awareness is always where real movement begins.",
   options:[
     {label:"Stability I can count on",value:"stability"},
     {label:"Peace of mind",value:"peace_of_mind"},
     {label:"Freedom from debt",value:"freedom_from_debt"},
     {label:"More time and space in my life",value:"time_freedom"},
     {label:"Real ownership and lasting wealth",value:"ownership_wealth"},
     {label:"Security for the people I love",value:"security_family"},
     {label:"I haven't clearly defined it yet",value:"dont_know"},
   ]},
];

const BQ=[
  {id:"full_review",
   section:"Financial Visibility",
   bot:"When did you last look at all of your financial obligations and resources together, at the same time?",
   subtext:"Income, bills, debt, savings, subscriptions, investments. Everything in one honest picture.",
   options:[
     {label:"Never, that I can recall",value:"never"},
     {label:"More than a year ago",value:"over_12mo"},
     {label:"Within the last few months",value:"few_months"},
     {label:"Within the last 30 days",value:"last_30_days"},
     {label:"I review everything regularly",value:"consistent"},
   ]},
  {id:"income_expense_accuracy",
   section:"Financial Visibility",
   bot:"Right now, how accurately could you state your total monthly income and total monthly spending?",
   subtext:"This reveals the gap between what you think you know and what you actually know.",
   options:[
     {label:"Honestly, I wouldn't know where to start",value:"would_not_know"},
     {label:"I know my income, but not what I'm spending",value:"income_only"},
     {label:"I have a general sense, but nothing precise",value:"most_not_precise"},
     {label:"I know both fairly accurately",value:"fairly_accurate"},
     {label:"I track both consistently and precisely",value:"precise"},
   ]},
  {id:"least_control",
   section:"Financial Visibility",
   bot:"Which area of your financial life currently feels the least in your control?",
   subtext:"Where things feel out of control is where the system needs to be rebuilt first.",
   options:[
     {label:"Debt",value:"debt"},
     {label:"Spending",value:"spending"},
     {label:"Saving",value:"saving"},
     {label:"Income consistency",value:"income_consistency"},
     {label:"Investing",value:"investing"},
     {label:"Planning for the future",value:"planning"},
     {label:"Honestly, I feel generally organized",value:"organized"},
   ]},
  {id:"extra_money_pattern",
   section:"Pattern Recognition",
   bot:"The last time you had extra money available, what actually happened to it?",
   subtext:"This single question reveals more about your financial pattern than almost any other.",
   options:[
     {label:"It disappeared into everyday expenses",value:"disappeared"},
     {label:"I spent it on things I wanted or felt I'd earned",value:"spent_deserved"},
     {label:"An unexpected situation consumed it",value:"emergency"},
     {label:"I saved or invested part of it",value:"partially_saved"},
     {label:"I directed it intentionally toward a goal",value:"intentional"},
   ]},
  {id:"repeated_behavior",
   section:"Pattern Recognition",
   bot:"Which financial behavior has shown up most repeatedly throughout your life?",
   subtext:"Patterns repeat because they are structural, not a willpower problem.",
   options:[
     {label:"Starting strong, then losing momentum",value:"not_maintaining"},
     {label:"Spending emotionally or in the moment",value:"emotional_spending"},
     {label:"Avoiding financial decisions until pressure forces action",value:"avoidance"},
     {label:"Putting others first financially, at my own expense",value:"helping_others"},
     {label:"Restarting financially, again and again",value:"restarting"},
     {label:"Feeling stuck despite working hard",value:"stuck_working"},
     {label:"I've built fairly consistent financial habits",value:"consistent_habits"},
   ]},
  {id:"pressure_response",
   section:"Pattern Recognition",
   bot:"When financial pressure increases, what is your typical response?",
   subtext:"How you respond under pressure is your most important financial habit, even if you've never named it.",
   options:[
     {label:"I avoid it completely",value:"avoid"},
     {label:"I make fast, emotionally driven decisions",value:"fast_emotional"},
     {label:"I try to work more to compensate",value:"work_more"},
     {label:"I talk to others, but still feel uncertain",value:"talk_uncertain"},
     {label:"I step back and create a plan",value:"step_back_plan"},
     {label:"I stay structured and respond intentionally",value:"structured_response"},
   ]},
  {id:"emotional_stress",
   section:"Pattern Recognition",
   bot:"Which financial situation creates the most emotional weight for you?",
   subtext:"Where you feel the most stress is where your system feels the most fragile.",
   options:[
     {label:"Unexpected expenses I wasn't prepared for",value:"unexpected_expenses"},
     {label:"The weight of carrying debt",value:"debt_balances"},
     {label:"Not having savings to fall back on",value:"no_savings"},
     {label:"Feeling behind compared to where I thought I'd be",value:"feeling_behind"},
     {label:"Uncertainty about what the future holds",value:"future_uncertainty"},
     {label:"Not knowing what move to make next",value:"dont_know_move"},
     {label:"A deep fear of failing financially",value:"fear_failure"},
   ]},
  {id:"income_predictability",
   section:"System Architecture",
   bot:"How predictable is your income from one month to the next?",
   subtext:"Income stability shapes everything, your emergency fund, your debt strategy, your ability to automate.",
   options:[
     {label:"Extremely unpredictable",value:"extremely_unpredictable"},
     {label:"It varies, some months are fine, others aren't",value:"somewhat_inconsistent"},
     {label:"Mostly stable with occasional variation",value:"mostly_stable"},
     {label:"Very stable and reliable",value:"very_stable"},
     {label:"I have multiple stable income sources",value:"multiple_stable"},
   ]},
  {id:"consumer_debt",
   section:"System Architecture",
   bot:"How much consumer debt do you currently carry?",
   subtext:"Credit cards, personal loans, auto loans, not your mortgage.",
   options:[
     {label:"Under $5,000",value:"under_5k"},
     {label:"$5,000 to $25,000",value:"5k_25k"},
     {label:"$25,000 to $75,000",value:"25k_75k"},
     {label:"Over $75,000",value:"over_75k"},
     {label:"I'm currently debt free",value:"debt_free"},
   ]},
  {id:"income_runway",
   section:"System Architecture",
   bot:"If your income stopped today, how long could you maintain your current lifestyle?",
   subtext:"This is your financial runway, one of the most important numbers you can know about yourself.",
   options:[
     {label:"Less than 1 month",value:"under_1mo"},
     {label:"1 to 3 months",value:"1_3mo"},
     {label:"3 to 6 months",value:"3_6mo"},
     {label:"6 to 12 months",value:"6_12mo"},
     {label:"Over 12 months",value:"over_12mo"},
   ]},
  {id:"money_organization",
   section:"System Architecture",
   bot:"How is your money currently organized, structurally?",
   subtext:"Structure determines behavior more than intention does. This is where we look first.",
   options:[
     {label:"Everything runs through one account",value:"one_account"},
     {label:"Multiple accounts, but no real structure behind them",value:"multiple_no_structure"},
     {label:"A basic budgeting system",value:"basic_budget"},
     {label:"Accounts organized around specific purposes",value:"organized_accounts"},
     {label:"Automated and intentionally structured",value:"automated_structured"},
   ]},
  {id:"automation_level",
   section:"System Architecture",
   bot:"How much of your financial life currently runs automatically?",
   subtext:"Automation is what separates reacting to your finances from intentionally building with them.",
   options:[
     {label:"Almost nothing is automated",value:"almost_nothing"},
     {label:"A few bills, that's it",value:"few_bills"},
     {label:"Some savings or investing is automated",value:"some_savings"},
     {label:"Most major systems run automatically",value:"most_automated"},
     {label:"My finances are fully and intentionally systemized",value:"fully_systemized"},
   ]},
  {id:"most_pressure",
   section:"System Architecture",
   bot:"Which area creates the most consistent financial pressure in your life right now?",
   subtext:"This is where your system is under the most strain.",
   options:[
     {label:"Monthly bills",value:"monthly_bills"},
     {label:"Debt payments",value:"debt_payments"},
     {label:"Inconsistent income",value:"inconsistent_income"},
     {label:"Lack of savings",value:"lack_savings"},
     {label:"Taxes",value:"taxes"},
     {label:"Spending habits",value:"spending_habits"},
     {label:"Supporting others financially",value:"supporting_others"},
     {label:"Not knowing what to prioritize",value:"no_priority"},
   ]},
  {id:"actively_building",
   section:"Ownership & Positioning",
   bot:"Which of these are you actively and intentionally building right now?",
   subtext:"This separates surviving from building toward something real.",
   options:[
     {label:"Emergency savings",value:"emergency_savings"},
     {label:"Retirement accounts",value:"retirement"},
     {label:"Investment accounts",value:"investments"},
     {label:"A business",value:"business"},
     {label:"Real estate or property",value:"real_estate"},
     {label:"Passive income streams",value:"passive_income"},
     {label:"Nothing consistently, not yet",value:"none"},
   ]},
  {id:"financial_freedom_meaning",
   section:"Ownership & Positioning",
   bot:"What would financial freedom actually mean for your life?",
   subtext:"Most people have never taken the time to define this clearly. Your answer shapes everything that follows.",
   options:[
     {label:"Real peace of mind",value:"peace_mind"},
     {label:"Being completely free of debt",value:"debt_free"},
     {label:"More time and space for what matters",value:"time_freedom"},
     {label:"Knowing my family is protected",value:"family_security"},
     {label:"Ownership and building lasting wealth",value:"ownership_wealth"},
     {label:"The freedom to walk away from work I don't love",value:"leave_work"},
     {label:"Simply no longer surviving month to month",value:"stop_surviving"},
   ]},
  {id:"current_financial_life",
   section:"Ownership & Positioning",
   bot:"Which statement most honestly describes where you are financially right now?",
   subtext:"Honest positioning is the only foundation real strategy can be built on.",
   options:[
     {label:"I'm surviving month to month",value:"surviving"},
     {label:"I'm stable, but I'm not moving forward",value:"stable_not_progressing"},
     {label:"I'm making progress, but slowly",value:"slow_progress"},
     {label:"I'm building with intention",value:"building_intentionally"},
     {label:"I feel aligned, strategic, and on track",value:"aligned_strategic"},
   ]},
  {id:"five_year_feeling",
   section:"Future Trajectory",
   bot:"If nothing financially changed over the next five years, how would you honestly feel?",
   subtext:"This is your compass. Let yourself be honest.",
   options:[
     {label:"Scared",value:"scared"},
     {label:"Frustrated",value:"frustrated"},
     {label:"Disappointed",value:"disappointed"},
     {label:"Stuck",value:"stuck"},
     {label:"Mostly okay, but limited",value:"okay_limited"},
     {label:"Optimistic",value:"optimistic"},
     {label:"Confident",value:"confident"},
   ]},
  {id:"biggest_barrier",
   section:"Future Trajectory",
   bot:"What is the single biggest thing standing between you and the financial life you want?",
   subtext:"Your answer here becomes the foundation of your entire roadmap.",
   options:[
     {label:"I don't have a real financial structure",value:"no_structure"},
     {label:"My habits are inconsistent",value:"inconsistent_habits"},
     {label:"I don't have enough financial knowledge",value:"no_knowledge"},
     {label:"Debt is holding me back",value:"debt"},
     {label:"My income feels limited",value:"income_limits"},
     {label:"Fear, or feeling completely overwhelmed",value:"fear_overwhelm"},
     {label:"I don't have a clear long-term strategy",value:"no_strategy"},
     {label:"I've been trying to figure it all out alone",value:"doing_alone"},
   ]},
];

const OPT={display:"block",width:"100%",padding:"13px 18px",marginBottom:"9px",backgroundColor:"rgba(255,255,255,0.8)",color:"#1a1a2e",border:"1px solid rgba(232,227,218,0.7)",borderRadius:"10px",cursor:"pointer",fontSize:"15px",textAlign:"left",transition:"all 0.22s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"};

const CreditNote=({dark=false})=>(
  <div style={{marginTop:"20px",padding:"16px",backgroundColor:dark?"rgba(201,151,58,0.12)":C.goldSoft,borderRadius:"6px",border:"1px solid rgba(201,151,58,0.3)"}}>
    <p style={{color:C.gold,fontSize:"14px",margin:"0 0 10px",lineHeight:"1.6",fontWeight:"bold"}}>Your Blueprint Investment Carries Forward</p>
    <p style={{color:dark?"#c8c8d8":"#555",fontSize:"14px",margin:0,lineHeight:"1.8"}}>
      If you decide to invest in the ETFM Financial Reset ($499), your $47 Blueprint investment is fully credited toward your total. That credit also unlocks an additional discount, bringing your final investment to $425. Your first step toward clarity never loses its value. It builds on it.
    </p>
  </div>
);

const Spinner=()=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 0"}}>
    <div style={{
      width:"44px",height:"44px",borderRadius:"50%",
      border:`4px solid ${C.border}`,
      borderTopColor:C.gold,
      animation:"etfm-spin 0.9s linear infinite",
      marginBottom:"16px"
    }}/>
    <style>{`@keyframes etfm-spin{to{transform:rotate(360deg)}}`}</style>
    <p style={{color:C.muted,fontSize:"14px",margin:0}}>Processing your pattern analysis. Just a moment...</p>
  </div>
);

const DotCred=({label,sub})=>(
  <div style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"10px 0",borderBottom:`0.5px solid ${C.border}`}}>
    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:"7px",opacity:0.7}}/>
    <div>
      <p style={{margin:0,fontSize:"14px",fontWeight:"500",color:C.text,lineHeight:"1.4"}}>{label}</p>
      {sub&&<p style={{margin:"2px 0 0",fontSize:"12px",color:C.muted,fontWeight:"300"}}>{sub}</p>}
    </div>
  </div>
);

export default function ETFMAssessment(){
  const p=new URLSearchParams(window.location.search);
  const hasSid=p.get("session");
  const showBlueprint=p.get("showBlueprint")==="true";
  const showSession=p.get("showSession")==="true";
  const showReset=p.get("showReset")==="true";
  const sessionPaid=p.get("sessionPaid")==="true";
  const resetPaid=p.get("resetPaid")==="true";
  const hasBlueprint=p.get("hasBlueprint")==="true";

  const initScreen=()=>{
    if(window.location.pathname==="/blueprint-success") return "blueprint_complete";
    if(hasSid&&p.get("cancelled")==="true") return "blueprint_cancelled";
    if(hasSid) return "loading";
    if(sessionPaid) return "session_confirmed";
    if(resetPaid) return "reset_confirmed";
    if(showBlueprint) return "blueprint_offer";
    if(showSession) return "session_offer";
    if(showReset) return "reset_offer";
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
  useEffect(() => {
    let timer;
    if (loading) { timer = setTimeout(() => setLoading(false), 3000); }
    return () => clearTimeout(timer);
  }, [loading]);
  const[score,setScore]=useState(null);
  const[sid,setSid]=useState(null);
  const[blueprintClient,setBlueprintClient]=useState(hasBlueprint);

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[screen,freeIdx,bpIdx]);

  useEffect(()=>{
    if(screen!=="q_transition") return;
    const t=setTimeout(advanceFromTransition,2500);
    return()=>clearTimeout(t);
  },[screen]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const s=params.get("session");
    const cancelled=params.get("cancelled");
    if(s&&!params.get("sessionPaid")){
      setSid(s);
      if(cancelled==="true"){setScreen("blueprint_cancelled");}
      else{checkBlueprintSession(s, params.get("checkout_session_id"));}
    }
  },[]);

  useEffect(()=>{
    if(!document.getElementById("ea-fonts")){
      const l=document.createElement("link");l.id="ea-fonts";l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
      document.head.appendChild(l);
    }
  },[]);

  const checkBlueprintSession=async(s, checkoutSessionId)=>{
    try{
      const checkoutParam = checkoutSessionId ? `&checkout_session_id=${encodeURIComponent(checkoutSessionId)}` : "";
      const res=await fetch(`/api/blueprint-session?session_id=${s}${checkoutParam}`);
      const data=await res.json();
      if(data.status==="paid"){
        setFirstName(data.first_name||"");
        setEmail(data.email||"");
        setBlueprintClient(true);
        setScreen("blueprint_intro");
      }else{setScreen("blueprint_unpaid");}
    }catch(e){setScreen("blueprint_unpaid");}
  };

  const selectFree=(val)=>{
    const a=[...freeAns,val];
    setFreeAns(a);
    if(freeIdx<FQ.length-1){setScreen("q_transition");}
    else{setScore(calcScore(a));setScreen("email_gate");}
  };

  const advanceFromTransition=()=>{
    setFreeIdx(freeIdx+1);
    setScreen("chat");
  };

  const submitFree=async(e)=>{
    e.preventDefault();
    if(!firstName.trim()||!email.trim()) return alert("Please fill in both fields");
    setLoading(true);
    const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),3000));
    try{
      await Promise.race([
        fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"subscribe",firstName,email,answers:freeAns.map((v,i)=>({question:FQ[i].bot,answer:v}))})}),
        timeout,
      ]);
      setScreen("transition");
    }catch(e){
      setScreen("transition");
    }finally{setLoading(false);}
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

  const payReset=async()=>{
    setLoading(true);
    try{
      const res=await fetch("/api/reset-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,firstName})});
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
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f5f0e8 0%,#f7f4ef 45%,#f2ece2 100%)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 20px"}}>
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

  if(screen==="loading") return <Wrap><p style={{color:C.muted,fontFamily:"Georgia, serif"}}>One moment. Retrieving your session...</p></Wrap>;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(screen==="intro") return(
    <Wrap max="560px">
      <div style={{marginBottom:"0"}}>
        <div style={{paddingTop:"8px",textAlign:"center"}}>
          <img src="/etfm-logo.png" alt="ETFM" style={{maxWidth:280,width:"100%",borderRadius:12,boxShadow:"0 4px 16px rgba(0,0,0,0.13)",display:"inline-block",marginBottom:32}} />
        </div>
        <div style={{width:"64px",height:"64px",borderRadius:"50%",backgroundColor:C.dark,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 52px",opacity:0.88}}>
          <img src={LOGO_URL} alt="ETFM" style={{width:"48px",height:"48px",objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
        </div>
        <h1 style={{fontSize:"40px",fontFamily:"Georgia, serif",color:C.text,lineHeight:"1.25",marginBottom:"14px",fontWeight:"normal"}}>Most people don't have a money problem.</h1>
        <h2 style={{fontSize:"30px",fontFamily:"Georgia, serif",color:"rgba(26,26,46,0.5)",lineHeight:"1.25",marginBottom:"32px",fontWeight:"normal"}}>They have a pattern problem.</h2>
        <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.9",marginBottom:"40px",maxWidth:"680px",margin:"0 auto 40px",fontFamily:"Georgia, serif"}}>Personal finances have become increasingly complex — not because people lack effort or intelligence, but because most people were never shown how to organize the system beneath the pressure. Accounts, obligations, decisions, and patterns compound quietly over time until the weight of it becomes the background noise of daily life. ETFM was built to change that. This process is designed to help you slow down, see your financial system clearly, and begin rebuilding it with structure, intention, and direction.</p>
        <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.9",marginBottom:"52px",maxWidth:"440px",margin:"0 auto 52px"}}>The same cycles repeat. The same pressure returns. Not because of effort or intelligence, but because the underlying financial system has never been clearly seen or rebuilt. The ETFM Snapshot is a 5-question behavioral diagnostic designed to identify hidden patterns, system leaks, and the financial behaviors shaping your life beneath the surface. It takes about two minutes.</p>
        <button onClick={()=>setScreen("snapshot_intro")} style={{backgroundColor:C.gold,color:C.dark,border:"none",padding:"16px 48px",fontSize:"14px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer",letterSpacing:"1.5px",textTransform:"uppercase"}}>Start Your Snapshot</button>
        <p style={{fontSize:"12px",color:"rgba(122,122,138,0.65)",marginTop:"18px",letterSpacing:"0.3px"}}>Five questions. One clearer view of the system you're operating inside.</p>
      </div>

      <div style={{maxWidth:"460px",margin:"72px auto 0",textAlign:"left"}}>
        <p style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"4px",color:C.gold,marginBottom:"36px",textAlign:"center",opacity:0.7}}>Who Built This</p>
        <p style={{fontSize:"16px",color:"#4a4a5a",fontFamily:"Georgia, serif",lineHeight:"2.1",marginBottom:"22px"}}>
          I created ETFM after years of watching hardworking people do everything they thought they were supposed to do, yet still feel stuck, stressed, and uncertain about money. Over time, I realized the problem was rarely effort or intelligence. It was structure.
        </p>
        <p style={{fontSize:"16px",color:"#4a4a5a",fontFamily:"Georgia, serif",lineHeight:"2.1",marginBottom:"22px"}}>
          Some of my earliest lessons about systems came while playing at Duke under Coach K, where I learned that talent means very little without accountability, discipline, and a clear operating system. Years later, working directly with individuals and families, I kept seeing that same truth play out financially.
        </p>
        <p style={{fontSize:"16px",color:"#4a4a5a",fontFamily:"Georgia, serif",lineHeight:"2.1",marginBottom:"36px"}}>
          ETFM was built to help people see the patterns, fix the leaks, and finally build something that lasts.
        </p>
        <p style={{fontSize:"12px",color:C.muted,textAlign:"right",letterSpacing:"0.8px"}}>Robert Brickey, Creator of ETFM</p>
      </div>
    </Wrap>
  );

  // SNAPSHOT INTRO
  if(screen==="snapshot_intro") return(
    <Wrap max="600px">
      <Tag t="ETFM Behavioral Pattern Diagnostic"/>
      <h1 style={{fontSize:"34px",fontFamily:"Georgia, serif",marginBottom:"16px",color:C.text,lineHeight:"1.3"}}>Before we surface your pattern, here is what this diagnostic does.</h1>
      <p style={{fontSize:"15px",color:C.muted,marginBottom:"24px",lineHeight:"1.8",fontStyle:"italic"}}>Before we surface your pattern, it helps to understand what this diagnostic is designed to reveal — and why your honest responses matter more than your ideal ones.</p>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"24px",lineHeight:"1.8"}}>This is not a quiz. It is a 5-question behavioral pattern analysis designed to identify the structural and behavioral factors currently shaping your financial decisions. Each question surfaces a specific layer of your financial operating system.</p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"24px",marginBottom:"32px",textAlign:"left"}}>
        {[
          {label:"Awareness",desc:"Your current level of financial visibility"},
          {label:"Money Pattern",desc:"How you handle income, expenses, and unexpected funds"},
          {label:"Stress Response",desc:"How you respond when financial pressure builds"},
          {label:"Financial Structure",desc:"The systems and habits you currently have in place"},
          {label:"System Readiness",desc:"Your ability and mindset to build and follow a plan"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"16px",padding:"18px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
            <span style={{color:C.gold,fontSize:"11px",fontWeight:"normal",minWidth:"24px",paddingTop:"4px",opacity:0.7}}>{i+1}</span>
            <div>
              <p style={{color:"#e8e3da",fontSize:"15px",fontWeight:"400",margin:"0 0 5px",letterSpacing:"0.2px"}}>{item.label}</p>
              <p style={{color:"#6a6a7a",fontSize:"13px",margin:0,lineHeight:"1.6"}}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={{fontSize:"14px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Answer based on what is actually true, not what you wish were true. The diagnostic is only useful if it reflects where things actually stand today.</p>
      <button onClick={()=>setScreen("chat")} style={{backgroundColor:C.gold,color:C.dark,border:"none",padding:"16px 44px",fontSize:"16px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer"}}>Begin the Diagnostic</button>
    </Wrap>
  );

  // FREE CHAT
  if(screen==="chat"){
    const q=FQ[freeIdx];
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f5f0e8 0%,#f7f4ef 45%,#f2ece2 100%)",padding:"48px 20px"}}>
        <div style={{maxWidth:"580px",margin:"0 auto"}}>
          {freeIdx===0&&(
            <div style={{marginBottom:"36px"}}>
              <p style={{color:"rgba(26,26,46,0.5)",fontSize:"14px",lineHeight:"1.9",margin:0,fontStyle:"italic",letterSpacing:"0.2px",textAlign:"center"}}>Five questions. Each one surfaces a specific layer of your financial operating system. Answer based on what is actually true right now.</p>
            </div>
          )}
          <div style={{marginBottom:"48px"}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"0"}}>
              {STAGES.map((stage,si)=>(
                <div key={si} style={{display:"flex",alignItems:"flex-end"}}>
                  <div style={{textAlign:"center",padding:"0 10px"}}>
                    <p style={{fontSize:"9px",textTransform:"uppercase",letterSpacing:"1.8px",margin:"0 0 7px",color:si===freeIdx?C.gold:si<freeIdx?"rgba(201,151,58,0.45)":"rgba(122,122,138,0.5)",fontWeight:si===freeIdx?"600":"400",transition:"all 0.3s ease"}}>{stage}</p>
                    <div style={{width:si===freeIdx?"8px":"5px",height:si===freeIdx?"8px":"5px",borderRadius:"50%",margin:"0 auto",backgroundColor:si===freeIdx?C.gold:si<freeIdx?"rgba(201,151,58,0.35)":"rgba(232,227,218,0.7)",transition:"all 0.3s ease",boxShadow:si===freeIdx?"0 0 8px rgba(201,151,58,0.4)":"none"}}/>
                  </div>
                  {si<4&&<div style={{width:"28px",height:"1px",backgroundColor:si<freeIdx?"rgba(201,151,58,0.25)":"rgba(232,227,218,0.6)",marginBottom:"4px"}}/>}
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"40px",padding:"0"}}>
            {q.subtext&&<p style={{color:"rgba(122,122,138,0.85)",fontSize:"13px",margin:"0 0 14px",lineHeight:"1.7"}}>{q.subtext}</p>}
            {q.highlight&&<p style={{color:"rgba(26,26,46,0.5)",fontSize:"14px",fontStyle:"italic",letterSpacing:"0.5px",lineHeight:"1.9",margin:"0 0 24px",paddingLeft:"14px",borderLeft:"1.5px solid rgba(201,151,58,0.35)"}}>{q.highlight}</p>}
            <p style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"8px",opacity:0.8}}>{STAGES[freeIdx]}</p>
            <p style={{fontSize:"12px",color:"rgba(122,122,138,0.65)",marginBottom:"16px",lineHeight:"1.6",fontStyle:"italic",margin:"0 0 16px"}}>
              {["How clearly you currently see your financial picture.","How you respond when financial stress builds.","The systems and habits you have in place.","Where you are trying to go financially.","How ready you are to build and follow a system."][freeIdx]}
            </p>
            <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,margin:0,lineHeight:"1.35",fontWeight:"normal"}}>{q.bot}</h2>
          </div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>selectFree(opt.value)} style={OPT}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor="rgba(201,151,58,0.07)";e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(201,151,58,0.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.8)";e.currentTarget.style.borderColor="rgba(232,227,218,0.7)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // QUESTION TRANSITION
  if(screen==="q_transition"){
    const line=Q_TRANSITIONS[freeIdx]||"";
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f5f0e8 0%,#f7f4ef 45%,#f2ece2 100%)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 20px"}}>
        <div style={{maxWidth:"480px",width:"100%",textAlign:"center"}}>
          <p style={{fontSize:"26px",fontFamily:"Georgia, serif",color:C.text,lineHeight:"1.6",fontWeight:"normal"}}>{line}</p>
        </div>
      </div>
    );
  }

  // EMAIL GATE (after questions, before results)
  if(screen==="email_gate") return(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <div style={{maxWidth:"560px",width:"100%",textAlign:"center"}}>
        <Tag t="Pattern Analysis Complete"/>
        <h2 style={{fontSize:"32px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Your behavioral pattern has been identified.</h2>
        <p style={{fontSize:"15px",color:C.muted,marginBottom:"20px",lineHeight:"1.8",fontStyle:"italic",maxWidth:"480px",margin:"0 auto 20px"}}>Your pattern has been identified. Enter your details to receive your complete Awareness Score, Financial Archetype, and personalized behavioral breakdown.</p>
        <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.8"}}>What we found reveals how your financial decisions have been structured, where hidden system leaks exist, and what behavioral blind spots have been shaping your financial life without your awareness. Your Awareness Score is ready.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"32px"}}>
          {[
            {label:"Awareness Score",value:"Ready",locked:false},
            {label:"Financial Archetype",value:"Locked",locked:true},
            {label:"Primary Pattern",value:"Locked",locked:true},
          ].map((item,i)=>(
            <div key={i} style={{backgroundColor:C.dark,borderRadius:"8px",padding:"16px 10px",textAlign:"center"}}>
              <p style={{color:"#6a6a7a",fontSize:"10px",textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 8px",lineHeight:"1.4"}}>{item.label}</p>
              <p style={{color:item.locked?"#3a3a5a":C.gold,fontSize:"18px",fontWeight:"bold",margin:0}}>{item.locked?"🔒":"✓"}</p>
            </div>
          ))}
        </div>
        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"32px"}}>
          <h3 style={{fontSize:"19px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"12px",lineHeight:"1.45",fontWeight:"normal"}}>Your Awareness Score has been calculated. Your deeper behavioral breakdown is ready.</h3>
          <p style={{fontSize:"14px",color:C.muted,marginBottom:"24px",lineHeight:"1.7"}}>Enter your name and email to unlock your results and receive your Financial Archetype, full Score breakdown, and personalized strategic insight.</p>
          {loading ? <Spinner/> : (
            <form onSubmit={submitFree}>
              <div style={{marginBottom:"16px",textAlign:"left"}}>
                <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>First Name</label>
                <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Your first name" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:"20px",textAlign:"left"}}>
                <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
              </div>
              <button type="submit" style={{width:"100%",padding:"14px",backgroundColor:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontSize:"16px",fontWeight:"bold",cursor:"pointer"}}>
                Unlock My Awareness Score
              </button>
            </form>
          )}
          <p style={{fontSize:"11px",color:C.muted,marginTop:"16px",textAlign:"center"}}>Your information is never sold or shared.</p>
        </div>
      </div>
    </div>
  );

  // TRANSITION
  if(screen==="transition"){
    const SCORE_CATEGORIES=["Awareness","Money Pattern","Stress Response","Financial Structure","System Readiness"];
    const breakdown=freeAns.map((val,i)=>{
      const opt=FQ[i].options.find(o=>o.value===val);
      return{category:SCORE_CATEGORIES[i],answer:opt?opt.label:val,score:SCORE_MAP[val]||0};
    });
    return(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <div style={{maxWidth:"580px",width:"100%",textAlign:"center"}}>
        <p style={{fontSize:"15px",color:C.muted,lineHeight:"1.8",marginBottom:"24px",fontStyle:"italic",textAlign:"left"}}>What follows is a diagnostic reading of your current financial operating system — where it is holding, and where it is leaking.</p>
        <p style={{color:'#4A4A4A',fontSize:'15px',lineHeight:'1.9',marginBottom:'24px',textAlign:'left'}}>What this diagnostic uncovered is not a reflection of your effort. It is a map of how your financial operating system is currently running: which behavioral patterns are active, where structural gaps are creating friction, and where hidden system leaks are driving the cycles you keep experiencing. Most people don't have an effort problem. They have a structure problem. Now you can see it.</p>
        <Tag t="Behavioral Pattern Analysis Complete"/>
        <h2 style={{fontSize:"32px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Your financial operating system has been mapped.</h2>
        <p style={{fontSize:"16px",color:C.muted,marginBottom:"24px",lineHeight:"1.7"}}>What you're looking at isn't a grade. It's a behavioral and structural diagnostic. The patterns it identified have been running quietly in the background, shaping every financial decision you've made. This is what they look like when they're named.</p>
        <p style={{color:'#4A4A4A',fontSize:'14px',lineHeight:'1.9',marginBottom:'24px'}}>Your Awareness Score is calculated from five behavioral and structural components rooted in the ETFM Financial Operating System: financial visibility, money patterns, stress response architecture, structural organization, and system readiness. Component 1 is revealed below. Your full breakdown, Financial Archetype, and personalized strategic insights are in your inbox.</p>
        <div style={{backgroundColor:C.white,border:`2px solid ${C.gold}`,borderRadius:"12px",padding:"28px 24px",marginBottom:"24px",textAlign:"center"}}>
          <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",marginBottom:"16px",fontWeight:"bold"}}>Your Awareness Score</p>
          <p style={{color:C.dark,fontSize:"52px",fontWeight:"bold",fontFamily:"Georgia, serif",margin:"0 0 4px",lineHeight:"1"}}>{score}</p>
          <p style={{color:C.muted,fontSize:"16px",margin:"0 0 16px"}}>out of 100</p>
          <p style={{color:C.muted,fontSize:"14px",margin:0,lineHeight:"1.6"}}>This is not a grade. It is a diagnostic reading of how your current financial operating system is structured: where it is holding, and where it is leaking. Lower scores surface where the system needs to be rebuilt. Higher scores reveal where structure is already working.</p>
        </div>
        <div style={{backgroundColor:C.dark,borderRadius:"12px",padding:"36px 30px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{color:"#e8e3da",fontSize:"15px",fontWeight:"600",marginBottom:"24px",textAlign:"center",lineHeight:"1.5"}}>Five components. Five behavioral and structural indicators of your financial operating system.</p>
          {[
            {name:"Awareness",desc:"How clearly you see where your money goes and what drives your decisions."},
            {name:"Money Pattern",desc:"How you consistently handle income, expenses, and unexpected funds."},
            {name:"Stress Response",desc:"How you respond when financial pressure builds or problems arise."},
            {name:"Financial Structure",desc:"The systems and habits you have in place to manage your finances."},
            {name:"System Readiness",desc:"Your ability and mindset to build and follow a financial plan."},
          ].map((comp,i)=>(
            <div key={i} style={{marginBottom:"10px",padding:"14px 16px",backgroundColor:i===0?"rgba(255,255,255,0.06)":"rgba(5,5,15,0.25)",borderRadius:"8px",border:i===0?"1px solid rgba(201,151,58,0.2)":"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",position:"relative",overflow:"hidden"}}>
              {i>0&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 50%,rgba(5,5,15,0.4))",pointerEvents:"none"}}/>}
              <div style={{flex:1}}>
                <p style={{color:i===0?"#e8e3da":"rgba(232,227,218,0.3)",fontSize:"13px",fontWeight:"600",margin:"0 0 4px"}}>{comp.name}</p>
                <p style={{color:"#6a6a7a",fontSize:"12px",margin:0,lineHeight:"1.5",filter:i>0?"blur(3px)":"none",userSelect:i>0?"none":"auto"}}>{comp.desc}</p>
              </div>
              {i===0
                ? <span style={{color:C.gold,fontSize:"17px",fontWeight:"bold",flexShrink:0}}>{breakdown[0]?.score??"-"} / 20</span>
                : <div style={{flexShrink:0,textAlign:"right",position:"relative",zIndex:1}}>
                    <span style={{color:"rgba(201,151,58,0.55)",fontSize:"14px"}}>🔒</span>
                    <p style={{color:"#3a3a4a",fontSize:"10px",fontStyle:"italic",margin:"3px 0 0",whiteSpace:"nowrap",letterSpacing:"0.3px"}}>In your email</p>
                  </div>
              }
            </div>
          ))}
        </div>

        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"28px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",color:C.gold,marginBottom:"16px"}}>A Note From Robert, ETFM Founder</p>
          <p style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"16px",fontStyle:"italic"}}>
            "Most people never take the time to look honestly at their financial patterns. You just did. That matters more than you know. Where you are right now is not where you have to stay. Awareness is always where real movement begins."
          </p>
          <div style={{marginTop:"20px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"I left that conversation knowing exactly what to do for the first time."</p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>Strategic Reset Client</p>
            <p style={{margin:"4px 0 0",fontSize:"11px",color:C.muted,fontStyle:"italic"}}>Name protected for privacy.</p>
          </div>
          <div style={{marginTop:"12px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"Most advisors talk at you. Robert actually looked at my situation."</p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>ETFM Client</p>
            <p style={{margin:"4px 0 0",fontSize:"11px",color:C.muted,fontStyle:"italic"}}>Name protected for privacy.</p>
          </div>
        </div>

        <div style={{backgroundColor:C.bg,borderRadius:"8px",padding:"18px 22px",marginBottom:"24px",border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`}}>
          <p style={{margin:0,color:C.muted,fontSize:"14px",lineHeight:"1.8"}}>Your Financial Archetype, full Awareness Score breakdown, and personalized strategic insight are being sent to your inbox now. Check your spam folder if you don't see it within a few minutes.</p>
        </div>
        <div style={{marginBottom:"8px"}}>
          <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"20px",textAlign:"center",opacity:0.7}}>What Comes Next</p>
          {[
            {tier:"SNAPSHOT",desc:"See the pattern.",active:true,note:"Complete"},
            {tier:"BLUEPRINT",desc:"Understand the system.",active:false,note:"$47"},
            {tier:"RESET",desc:"Rebuild the structure.",active:false,note:"$99"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",marginBottom:"8px",backgroundColor:item.active?"rgba(201,151,58,0.07)":"rgba(26,26,46,0.03)",borderRadius:"8px",border:item.active?"1px solid rgba(201,151,58,0.2)":"1px solid rgba(232,227,218,0.5)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"18px"}}>
                <span style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",color:item.active?C.gold:"rgba(122,122,138,0.45)",fontWeight:"600",minWidth:"80px"}}>{item.tier}</span>
                <span style={{fontSize:"14px",fontFamily:"Georgia, serif",color:item.active?C.text:"rgba(26,26,46,0.35)"}}>{item.desc}</span>
              </div>
              <span style={{fontSize:"12px",color:item.active?"rgba(201,151,58,0.8)":C.muted,fontStyle:item.active?"normal":"italic"}}>{item.note}</span>
            </div>
          ))}
          <button onClick={()=>setScreen("blueprint_offer")} style={{display:"block",width:"100%",padding:"14px",marginTop:"16px",backgroundColor:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontSize:"15px",fontWeight:"bold",cursor:"pointer"}}>
            Go Deeper: Unlock the Blueprint
          </button>
        </div>
      </div>
    </div>
  );};

  // SNAPSHOT CONFIRMED
  if(screen==="snapshot_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="Snapshot Delivered"/>
      <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        Your Snapshot is on its way.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"24px"}}>
        Your Snapshot is on its way. Check your inbox in the next few minutes. If you do not see it, check your spam folder.
      </p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"16px"}}>
        You just did something most people never do, you took an honest look at your own financial patterns. That kind of awareness is the foundation of everything that changes next.
      </p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"40px"}}>
        Your Financial Archetype, Awareness Score, and personalized strategic insight are on their way to your inbox now. Check your spam folder if you don't see it within a few minutes.
      </p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"24px",textAlign:"left"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What to do next</p>
        {[
          "Open your Snapshot email",
          "Read your Financial Archetype and Awareness Score",
          "Review your personalized strategic insight",
          "Follow the next steps outlined inside the email",
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 0",color:"#c8c8d8",fontSize:"14px",lineHeight:"1.6",borderBottom:i<3?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}.&nbsp;&nbsp;{item}</div>
        ))}
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // BLUEPRINT OFFER
  if(screen==="blueprint_offer") return(
    <Wrap max="560px">
      <div style={{textAlign:"center"}}>
        <Tag t="Step 2 - Structural Visibility"/>
        <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"18px",lineHeight:"1.2"}}>
          See the system behind the stress.
        </h2>
        <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"24px"}}>
          Your Snapshot revealed the pattern. The Strategic Blueprint goes deeper, showing the behavioral cycles, structural gaps, and decision-making loops that are shaping your financial life.
        </p>
        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"22px",textAlign:"left",marginBottom:"28px"}}>
          {[
            "18-question Strategic Visibility Diagnostic",
            "Personalized Financial Archetype analysis",
            "ETFM Behavioral Operating Framework",
            "30-Day Strategic Reset Protocol",
            "$47 credited toward the Reset and Strategic Partnership",
          ].map((item,i)=>(
            <p key={i} style={{margin:"0 0 12px",color:C.text,fontSize:"14px",lineHeight:"1.6"}}>{i+1}. {item}</p>
          ))}
        </div>
        <button onClick={payBlueprint} disabled={loading} style={{display:"inline-block",padding:"16px 32px",background:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:loading?"not-allowed":"pointer",width:"100%",maxWidth:"420px"}}>
          {loading ? "One moment, setting up your Blueprint..." : "Unlock Your Strategic Blueprint - $47"}
        </button>
        <p style={{fontSize:"12px",color:C.muted,lineHeight:"1.7",marginTop:"18px"}}>
          After payment, you will complete the diagnostic and receive your personalized Blueprint by email.
        </p>
      </div>
    </Wrap>
  );

  // BLUEPRINT INTRO (post-payment, pre-questions)
  if(screen==="blueprint_intro") return(
    <Wrap max="520px">
      <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"4px",color:C.gold,marginBottom:"52px",opacity:0.8}}>ETFM Strategic Blueprint</p>
      <h1 style={{fontSize:"42px",fontFamily:"Georgia, serif",color:C.text,lineHeight:"1.2",marginBottom:"22px",fontWeight:"normal"}}>Let's identify the pattern beneath the pressure.</h1>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.9",marginBottom:"20px",maxWidth:"440px",margin:"0 auto 20px"}}>What you are about to complete is not a questionnaire. It is a financial visibility review designed to surface the structural gaps, behavioral patterns, and decision-making loops currently shaping your financial life.</p>
      <p style={{fontSize:"14px",color:"rgba(122,122,138,0.65)",fontStyle:"italic",lineHeight:"1.7",marginBottom:"64px",marginTop:"20px"}}>There are no wrong answers. Accuracy matters more than perfection.</p>
      <div style={{maxWidth:"400px",margin:"0 auto 64px",textAlign:"left"}}>
        <p style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"28px",opacity:0.7}}>What Happens Next</p>
        {[
          "01 - You complete 18 visibility questions.",
          "02 - Your Financial Archetype is identified.",
          "03 - Your personalized Blueprint is delivered to your inbox.",
        ].map((line,i)=>(
          <p key={i} style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.5",marginBottom:"20px",margin:"0 0 20px"}}>{line}</p>
        ))}
      </div>
      <button onClick={()=>setScreen("blueprint_chat")} style={{backgroundColor:C.dark,color:C.gold,border:"none",padding:"16px 48px",fontSize:"14px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer",letterSpacing:"1.5px",textTransform:"uppercase"}}>Begin the Visibility Review</button>
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
            <p style={{fontSize:"11px",color:C.gold,textTransform:"uppercase",letterSpacing:"1px",margin:0}}>Strategic Blueprint: {q.section}</p>
            <p style={{fontSize:"11px",color:C.muted,margin:0}}>Financial Visibility Review - {bpIdx+1} of {BQ.length}</p>
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
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor="rgba(201,151,58,0.07)";e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(201,151,58,0.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.8)";e.currentTarget.style.borderColor="rgba(232,227,218,0.7)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}>

              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // BLUEPRINT COMPLETE
  if(screen==="blueprint_complete") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#f5f0e8 0%,#f7f4ef 45%,#f2ece2 100%)",padding:"80px 20px"}}>
      <div style={{maxWidth:"520px",margin:"0 auto",textAlign:"center"}}>

        <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"4px",color:C.gold,marginBottom:"56px",opacity:0.8}}>ETFM Strategic Blueprint</p>

        <h1 style={{fontSize:"40px",fontFamily:"Georgia, serif",color:C.text,lineHeight:"1.2",marginBottom:"28px",fontWeight:"normal"}}>Your Strategic Blueprint has been prepared.</h1>

        <div style={{textAlign:"left",marginBottom:"72px"}}>
          <p style={{fontSize:"17px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"32px"}}>What's arriving in your inbox:</p>
          {[
            "Your personalized Financial Blueprint",
            "Your complete Awareness Score breakdown",
            "Your Financial Archetype and pattern analysis",
            "Your Strategic Roadmap",
            "Your 30-Day Reset Protocol",
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",marginBottom:"18px"}}>
              <span style={{color:C.gold,fontSize:"18px",lineHeight:"1",marginRight:"14px",marginTop:"1px",flexShrink:0}}>-</span>
              <p style={{fontSize:"15px",color:C.muted,lineHeight:"1.7",margin:0}}>{item}</p>
            </div>
          ))}
          <p style={{fontSize:"13px",color:"rgba(122,122,138,0.6)",fontStyle:"italic",marginTop:"28px",marginBottom:0,lineHeight:"1.7"}}>Typically arrives within a few minutes. Check your spam folder if you don't see it right away.</p>
        </div>

        <p style={{fontSize:"19px",fontFamily:"Georgia, serif",color:C.text,fontStyle:"italic",opacity:0.4,lineHeight:"1.7",marginBottom:"80px"}}>The moment a pattern becomes visible, it can begin to change.</p>

        <div style={{textAlign:"left",marginBottom:"72px"}}>
          <p style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"28px",opacity:0.7}}>What Happens Next</p>
          {[
            "01 - Your Strategic Blueprint arrives by email.",
            "02 - Review your Awareness Score and behavioral patterns.",
            "03 - Begin your 30-Day Reset Protocol.",
            "04 - Decide whether to continue into the ETFM Reset Experience.",
          ].map((line,i)=>(
            <p key={i} style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.6",margin:"0 0 20px"}}>{line}</p>
          ))}
        </div>

        <div style={{textAlign:"left",marginBottom:"72px"}}>
          <p style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"20px",opacity:0.7}}>Before Your Blueprint Arrives</p>
          <p style={{fontSize:"15px",color:C.muted,lineHeight:"1.9",margin:0}}>Have a notebook nearby. Some of the patterns you uncover may change the way you see your financial life moving forward.</p>
        </div>

        <p style={{fontSize:"14px",color:"rgba(122,122,138,0.6)",lineHeight:"1.9",fontStyle:"italic",marginBottom:"72px"}}>If you continue into the ETFM Reset Experience, your Blueprint investment is fully credited toward the next phase.</p>

        <p style={{fontSize:"12px",color:C.muted}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>

      </div>
    </div>
  );

  // SESSION OFFER
  if(screen==="session_offer") return(
    <Wrap max="560px">
      <div style={{textAlign:"center"}}>
        <Tag t="Step 4 - Strategic Optimization"/>
        <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"18px",lineHeight:"1.2"}}>
          Work directly with Robert.
        </h2>
        <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"24px"}}>
          The Strategic Reset Partnership begins with Calendly. Choose your time first, then follow the confirmation steps to complete your intake and payment.
        </p>
        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"22px",textAlign:"left",marginBottom:"28px"}}>
          {[
            "38-question Strategic Discovery Intake reviewed before your first call",
            "Two private 30-minute strategy sessions",
            "Full Matrix Score and Structural Analysis",
            "Custom 90-Day Strategic Reset Roadmap",
            "60 days of priority email support",
          ].map((item,i)=>(
            <p key={i} style={{margin:"0 0 12px",color:C.text,fontSize:"14px",lineHeight:"1.6"}}>{i+1}. {item}</p>
          ))}
        </div>
        <a href={`${CALENDLY}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(firstName)}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"16px 32px",background:C.dark,color:C.gold,textDecoration:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",width:"100%",maxWidth:"440px",boxSizing:"border-box"}}>
          {blueprintClient ? "Book on Calendly - $425 Blueprint Client Rate" : "Book on Calendly - $499 Strategic Partnership"}
        </a>
        <p style={{fontSize:"13px",color:C.muted,lineHeight:"1.7",marginTop:"18px"}}>
          {blueprintClient ? "Your $47 Blueprint purchase is credited, reducing your Strategic Reset rate to $425." : "Blueprint clients receive a credited Strategic Reset rate of $425."}
        </p>
      </div>
    </Wrap>
  );

  // SESSION CONFIRMED
  if(screen==="session_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="ETFM Financial Reset"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        You're confirmed. Let's get to work.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>Your ETFM Financial Reset with Robert Brickey is confirmed and your payment has been received. Check your Calendly confirmation email for your pre-session call date and time.</p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What happens next</p>
        {[
          "Check your email for your Calendly pre-session call confirmation",
          "A short intake form will arrive within 24 hours, complete it before your first call",
          "Attend your first 30-minute strategy call with Robert, he'll arrive fully prepared",
          "Receive your personalized financial roadmap and strategic score",
          "Attend your second 30-minute call to review your plan and confirm your direction",
          "Detailed session notes will be sent to you after both calls",
        ].map((step,i)=>(
          <div key={i} style={{padding:"10px 0",color:"#c8c8d8",fontSize:"14px",lineHeight:"1.6",borderBottom:i<5?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}.&nbsp;&nbsp;{step}</div>
        ))}
      </div>
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",textAlign:"left"}}>
        <p style={{color:C.text,fontSize:"14px",fontWeight:"bold",marginBottom:"8px"}}>Your Reset includes:</p>
        <p style={{color:C.muted,fontSize:"14px",lineHeight:"1.8",margin:0}}>Two private 1-on-1 strategy sessions with Robert. A personalized financial action plan built around your real situation. Financial structure recommendations. Clear next-step planning. Detailed session notes from both calls. 90 days of priority follow-up support.</p>
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>
    </Wrap>
  );

  // BLUEPRINT UNPAID
  if(screen==="blueprint_unpaid") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>This session hasn't been activated yet.</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Complete your payment to unlock your Strategic Blueprint and begin the diagnostic.</p>
      <button onClick={()=>setScreen("blueprint_offer")} style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer"}}>Unlock Your Blueprint: $47</button>
    </Wrap>
  );

  // BLUEPRINT CANCELLED
  if(screen==="blueprint_cancelled") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>Completely fine.</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Your Snapshot is still in your inbox. Whenever you're ready to go deeper, to understand the patterns behind the patterns, the Blueprint will be right here waiting.</p>
      <button onClick={()=>setScreen("blueprint_offer")} style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer"}}>Unlock Your Blueprint: $47</button>
    </Wrap>
  );

  // RESET CONFIRMED
  if(screen==="reset_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="ETFM Financial Reset, Step 3"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        Congratulations. Your Reset Experience is confirmed.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>
        Thank you for taking this step. Your purchase is complete, and your private portal access is being delivered to your inbox now.
      </p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"24px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"20px"}}>The 4 Phases You're About to Work Through</p>
        {[
          {phase:"Phase 1",title:"Stabilize",body:"Reduce pressure and confusion. This phase is about getting clear on where things actually stand before trying to change them."},
          {phase:"Phase 2",title:"Organize",body:"Build visibility and structure. You'll establish the financial architecture your decisions can flow through reliably."},
          {phase:"Phase 3",title:"Simplify",body:"Create repeatable systems. Complexity is replaced with routines you can sustain without willpower."},
          {phase:"Phase 4",title:"Execute",body:"Build consistency and momentum. You stop restarting and start compounding, one intentional week at a time."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.08)":"none"}}>
            <p style={{margin:"0 0 4px",color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px"}}>{item.phase}</p>
            <p style={{margin:"0 0 4px",color:C.white,fontSize:"14px",fontWeight:"bold"}}>{item.title}</p>
            <p style={{margin:0,color:"#a0a0b0",fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
      </div>
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"18px 22px",marginBottom:"24px",textAlign:"left"}}>
        <p style={{margin:0,color:C.muted,fontSize:"14px",lineHeight:"1.8"}}>What happens next: check your email for <strong style={{color:C.text}}>Your ETFM Reset Experience is ready</strong>. That email contains your portal access link and the next steps for beginning the Reset. Check spam or promotions if you do not see it within a few minutes.</p>
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // RESET OFFER
  if(screen==="reset_offer") return(
    <Wrap max="560px">
      <div style={{textAlign:"center"}}>
        <Tag t="Step 3 - Operational Stabilization"/>
        <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"18px",lineHeight:"1.2"}}>
          Build the structure.
        </h2>
        <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"24px"}}>
          The ETFM Reset Experience is a guided implementation system that helps you organize your financial life, reduce pressure, and create a weekly operating rhythm you can actually sustain.
        </p>
        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"22px",textAlign:"left",marginBottom:"28px"}}>
          {[
            "Financial Reset Workbook and Reality Audit",
            "Bill Organization System",
            "Financial Calendar and Visibility System",
            "Spending Pattern Analysis",
            "Weekly System Review Framework",
            "Private portal access delivered by email after payment",
          ].map((item,i)=>(
            <p key={i} style={{margin:"0 0 12px",color:C.text,fontSize:"14px",lineHeight:"1.6"}}>{i+1}. {item}</p>
          ))}
        </div>
        <button onClick={payReset} disabled={loading} style={{display:"inline-block",padding:"16px 32px",background:C.dark,color:C.gold,border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:loading?"not-allowed":"pointer",width:"100%",maxWidth:"420px"}}>
          {loading ? "One moment, setting up your Reset..." : "Begin Your Reset Experience - $99"}
        </button>
        <p style={{fontSize:"12px",color:C.muted,lineHeight:"1.7",marginTop:"18px"}}>
          After payment, check your email for your private portal access link.
        </p>
      </div>
    </Wrap>
  );

  return null;
}
